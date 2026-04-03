@AGENTS.md

# ShipFast — Project Guide

Personal Next.js SaaS boilerplate. Not a commercial product. Goal: clone → working local dev in under 5 minutes.

---

## Commands

```bash
npm run build       # typecheck (tsc) + production build — run before committing
npm run lint        # eslint
npm run dev         # dev server
npm run email:preview  # React Email dev server at :3000

./committer         # ONLY way to commit — never bare git commit
```

No test suite yet.

---

## Stack — Exact Versions

| Package | Version | Critical notes |
|---------|---------|----------------|
| Next.js | 16.2.2 | `proxy.ts` not `middleware.ts`; see Breaking Changes |
| TypeScript | 6.0.2 | strict — no `any`, no `!`, explicit return types |
| React | 19.2.4 | — |
| Tailwind | 4.2 | CSS-first, no `tailwind.config.js` |
| shadcn/ui | 4.1.2 | `@base-ui/react` primitives — `asChild` does not exist |
| Prisma | 7.6.0 | URL in `prisma.config.ts`; `@prisma/adapter-pg` required at runtime |
| Auth.js | 5.0.0-beta.30 | `@auth/prisma-adapter` — not `next-auth/adapters/prisma` |
| Stripe | 22.0.0 | `apiVersion: "2025-03-31.basil"` required in constructor |
| Resend | 6.10.0 | Lazy singleton — see Patterns |
| next-mdx-remote | 6.0.0 | import from `next-mdx-remote/rsc`, not root |
| Zod | 4.3.6 | `.url()/.email()/.startsWith()` deprecated — use `.regex()` |

---

## File Map

### Configuration
```
config.ts                    ← single source of truth: appName, pricing, FAQ, features, social
prisma.config.ts             ← Prisma CLI connection (DIRECT_URL)
prisma/schema.prisma         ← DB schema — no url/directUrl here (Prisma 7)
instrumentation.ts           ← server startup hook — activates lib/env.ts
proxy.ts                     ← Next.js 16 middleware (rate limiting)
next.config.ts               ← security headers
```

### Library
```
lib/auth.ts                  ← NextAuth config — Google + Resend providers + PrismaAdapter
lib/prisma.ts                ← DB client singleton (Pool + PrismaPg adapter)
lib/stripe.ts                ← Stripe lazy singleton + createCheckoutSession + createPortalSession
lib/resend.ts                ← Resend lazy singleton
lib/env.ts                   ← Zod env validation (process.exit on failure) — imported by instrumentation.ts
lib/rate-limit.ts            ← in-process Map rate limiter (⚠️ not effective on Vercel)
lib/blog.ts                  ← getAllPosts() + getPost(slug) — reads content/blog/
lib/button-variants.ts       ← buttonVariants CVA (no "use client" — safe in RSC)
lib/utils.ts                 ← cn() only
```

### Routes
```
app/(marketing)/page.tsx            → /
app/(marketing)/pricing/page.tsx    → /pricing
app/(auth)/login/page.tsx           → /login
app/(auth)/verify/page.tsx          → /verify
app/(dashboard)/dashboard/page.tsx  → /dashboard
app/(dashboard)/dashboard/settings/page.tsx → /dashboard/settings
app/blog/page.tsx                   → /blog
app/blog/[slug]/page.tsx            → /blog/[slug]
app/sitemap.ts                      → /sitemap.xml
```

### API Routes
```
app/api/auth/[...nextauth]/route.ts   ← Auth.js handler
app/api/checkout/route.ts            ← POST — Stripe checkout session (auth-gated, Zod validated)
app/api/portal/route.ts              ← POST — Stripe portal session
app/api/webhooks/stripe/route.ts     ← Stripe webhook (HMAC verification)
app/api/webhooks/lemonsqueezy/route.ts ← LS webhook (timingSafeEqual HMAC)
app/api/email/send/route.ts          ← POST — programmatic email (auth-gated)
```

### Components
```
components/ui/                 ← shadcn/ui — Button, Card, Input, Dialog, Sheet, etc.
components/layout/Header.tsx   ← sticky, responsive, auth-aware mobile nav
components/layout/Footer.tsx
components/landing/Hero.tsx
components/landing/Features.tsx
components/landing/Pricing.tsx ← driven by config.ts, uses CheckoutButton
components/landing/FAQ.tsx     ← driven by config.ts
components/landing/CTA.tsx
components/shared/CheckoutButton.tsx  ← client: POST /api/checkout → redirect
components/shared/LoginForm.tsx       ← client: Google + magic link signIn()
components/shared/SignOutButton.tsx   ← client: signOut()
components/shared/ThemeProvider.tsx
components/shared/ThemeToggle.tsx
components/shared/JsonLd.tsx          ← <script type="application/ld+json">{JSON.stringify(data)}</script>
```

### Content
```
content/blog/*.mdx     ← blog posts (frontmatter: title, description, date, author, image?)
emails/WelcomeEmail.tsx
emails/MagicLinkEmail.tsx
emails/ReceiptEmail.tsx
```

---

## Breaking Changes from Training Data

### Next.js 16
- **`proxy.ts`** replaces `middleware.ts`. Export: `proxy: NextProxy`. Config type: `ProxyConfig`.
- **`instrumentation.ts`** is stable (no config flag needed). `register()` runs once before first request on nodejs runtime.
- **Route group conflict**: `(dashboard)/page.tsx` and `(marketing)/page.tsx` both resolve to `/`. Dashboard lives at `(dashboard)/dashboard/page.tsx` → `/dashboard`.

### Prisma 7
- **No `url` in `schema.prisma`**. URL lives in `prisma.config.ts` under `datasource.url`.
- **`@prisma/adapter-pg` required at runtime**. `new PrismaClient({ adapter: new PrismaPg(pool) })`.
- Migrations use `DIRECT_URL` (non-pooled). Runtime uses `DATABASE_URL` (PgBouncer pooled).

### shadcn/ui v4
- **`asChild` does not exist**. `@base-ui/react` uses a `render` prop for polymorphism.
- **`buttonVariants` is in `lib/button-variants.ts`** (no `"use client"`), not `components/ui/button.tsx`. RSC components import from there directly — never from `components/ui/button`.
- Error when importing `buttonVariants` from the wrong place: `"Attempted to call buttonVariants() from the server but buttonVariants is on the client"`.

### Stripe 22
- Constructor requires `apiVersion: "2025-03-31.basil"` — omitting it is a TypeScript error.

### Zod 4
- `.url()`, `.email()`, `.startsWith()`, `.endsWith()` → deprecated. Use `.regex()`.
- `.flatten()` → removed. Use `.issues.map(i => ...)`.
- Always `safeParse()` in API routes — `parse()` throws unhandled exceptions.

### next-mdx-remote 6
- Import from `next-mdx-remote/rsc` for Server Components, not from `next-mdx-remote`.

### Auth.js v5
- Adapter: `@auth/prisma-adapter`, not `next-auth/adapters/prisma`.
- `createUser` event fires once on first user creation, not on every login.
- Session callback must explicitly copy custom fields (`id`, `hasAccess`) — they are not included by default.
- Extend session types in `next-auth.d.ts` via module augmentation — never via casting.

---

## Established Patterns

### Lazy Singleton (Stripe, Resend)
SDKs must not initialize at module load time — SSG builds throw when env vars are absent.
`lib/stripe.ts` and `lib/resend.ts` use a `let _client = null` getter + `Proxy` export pattern.
Do not `new Stripe()` at the top level of any file.

### Route Protection
Auth guard lives in `app/(dashboard)/layout.tsx`:
```ts
const session = await auth();
if (!session) redirect("/login");
```
Not in `proxy.ts` — the proxy only handles rate limiting.

### Config-Driven Components
All marketing copy (appName, features, pricing, FAQ, social links) comes from `config.ts`.
Components receive it as props or import directly. No hard-coded strings in `.tsx` files.

### Checkout Price Validation
`/api/checkout` whitelists `priceId` against `config.pricing`. Clients cannot submit arbitrary Stripe price IDs.

### Slug Safety
`lib/blog.ts:getPost()` validates slugs with `/^[\w-]+$/` before `path.join`. Any other character returns `null`.

### HMAC Comparison
Always `timingSafeEqual` from `node:crypto` — never `===` for digest comparison.
Stripe's `constructEvent` handles this internally. Lemon Squeezy does it manually.

### JSON-LD
React 18 supports script children natively: `<script type="application/ld+json">{JSON.stringify(data)}</script>`.
Use `components/shared/JsonLd.tsx` — no raw HTML injection needed or allowed.

---

## TypeScript Rules (project-specific enforcement)

- No `any` — use `unknown` + type guards
- No non-null assertions (`!`) — narrow with `if` guards instead
- No `@ts-ignore` / `@ts-expect-error`
- All exported functions must declare return types
- `readonly` in interfaces unless mutation is required

Compiler is truth. Run `npm run build` to verify — not just the LSP.

---

## Known Limitations

- **Rate limiter** (`lib/rate-limit.ts`): in-process Map, ineffective on Vercel (each invocation has isolated memory). Replace with Upstash Redis for serverless production.
- **Blog error boundary**: `getAllPosts()` aborts the entire listing if one `.mdx` file has malformed frontmatter. Wrap per-file reads in try/catch if this becomes an issue.
