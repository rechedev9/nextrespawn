# ShipFast

Personal Next.js SaaS boilerplate. Clone → configure → running local dev in under 5 minutes.

Not a commercial product. No marketing, no leaderboards, no affiliate systems — just a clean technical foundation for every future project.

---

## Stack

| Layer | Package | Version |
|---|---|---|
| Framework | Next.js | 16.2.2 |
| Language | TypeScript | 6.0.2 |
| React | React | 19.2.4 |
| Styling | Tailwind CSS | 4.2 |
| Components | shadcn/ui (`@base-ui/react`) | 4.1.2 |
| Auth | Auth.js / next-auth | 5.0.0-beta.30 |
| ORM | Prisma | 7.6.0 |
| Database | Supabase (Postgres) | — |
| Payments | Stripe | 22.0.0 |
| Payments (alt) | Lemon Squeezy | 4.0.0 |
| Email | Resend + React Email | 6.10.0 / 5.2.10 |
| Blog | next-mdx-remote | 6.0.0 |

---

## Setup

### 1. Clone and install

```bash
git clone <repo-url> my-app
cd my-app
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Fill in all values — see [Environment Variables](#environment-variables) below.

### 3. Set up the database

Create a Supabase project at [supabase.com](https://supabase.com) and add your connection strings to `.env.local`, then run the initial migration:

```bash
npx prisma migrate dev --name init
```

### 4. Configure your app

Edit `config.ts` — this is the single source of truth for app name, pricing tiers, FAQ, social links, and branding colors.

### 5. Run

```bash
npm run dev
```

---

## Commands

```bash
npm run dev           # Dev server at localhost:3000
npm run build         # Typecheck (tsc) + production build — run before committing
npm run lint          # ESLint
npm run email:preview # React Email dev server at localhost:3000

./committer           # ONLY way to commit — never bare git commit
```

---

## Agent Skills

Nine Claude Code skills are bundled in the repo under `.agents/skills/` and symlinked from `.claude/skills/` and `skills/`. They load automatically when Claude Code is running in this project.

| Skill | Source | Purpose |
|---|---|---|
| `vercel-react-best-practices` | vercel-labs/agent-skills | React 19 perf, SSR/RSC, re-render patterns |
| `web-design-guidelines` | vercel-labs/agent-skills | UI/UX quality for landing pages |
| `vercel-composition-patterns` | vercel-labs/agent-skills | Server/Client component composition |
| `nextjs` | vercel-labs/vercel-plugin | Next.js App Router reference |
| `prisma-database-setup` | prisma/skills | Schema, migrations, adapter patterns |
| `tailwind-css-patterns` | giuseppe-trisciuoglio/developer-kit | Tailwind component and layout patterns |
| `tailwindcss-advanced-layouts` | josiahsiegel/claude-plugin-marketplace | Advanced Tailwind layout techniques |
| `typescript-best-practices` | 0xbigboss/claude-code | Strict TypeScript patterns |
| `stripe-integration` | sickn33/antigravity-awesome-skills | Stripe checkout and webhook patterns |

To add or update skills:

```bash
npx skills add <owner/repo@skill-name> -y   # add
npx skills check                             # check for updates
npx skills update                            # update all
```

`skills-lock.json` pins hashes — commit it alongside any skill changes.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | Yes | Public URL of the app (`http://localhost:3000` for dev) |
| `DATABASE_URL` | Yes | Supabase pooled connection string (PgBouncer, port 6543) |
| `DIRECT_URL` | Yes | Supabase direct connection string (port 5432) — used by Prisma migrations |
| `AUTH_SECRET` | Yes | JWT/session signing secret — generate with `openssl rand -base64 32` |
| `AUTH_GOOGLE_ID` | Yes | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Yes | Google OAuth client secret |
| `RESEND_API_KEY` | Yes | Resend API key (`re_...`) |
| `RESEND_FROM` | Yes | Verified sender address for outgoing emails |
| `STRIPE_SECRET_KEY` | Yes | Stripe secret key (`sk_test_...` or `sk_live_...`) |
| `STRIPE_WEBHOOK_SECRET` | Yes | Stripe webhook signing secret (`whsec_...`) |
| `STRIPE_PRICE_STARTER` | Yes | Stripe price ID for the Starter plan |
| `STRIPE_PRICE_PRO` | Yes | Stripe price ID for the Pro plan |
| `LEMONSQUEEZY_API_KEY` | No | Only needed if using Lemon Squeezy as payment provider |
| `LEMONSQUEEZY_WEBHOOK_SECRET` | No | Lemon Squeezy webhook secret |
| `LEMONSQUEEZY_STORE_ID` | No | Lemon Squeezy store ID |

To get Google OAuth credentials: [console.cloud.google.com](https://console.cloud.google.com) → Create project → APIs & Services → Credentials → OAuth 2.0 Client ID.

For local Stripe webhook testing:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## Project Structure

```
shipfast/
├── app/
│   ├── (auth)/login/          # Google + magic link login
│   ├── (auth)/verify/         # Magic link callback
│   ├── (dashboard)/           # Auth-guarded — redirects to /login if no session
│   │   └── dashboard/         # /dashboard and /dashboard/settings
│   ├── (marketing)/           # Public pages — home, pricing
│   ├── blog/                  # MDX blog at /blog and /blog/[slug]
│   └── api/
│       ├── auth/[...nextauth]/ # Auth.js handler
│       ├── checkout/           # POST — Stripe checkout session
│       ├── portal/             # POST — Stripe customer portal
│       ├── webhooks/stripe/    # Stripe webhook handler
│       ├── webhooks/lemonsqueezy/
│       └── email/send/         # Programmatic email (auth-protected)
├── components/
│   ├── ui/                    # shadcn/ui primitives
│   ├── layout/                # Header, Footer
│   ├── landing/               # Hero, Features, Pricing, FAQ, CTA
│   └── shared/                # CheckoutButton, LoginForm, ThemeToggle, etc.
├── lib/
│   ├── auth.ts                # NextAuth config (Google + Resend + PrismaAdapter)
│   ├── prisma.ts              # DB singleton (adapter-pg)
│   ├── stripe.ts              # Stripe lazy singleton + helpers
│   ├── resend.ts              # Resend lazy singleton
│   ├── env.ts                 # Zod env validation (runs via instrumentation.ts)
│   ├── blog.ts                # MDX post reader
│   ├── button-variants.ts     # buttonVariants — no "use client", safe in RSC
│   └── utils.ts               # cn()
├── prisma/
│   ├── schema.prisma          # User, Account, Session, VerificationToken
│   └── migrations/
├── emails/                    # WelcomeEmail, MagicLinkEmail, ReceiptEmail
├── content/blog/              # .mdx posts (frontmatter: title, description, date, author)
├── config.ts                  # Single source of truth — edit this first
├── prisma.config.ts           # Prisma 7 connection config (CLI + migrations)
├── proxy.ts                   # Next.js 16 middleware — rate limiting
└── next.config.ts             # Security headers
```

---

## Key Patterns

### One config file

`config.ts` drives everything: app name, branding colors, pricing tiers, FAQ, and social links. No hard-coded strings in components.

### Protected routes

Auth guard is in `app/(dashboard)/layout.tsx`:

```ts
const session = await auth();
if (!session) redirect("/login");
```

`proxy.ts` handles rate limiting only — not auth.

### Lazy singletons

Stripe and Resend initialize on first use, not at module load time. This prevents SSG builds from failing when env vars are absent.

### Checkout price validation

`/api/checkout` validates the submitted `priceId` against the whitelist in `config.pricing`. Clients cannot pass arbitrary Stripe price IDs.

### HMAC verification

All webhooks use `timingSafeEqual` for digest comparison — never `===`. Stripe's `constructEvent` handles this internally; Lemon Squeezy does it manually.

---

## Adding Blog Posts

Create a `.mdx` file in `content/blog/`:

```mdx
---
title: My Post
description: A short description for SEO.
date: 2026-01-01
author: Your Name
---

Post content here.
```

The post appears automatically at `/blog/[slug]` with OG tags, JSON-LD structured data, and a sitemap entry.

---

## Deployment

The project is optimized for Vercel. Push to GitHub and connect the repo in the Vercel dashboard.

Set all environment variables from `.env.local.example` in the Vercel project settings.

> **Rate limiting caveat:** `lib/rate-limit.ts` uses an in-process Map that is not shared across serverless function instances. It works correctly in single-process environments (dev, single-server). For production Vercel deployments, replace it with [Upstash Redis](https://upstash.com).

---

## Breaking Changes vs. Common Training Data

This project uses versions that differ from what most tools assume:

- **`proxy.ts` not `middleware.ts`** — Next.js 16 renamed it. Export is `proxy: NextProxy`.
- **Prisma 7**: Connection URLs live in `prisma.config.ts`, not `schema.prisma`. Runtime requires `@prisma/adapter-pg`.
- **shadcn/ui v4**: Uses `@base-ui/react`, not Radix. `asChild` does not exist. Use the `render` prop for polymorphism. Import `buttonVariants` from `lib/button-variants.ts`, not `components/ui/button`.
- **Stripe 22**: Constructor requires `apiVersion: "2025-03-31.basil"` — omitting it is a TypeScript error.
- **Auth.js v5**: Adapter is `@auth/prisma-adapter`, not `next-auth/adapters/prisma`.
- **Zod 4**: `.url()`, `.email()`, `.startsWith()` deprecated — use `.regex()`. `.flatten()` removed.
- **next-mdx-remote 6**: Import from `next-mdx-remote/rsc` for Server Components.
