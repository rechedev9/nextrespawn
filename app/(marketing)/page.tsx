import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";

export default function HomePage(): React.ReactElement {
  return (
    <main>
      <Hero />
      <Features />
      <Pricing />
      <FAQ />
      <CTA />
    </main>
  );
}
