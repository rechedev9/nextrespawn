# ShipFast — Personal SaaS Boilerplate

## Problem Statement

Every new web app starts with the same 20–40 hours of boilerplate: auth, payments, email, SEO, database schemas, and component scaffolding. This is wasted time that could go toward building the actual product. A personal, opinionated starter kit eliminates that overhead for every future project.

## Goals

1. **Clone-and-go**: New project from clone to running local dev in under 5 minutes
2. **Single config**: One file (`config.ts`) controls app name, branding, pricing tiers, and feature flags
3. **Production-ready core**: Auth, payments, email, and database work out of the box with real providers
4. **Modern stack**: Locked to latest LTS/stable (April 2026) — no legacy paths, no dual variants
5. **AI-friendly codebase**: Clean structure that AI editors (Cursor, Claude Code) can reason about instantly

## Non-Goals

- **Not a commercial product** — no marketing pages, testimonials, leaderboards, affiliate systems
- **Not multi-tenant** — single-user/single-org focus; teams/RBAC can be added per-project
- **Not a component library** — shadcn/ui components are copied in, not published as a package
- **Not framework-agnostic** — Next.js App Router only, no Pages Router, no Remix/Astro
- **Not dual-database** — Supabase Postgres + Prisma 7 only, no MongoDB path

---

## Tech Stack

| Layer | Tool | Planeado | Instalado |
|---|---|---|---|
| Runtime | Node.js | 24 LTS | **25.8.2** (LTS aún no en v24 al momento) |
| Framework | Next.js | 16.2 | **16.2.2** ✓ |
| Language | TypeScript | 6.0 | **6.0.2** ✓ |
| React | React | 19.2 | **19.2.4** ✓ |
| Styling | Tailwind CSS | 4.2 | **4.2.2** ✓ |
| Components | shadcn/ui | CLI v4.1 | **4.1.2** ✓ — usa `@base-ui/react`, sin `asChild` |
| Auth | Auth.js / next-auth | 5 (beta.26) | **5.0.0-beta.30** ✓ |
| ORM | Prisma | 7.6 | **7.6.0** ✓ — config en `prisma.config.ts`, adapter-pg |
| Database | Supabase | Postgres | pendiente conexión real |
| DB Client | @supabase/supabase-js | 2.101 | **no instalado** — Prisma cubre el acceso |
| Payments | Stripe SDK | 22.0 | **22.0.0** ✓ |
| Payments alt | Lemon Squeezy | 4.0 | **4.0.0** ✓ |
| Email | Resend | 6.10 | **6.10.0** ✓ |
| Email templates | React Email | 5.2 | **5.2.10** ✓ |
| Blog/MDX | next-mdx-remote | 6.0 | **6.0.0** ✓ |

> **Nota shadcn/ui v4**: La API cambió de Radix a `@base-ui/react`. No existe `asChild` en Button ni SheetTrigger. Los `buttonVariants` se extraen a `lib/button-variants.ts` (sin `"use client"`) para poder usarlos en RSC. El patrón de composición es `render={<Component />}` en lugar de `asChild`.

> **Nota Prisma 7**: Los campos `url`/`directUrl` ya no van en `schema.prisma`. La conexión para CLI va en `prisma.config.ts` y el runtime usa `@prisma/adapter-pg` (`new PrismaPg(pool)` en el constructor).

---

## Project Structure

```
shipfast/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          # Google + magic link form (LoginForm component)
│   │   ├── signup/page.tsx         # Stub (auth unificada en login)
│   │   └── verify/page.tsx         # Magic link callback
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Auth guard — redirige a /login si no hay sesión
│   │   └── dashboard/
│   │       ├── page.tsx            # Dashboard home → /dashboard
│   │       └── settings/page.tsx   # Settings → /dashboard/settings
│   ├── (marketing)/
│   │   ├── layout.tsx              # Header + Footer wrapping
│   │   ├── page.tsx                # Home: Hero, Features, Pricing, FAQ, CTA
│   │   └── pricing/page.tsx        # Pricing + FAQ
│   ├── blog/
│   │   ├── [slug]/page.tsx         # MDX rendering + JSON-LD + generateStaticParams
│   │   └── page.tsx                # Blog index listing
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── checkout/route.ts       # POST — crea Stripe checkout session
│   │   ├── portal/route.ts         # POST — crea Stripe customer portal session
│   │   ├── webhooks/
│   │   │   ├── stripe/route.ts     # checkout.completed, subscription.*, invoice.*
│   │   │   └── lemonsqueezy/route.ts
│   │   └── email/
│   │       └── send/route.ts       # Programmatic send, auth-protected
│   ├── layout.tsx                  # Root layout — fonts, ThemeProvider, OG metadata
│   ├── globals.css                 # Tailwind 4 + shadcn CSS variables
│   └── sitemap.ts                  # Sitemap dinámico con posts de blog
├── components/
│   ├── ui/                         # shadcn/ui (Button, Card, Input, Dialog, Sheet…)
│   ├── layout/
│   │   ├── Header.tsx              # Sticky header, mobile nav via Sheet
│   │   └── Footer.tsx              # Links, social, legal
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── Pricing.tsx             # Driven by config.ts, integra CheckoutButton
│   │   ├── FAQ.tsx                 # Accordion driven by config.ts
│   │   └── CTA.tsx
│   └── shared/
│       ├── CheckoutButton.tsx      # Client — POST /api/checkout → redirect Stripe
│       ├── JsonLd.tsx              # Server — <script type="application/ld+json">
│       ├── LoginForm.tsx           # Client — Google + magic link signIn()
│       ├── SignOutButton.tsx        # Client — signOut()
│       ├── ThemeProvider.tsx       # next-themes wrapper
│       └── ThemeToggle.tsx         # Light/dark toggle
├── lib/
│   ├── auth.ts                     # NextAuth config + welcome email event
│   ├── blog.ts                     # Lectura de MDX desde content/blog/
│   ├── button-variants.ts          # buttonVariants sin "use client" (importable en RSC)
│   ├── env.ts                      # Validación Zod de vars de entorno ⚠️ NUNCA IMPORTADO
│   ├── lemonsqueezy.ts             # LS client + createLSCheckoutUrl
│   ├── prisma.ts                   # Singleton con adapter-pg (Prisma 7)
│   ├── rate-limit.ts               # In-process rate limiter (Map)
│   ├── resend.ts                   # Lazy singleton Resend
│   ├── stripe.ts                   # Lazy singleton Stripe + helpers
│   └── utils.ts                    # cn() de shadcn
├── prisma/
│   ├── schema.prisma               # User, Account, Session, VerificationToken
│   └── migrations/                 # Vacío — pendiente conexión Supabase
├── emails/
│   ├── WelcomeEmail.tsx
│   ├── MagicLinkEmail.tsx
│   └── ReceiptEmail.tsx
├── content/
│   └── blog/
│       └── hello-world.mdx
├── public/                         # favicon.ico, og-default.png pendientes
├── config.ts                       # Fuente única de verdad
├── prisma.config.ts                # Prisma 7 — URL de conexión para CLI/migraciones
├── proxy.ts                        # Rate limiting + auth guard (renombrado desde middleware.ts)
├── next.config.ts                  # Security headers (CSP, X-Frame-Options, etc.)
├── .env.local.example
├── package.json
├── tsconfig.json
└── README.md                       # Pendiente
```

---

## User Stories

### As a developer starting a new project:
- I want to clone the repo, set env vars, and have a working app so that I skip repetitive setup
- I want to change `config.ts` and have the app name, branding, and pricing update everywhere so that I don't hunt through files
- I want auth, payments, and email working with real providers so that I can test end-to-end immediately

### As a developer building features:
- I want protected routes that redirect unauthenticated users so that I don't write auth guards from scratch
- I want Stripe webhooks handling subscriptions + one-time payments so that I just configure pricing tiers
- I want email templates in React so that I can compose and preview emails like components
- I want an MDX blog with automatic SEO so that I can publish content without extra setup

### As a developer deploying:
- I want Vercel-optimized defaults so that deployment is `git push`
- I want `.env.local.example` documenting every required variable so that I don't miss provider setup
- I want security headers and rate limiting so that the app isn't exposed out of the gate

---

## Requirements

### P0 — Must-Have

#### M1: Project Foundation
- [x] Next.js 16.2 App Router with TypeScript 6.0
- [x] Tailwind CSS 4.2 CSS-first configuration (no `tailwind.config.js`)
- [x] shadcn/ui initialized with base primitives (Button, Card, Input, Dialog, Sheet, Dropdown, Avatar, Badge, Separator, Skeleton)
- [x] `config.ts` central config: appName, appDescription, domain, colors, pricing plans, social links
- [x] `.env.local.example` with all required environment variables documented
- [x] Root layout with metadata, fonts, theme provider
- [x] `proxy.ts` skeleton for auth + rate limiting (Next.js 16 rename de `middleware.ts`)

**Acceptance criteria:**
- [x] `git clone` + `cp .env.local.example .env.local` + `npm install` + `npm run dev` boots without errors
- [x] Changing `appName` in `config.ts` updates the site title, header, and footer

#### M2: Authentication
- [x] Auth.js v5 (next-auth) configuration in `lib/auth.ts`
- [x] Google OAuth provider
- [x] Magic Link provider via Resend
- [x] Prisma adapter for session/account/user persistence
- [x] Login page with Google button + email input for magic link
- [x] Protected route group `(dashboard)` with auth guard in layout
- [x] Sign-out functionality (`SignOutButton` component)
- [x] Rate limiting on magic link endpoint (max 5 per email per hour, en `proxy.ts`)

**Acceptance criteria:**
- [x] Given no session, when visiting `/dashboard`, then redirect to `/login` — implementado en `(dashboard)/layout.tsx`
- [ ] Given a valid Google account, when clicking "Sign in with Google", then create user + session — pendiente prueba end-to-end con credenciales reales
- [ ] Given a valid email, when requesting a magic link, then receive email — pendiente base de datos real
- [x] Given 6 magic link requests in 1 hour, when requesting another, then return 429 — lógica implementada (⚠️ in-process, no funciona en serverless multi-instancia)

#### M3: Database
- [x] Prisma 7.6 schema with User, Account, Session, VerificationToken models (Auth.js compat)
- [x] User model extended: `hasAccess: Boolean`, `stripeCustomerId: String?`, `priceId: String?`, `subscriptionStatus: String?`
- [x] Prisma client singleton in `lib/prisma.ts` (adapter-pg, lazy pool)
- [ ] Supabase project connection via `DATABASE_URL` — pendiente credenciales reales
- [ ] Initial migration generated and committed — pendiente conexión

**Acceptance criteria:**
- [ ] `npx prisma migrate dev` runs cleanly against a fresh Supabase database — pendiente
- [ ] Auth.js creates user records on first login — pendiente base de datos real
- [x] User fields `hasAccess`, `stripeCustomerId`, `priceId` are queryable — en schema

#### M4: Payments — Stripe
- [x] Stripe client in `lib/stripe.ts` (lazy singleton con Proxy)
- [x] Checkout session creation (subscription + one-time modes, driven by `config.ts` pricing plans)
- [x] Webhook handler at `/api/webhooks/stripe/route.ts`
- [x] Handle events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
- [x] Update User `hasAccess`, `stripeCustomerId`, `priceId`, `subscriptionStatus` on webhook events
- [x] Checkout button component (`CheckoutButton`) that creates session and redirects
- [x] Customer portal link (`/api/portal`) for managing subscriptions
- [x] Webhook signature verification (`stripe.webhooks.constructEvent`)

**Acceptance criteria:**
- [ ] Given a logged-in user, when clicking a pricing plan, then redirect to Stripe Checkout — pendiente credenciales reales
- [ ] Given a completed checkout, when Stripe sends webhook, then User record has `hasAccess: true` — pendiente credenciales
- [ ] Given a cancelled subscription, when webhook fires, then `hasAccess` flips to `false` — pendiente
- [x] Given an invalid webhook signature, then return 400 — implementado

#### M5: Email
- [x] Resend client in `lib/resend.ts` (lazy singleton)
- [x] React Email templates: `WelcomeEmail.tsx`, `MagicLinkEmail.tsx`, `ReceiptEmail.tsx`
- [x] Send welcome email on first user creation (`events.createUser` en `lib/auth.ts`)
- [x] Magic link emails styled with React Email (usando el provider Resend de Auth.js)
- [x] API route `/api/email/send` for programmatic sends (auth-protected, Zod validation)

**Acceptance criteria:**
- [ ] Given a new user signs up, then receive a welcome email within 60s — pendiente credenciales
- [ ] Given a magic link request, then email arrives with a working auth link — pendiente
- [ ] Email templates render correctly — previews pendientes (`npm run email:preview`)

#### M6: SEO & Blog
- [x] Root metadata in `layout.tsx` with OG tags, Twitter card, structured data
- [x] `sitemap.ts` generating dynamic sitemap including blog posts
- [x] MDX blog with `next-mdx-remote` 6.0 (RSC mode)
- [x] Blog index page at `/blog`
- [x] Blog post page at `/blog/[slug]` (con `generateStaticParams`)
- [x] Frontmatter: title, description, date, image, author
- [x] OG image: fallback a `og-default.png` (placeholder — generación dinámica es P2)
- [x] JSON-LD structured data para blog posts (Article schema) via `JsonLd` component

**Acceptance criteria:**
- [x] Given a `.mdx` file in `content/blog/`, then it appears on `/blog` and is accessible at `/blog/[slug]` — verificado en build
- [x] Given any page, then `<head>` contains og:title, og:description, og:image, twitter:card — en `layout.tsx` y `generateMetadata`
- [x] `sitemap.xml` includes all pages and blog posts — ruta `/sitemap.xml` generada
- [ ] Google Rich Results Test validates the JSON-LD — requiere deploy

#### M7: Security
- [x] Rate limiting en `proxy.ts` (magic link: 5/hora por email)
- [x] Security headers en `next.config.ts`: CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS
- [x] Zod schema validation en todos los API route inputs
- [x] CSRF protection via Auth.js (built-in)
- [~] Environment variable validation at startup — `lib/env.ts` escrito con Zod, **⚠️ NUNCA SE IMPORTA** (bug crítico pendiente de fix)

**Acceptance criteria:**
- [~] Given a missing required env var, when starting the app, then exit — lógica escrita pero NO activa hasta que `lib/env.ts` sea importado (pendiente fix en `instrumentation.ts`)
- [x] Given a request to a rate-limited endpoint exceeding the limit, then return 429 (⚠️ solo en single-instance)
- [x] Given a malformed body to any API route, then return 400 with validation errors

### P1 — Nice-to-Have

#### M8: Payments — Lemon Squeezy
- [x] Lemon Squeezy client in `lib/lemonsqueezy.ts` (`createLSCheckoutUrl`)
- [ ] Checkout overlay creation — pendiente
- [x] Webhook handler at `/api/webhooks/lemonsqueezy/route.ts` (HMAC con `timingSafeEqual`)
- [x] Handle events: `order_created`, `subscription_created`, `subscription_updated`, `subscription_cancelled`
- [x] Update User record on events
- [ ] Config flag to switch payment provider per project — pendiente

#### M9: Landing Page Components
- [x] `Header.tsx` — sticky, responsive, mobile nav via Sheet, auth-aware
- [x] `Hero.tsx` — headline, subheadline, dual CTA
- [x] `Features.tsx` — grid con iconos, configurable
- [x] `Pricing.tsx` — cards driven by `config.ts`, integra `CheckoutButton`
- [x] `FAQ.tsx` — accordion driven by `config.ts`
- [x] `CTA.tsx` — bottom-of-page call to action
- [x] `Footer.tsx` — links, social, legal
- [x] Dark mode toggle con `next-themes` (`ThemeToggle` component)

#### M10: Developer Experience
- [ ] README.md with setup instructions, env var reference, deployment guide
- [ ] `scripts/setup.sh` — interactive setup
- [x] ESLint config (generado por create-next-app, `eslint-config-next`)
- [ ] Prettier config — pendiente
- [ ] Pre-configured VS Code settings — pendiente

### P2 — Future Considerations

- **Admin panel** — user management, subscription overview, metrics
- **Multi-tenancy** — organizations, team invites, role-based access
- **Analytics** — Plausible or PostHog integration
- **File uploads** — S3/Supabase Storage
- **Notification system** — in-app notifications
- **i18n** — internationalization setup
- **E2E tests** — Playwright test suite for critical flows
- **CI/CD** — GitHub Actions pipeline

---

## Open Questions

| # | Question | Estado |
|---|---|---|
| 1 | Auth.js v5 beta — blockers con Prisma 7 adapter? | **Resuelto** — beta.30 + `@auth/prisma-adapter@2.11.1` funcionan. El adapter usa el `PrismaClient` con adapter-pg sin problemas. |
| 2 | Tailwind 4 CSS-first + shadcn/ui CLI v4 — incompatibilidades? | **Resuelto con matices** — shadcn v4 cambió de Radix a `@base-ui/react`. `asChild` eliminado; composición vía prop `render`. `buttonVariants` extraído a archivo sin `"use client"` para uso en RSC. |
| 3 | Supabase free tier — suficiente para dev? | **Sin cambios** — no bloqueante. |
| 4 | Stripe SDK 22.0 `Decimal` — afecta parsing de webhooks? | **Resuelto** — los payloads de webhook siguen siendo JSON estándar. La API version `2025-03-31.basil` requerida explícitamente en el constructor. |

---

## Task Roadmap

### Phase 1: Foundation (M1 + M3)

```
[x] 1.1  Scaffold Next.js 16.2 project with TypeScript 6.0
[x] 1.2  Configure Tailwind CSS 4.2 (CSS-first in globals.css)
[x] 1.3  Initialize shadcn/ui CLI v4, install base primitives
[x] 1.4  Create config.ts with appName, description, domain, colors, pricing, FAQ, social links
[x] 1.5  Create .env.local.example with all provider placeholders
[x] 1.6  Set up root layout (metadata from config, fonts, ThemeProvider)
[x] 1.7  Set up route groups: (auth), (dashboard), (marketing), blog, api
[x] 1.8  Set up Prisma 7.6 schema (User, Account, Session, VerificationToken + extended fields)
[x] 1.9  Configure Prisma client singleton (lib/prisma.ts) — Prisma 7 adapter-pg pattern
[ ] 1.10 Connect to Supabase, run initial migration  ← needs real DATABASE_URL + DIRECT_URL
[x] 1.11 Add env validation (Zod) that fails fast on missing vars
```

### Phase 2: Auth (M2)

```
[x] 2.1  Install and configure Auth.js v5 with Prisma adapter
[x] 2.2  Add Google OAuth provider
[x] 2.3  Add Magic Link provider (Resend as email transport)
[x] 2.4  Create login page: Google button + magic link email input
[x] 2.5  Create signup page (or merge with login if single-page flow)  ← merged into login
[x] 2.6  Create verify page (magic link callback)
[x] 2.7  Add auth guard to (dashboard) layout — redirect to /login if no session
[x] 2.8  Add sign-out button/flow  ← SignOutButton component
[x] 2.9  Add rate limiting on magic link endpoint
[x] 2.10 Create proxy.ts with auth check + rate limiter  ← renamed from middleware.ts (Next.js 16)
```

### Phase 3: Payments — Stripe (M4)

```
[x] 3.1  Install Stripe SDK 22.0, create lib/stripe.ts client
[x] 3.2  Create checkout session API (reads pricing from config.ts)
[x] 3.3  Create /api/webhooks/stripe/route.ts with signature verification
[x] 3.4  Handle checkout.session.completed — update User hasAccess + stripeCustomerId + priceId
[x] 3.5  Handle customer.subscription.updated — sync subscriptionStatus
[x] 3.6  Handle customer.subscription.deleted — revoke hasAccess
[x] 3.7  Handle invoice.payment_failed — flag user
[x] 3.8  Create CheckoutButton component (creates session, redirects)
[x] 3.9  Create customer portal redirect helper
[ ] 3.10 Test with Stripe CLI (stripe listen --forward-to)  ← requires provider credentials
```

### Phase 4: Email (M5)

```
[x] 4.1  Install Resend 6.10 + React Email 5.2, create lib/resend.ts
[x] 4.2  Create WelcomeEmail.tsx template
[x] 4.3  Create MagicLinkEmail.tsx template (used by Auth.js magic link)
[x] 4.4  Create ReceiptEmail.tsx template
[x] 4.5  Hook welcome email to Auth.js createUser event
[x] 4.6  Create /api/email/send route (auth-protected, for programmatic use)
[ ] 4.7  Preview and test templates with React Email dev server  ← run: npm run email:preview
```

### Phase 5: SEO & Blog (M6)

```
[x] 5.1  Configure root metadata in layout.tsx (OG, Twitter, structured data from config.ts)
[x] 5.2  Create sitemap.ts with dynamic generation
[x] 5.3  Set up next-mdx-remote 6.0 with RSC
[x] 5.4  Create /blog page (index listing posts from content/blog/)
[x] 5.5  Create /blog/[slug] page with MDX rendering + frontmatter
[x] 5.6  Add JSON-LD Article structured data to blog posts
[x] 5.7  Add OG image generation (or static fallback per post)  ← og-default.png fallback
[x] 5.8  Create sample hello-world.mdx post
```

### Phase 6: Security Hardening (M7)

```
[x] 6.1  Add security headers to next.config.ts (CSP, X-Frame-Options, etc.)
[x] 6.2  Add Zod validation to all API route inputs
[x] 6.3  Configure CSP policy
[x] 6.4  Rate limiting on magic link + webhook endpoints in proxy.ts
[~] 6.5  Env vars validated at startup — lib/env.ts ESCRITO pero nunca importado  ← BUG CRÍTICO
          Fix: crear instrumentation.ts en raíz e importar @/lib/env allí
```

### Phase 7: Landing Page & DX (M9 + M10)

```
[x] 7.1  Build Header.tsx (responsive, auth-aware, mobile nav)
[x] 7.2  Build Hero.tsx (headline, subheadline, CTA)
[x] 7.3  Build Features.tsx (grid from config.ts)
[x] 7.4  Build Pricing.tsx (cards from config.ts, integrated with CheckoutButton)
[x] 7.5  Build FAQ.tsx (accordion from config.ts)
[x] 7.6  Build CTA.tsx (bottom call to action)
[x] 7.7  Build Footer.tsx (links, social, legal)
[x] 7.8  Add dark mode with next-themes
[ ] 7.9  Write README.md (setup, env reference, deployment)
[ ] 7.10 Add ESLint + Prettier config
```

### Phase 8: Lemon Squeezy (M8) — Optional

```
[x] 8.1  Install @lemonsqueezy/lemonsqueezy.js 4.0, create lib/lemonsqueezy.ts
[ ] 8.2  Create checkout overlay flow
[x] 8.3  Create /api/webhooks/lemonsqueezy/route.ts
[x] 8.4  Handle order_created, subscription_created/updated/cancelled
[ ] 8.5  Add config flag to switch payment provider per project
```

---

## Known Issues / Technical Debt

Detectados en code review post-implementación. Ordenados por prioridad.

### 🔴 Críticos (bloquean producción)

**1. `lib/env.ts` nunca se importa — validación de env vars inactiva**
- `lib/env.ts` define un `validateEnv()` con Zod que llama `process.exit(1)` si faltan vars. Pero ningún archivo lo importa, así que nunca corre.
- **Fix**: Crear `instrumentation.ts` en raíz del proyecto con `export async function register() { await import("@/lib/env"); }`. Next.js lo ejecuta al iniciar el servidor antes de cualquier request.
- Afecta: M7 acceptance criteria "exit with a clear error naming the variable"

**2. `lib/blog.ts:getPost()` — path traversal via slug**
- `path.join(BLOG_DIR, `${slug}.mdx`)` con `slug = "../../etc/passwd"` resuelve a `/etc/passwd.mdx`, fuera del directorio de blog.
- Confirmado: `path.join('/content/blog', '../../etc/passwd.mdx')` → `/etc/passwd.mdx`
- **Fix**: Validar que el path resuelto empiece con `BLOG_DIR + path.sep` antes de leer. Ejemplo:
  ```ts
  const resolved = path.resolve(BLOG_DIR, `${slug}.mdx`);
  if (!resolved.startsWith(BLOG_DIR + path.sep)) return null;
  ```

### 🟡 Advertencias (deben corregirse antes de producción)

**3. `components/shared/ThemeToggle.tsx:13` — ESLint error**
- `useEffect(() => setMounted(true), [])` dispara la regla `react-hooks/set-state-in-effect`.
- El patrón es intencional (hydration guard), pero el error de lint debe resolverse.
- **Fix**: Cambiar expresión a bloque: `useEffect(() => { setMounted(true); }, [])`.

**4. `lib/env.ts:68-69` — Non-null assertions (`!`)**
- `serverResult.data!` y `clientResult.data!` usan `!`, prohibido por las TypeScript rules del proyecto.
- Son lógicamente correctas (el guard de `errors.length` precede), pero violan la regla.
- **Fix**: Narrow via `if (serverResult.success && clientResult.success)`.

**5. `lib/rate-limit.ts` — Map crece indefinidamente**
- Las entradas expiradas nunca se borran. En un servidor long-running con muchos emails únicos, esto es un memory leak.
- **Fix**: Purgar entradas expiradas al inicio de cada llamada a `rateLimit()`, o usar un LRU con cap máximo.

**6. Rate limiter inefectivo en serverless**
- El state del limiter vive en memoria de proceso. En Vercel (serverless), cada invocación tiene su propia memoria.
- Documentado en el código, pero significa que el rate limit **no funciona en producción Vercel** sin cambiar a Redis/Upstash.

**7. `lib/stripe.ts` + `lib/resend.ts` — Proxy pattern**
- El `new Proxy({} as Stripe, ...)` hace que cualquier acceso a propiedad (incluidos Symbols internos de JS) llame a `getStripe()`. Los stack traces apuntan al proxy en lugar del call site real.
- Funcionalmente correcto, pero opaco para debugging.

### 🔵 Sugerencias (nice-to-have)

**8. `lib/auth.ts` — extensión de tipo `Session` via cast inseguro**
- `(session.user as typeof session.user & { hasAccess: boolean }).hasAccess` bypasea el type system.
- Mejor: declarar `next-auth.d.ts` con module augmentation de `Session`.

**9. `lib/blog.ts:getAllPosts()` — sin error boundary por archivo**
- Si un `.mdx` tiene frontmatter malformado, `matter()` puede lanzar y aborta el listing completo.
- Mejor: envolver cada lectura en `try/catch` y loguear el archivo problemático.

---

## Success Criteria

- [x] Fresh clone to running dev server in under 5 minutes  ← `npm install && npm run dev`
- [ ] Google OAuth login works end-to-end  ← needs AUTH_GOOGLE_* credentials
- [ ] Magic link login works end-to-end  ← needs RESEND_API_KEY + database
- [ ] Stripe checkout creates subscription and updates user access  ← needs Stripe keys + database
- [ ] Webhook handles cancel/fail and revokes access  ← needs Stripe keys
- [ ] Emails send and arrive (welcome + magic link + receipt)  ← needs Resend keys
- [x] Blog post renders from MDX with correct SEO tags  ← hello-world.mdx works (verified in build)
- [ ] Lighthouse SEO score: 100  ← run against deployed app
- [x] No env vars leak to client  ← only NEXT_PUBLIC_* is client-accessible
- [x] All API routes validate input with Zod
