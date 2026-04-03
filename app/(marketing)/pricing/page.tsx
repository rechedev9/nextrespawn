import type React from "react";
import type { Metadata } from "next";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, one-time pricing. No subscriptions, no surprises.",
};

export default function PricingPage(): React.ReactElement {
  return (
    <main>
      <Pricing />
      <FAQ />
    </main>
  );
}
