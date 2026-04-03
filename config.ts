export const config = {
  // App identity
  appName: "ShipFast",
  appDescription: "Your personal SaaS boilerplate. Clone, configure, ship.",
  domain: "https://shipfast.dev",

  // Branding colors (CSS custom property values — override in globals.css)
  colors: {
    primary: "#6366f1",   // indigo-500
    secondary: "#a855f7", // purple-500
    accent: "#ec4899",    // pink-500
  },

  // Pricing plans — used by Pricing component and checkout session creation
  pricing: [
    {
      id: "starter",
      name: "Starter",
      description: "Everything you need to launch.",
      price: 49,
      currency: "USD",
      interval: "one_time" as const,
      stripePriceId: process.env.STRIPE_PRICE_STARTER ?? "",
      features: [
        "All source code",
        "Auth (Google + Magic Link)",
        "Stripe payments",
        "Email with React Email",
        "MDX blog",
        "SEO ready",
      ],
      highlighted: false,
    },
    {
      id: "pro",
      name: "Pro",
      description: "Unlimited projects, lifetime updates.",
      price: 99,
      currency: "USD",
      interval: "one_time" as const,
      stripePriceId: process.env.STRIPE_PRICE_PRO ?? "",
      features: [
        "Everything in Starter",
        "Lemon Squeezy support",
        "Landing page components",
        "Priority support",
        "Lifetime updates",
      ],
      highlighted: true,
    },
  ],

  // FAQ entries — used by FAQ accordion
  faq: [
    {
      question: "Is this a template or a library?",
      answer:
        "It's a template. You clone it, configure it, and own the code entirely. There's nothing to install or keep in sync.",
    },
    {
      question: "Which payment providers are supported?",
      answer:
        "Stripe is the primary provider. Lemon Squeezy is supported as an optional alternative via a config flag.",
    },
    {
      question: "Do I need a Supabase account?",
      answer:
        "Yes. Supabase provides the Postgres database. The free tier is sufficient for development and small production apps.",
    },
    {
      question: "Can I add my own features?",
      answer:
        "Absolutely — it's your code. The boilerplate gives you a working base; everything after that is yours to build.",
    },
  ],

  // Social links
  social: {
    twitter: "https://twitter.com/shipfast",
    github: "https://github.com/shipfast",
  },

  // Legal
  legal: {
    privacyUrl: "",
    termsUrl: "",
  },
} as const;

export type Config = typeof config;
