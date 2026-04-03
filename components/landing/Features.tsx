import type React from "react";

interface Feature {
  readonly icon: React.ReactNode;
  readonly title: string;
  readonly description: string;
}

interface Props {
  readonly features?: readonly Feature[];
}

const defaultFeatures: readonly Feature[] = [
  {
    icon: "🔑",
    title: "Authentication",
    description: "Google OAuth and Magic Link out of the box with Auth.js v5.",
  },
  {
    icon: "💳",
    title: "Payments",
    description: "Stripe checkout, webhooks, and subscription management wired up.",
  },
  {
    icon: "📧",
    title: "Email",
    description: "React Email templates sent via Resend. Preview in your browser.",
  },
  {
    icon: "🗄️",
    title: "Database",
    description: "Prisma 7 + Supabase Postgres. Schema ready, migrations on day one.",
  },
  {
    icon: "📝",
    title: "Blog",
    description: "MDX-powered blog with automatic SEO tags and JSON-LD.",
  },
  {
    icon: "🔒",
    title: "Security",
    description: "CSP headers, rate limiting, and Zod validation on every route.",
  },
];

export function Features({ features = defaultFeatures }: Props): React.ReactElement {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">Everything you need</h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="flex flex-col gap-3">
            <span className="text-3xl">{feature.icon}</span>
            <h3 className="font-semibold text-lg">{feature.title}</h3>
            <p className="text-muted-foreground text-sm">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
