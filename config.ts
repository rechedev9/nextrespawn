export const config = {
  // App identity
  appName: "MySaaS",
  appDescription: "Describe your product in one line.",
  domain: "https://yourdomain.com",

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
      description: "For individuals getting started.",
      price: 0,
      currency: "USD",
      interval: "one_time" as const,
      stripePriceId: process.env.STRIPE_PRICE_STARTER ?? "",
      features: [
        "Up to 1,000 users",
        "Core features",
        "Email support",
        "Basic analytics",
        "API access",
        "Community support",
      ],
      highlighted: false,
    },
    {
      id: "pro",
      name: "Pro",
      description: "For teams and growing businesses.",
      price: 0,
      currency: "USD",
      interval: "one_time" as const,
      stripePriceId: process.env.STRIPE_PRICE_PRO ?? "",
      features: [
        "Unlimited users",
        "Everything in Starter",
        "Priority support",
        "Advanced analytics",
        "Custom integrations",
      ],
      highlighted: true,
    },
  ],

  // FAQ entries — used by FAQ accordion
  faq: [
    {
      question: "How does the free trial work?",
      answer:
        "You can use the product free for 14 days with no credit card required. At the end of your trial, choose a plan that fits your needs.",
    },
    {
      question: "Can I cancel anytime?",
      answer:
        "Yes. You can cancel your subscription at any time from your account settings. You will retain access until the end of your billing period.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit and debit cards. Additional payment methods may be available depending on your region.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "We offer a 30-day money-back guarantee. If you are not satisfied, contact support and we will issue a full refund.",
    },
  ],

  // Social links
  social: {
    twitter: "https://twitter.com/yourhandle",
    github: "https://github.com/yourusername",
  },

  // Legal
  legal: {
    privacyUrl: "",
    termsUrl: "",
  },

  // Features — used by Features component on the landing page
  features: [
    {
      icon: "🔑",
      title: "Authentication",
      description: "Secure login and user management built in.",
    },
    {
      icon: "💳",
      title: "Payments",
      description: "Accept payments and manage subscriptions with ease.",
    },
    {
      icon: "📧",
      title: "Email",
      description: "Send transactional and marketing emails to your users.",
    },
    {
      icon: "🗄️",
      title: "Database",
      description: "Persistent storage with a schema ready from day one.",
    },
    {
      icon: "📝",
      title: "Blog",
      description: "Built-in blog with automatic SEO metadata.",
    },
    {
      icon: "🔒",
      title: "Security",
      description: "Headers, rate limiting, and input validation on every route.",
    },
  ],
} as const;

export type Config = typeof config;
