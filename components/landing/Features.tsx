import type React from "react";
import { config } from "@/config";

interface Feature {
  readonly icon: React.ReactNode;
  readonly title: string;
  readonly description: string;
}

interface Props {
  readonly features?: readonly Feature[];
}

export function Features({ features = config.features }: Props): React.ReactElement {
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
