import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { config } from "@/config";

interface Props {
  readonly headline?: string;
  readonly subheadline?: string;
}

export function CTA({
  headline = "Ready to ship?",
  subheadline = `${config.appName} gives you the foundation so you can focus on what matters.`,
}: Props): React.ReactElement {
  return (
    <section className="container mx-auto px-4 py-20 text-center">
      <div className="rounded-2xl bg-primary/5 border border-primary/20 p-12 max-w-2xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold">{headline}</h2>
        <p className="text-muted-foreground">{subheadline}</p>
        <Link href="/pricing" className={buttonVariants({ size: "lg" })}>
          Get started today
        </Link>
      </div>
    </section>
  );
}
