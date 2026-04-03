import Link from "next/link";
import { buttonVariants } from "@/lib/button-variants";
import { config } from "@/config";

interface Props {
  readonly headline?: string;
  readonly subheadline?: string;
  readonly ctaLabel?: string;
  readonly ctaHref?: string;
}

export function Hero({
  headline = `Ship your SaaS faster with ${config.appName}`,
  subheadline = config.appDescription,
  ctaLabel = "Get started",
  ctaHref = "/pricing",
}: Props): React.ReactElement {
  return (
    <section className="flex flex-col items-center justify-center text-center px-4 py-24 gap-6">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight max-w-3xl">
        {headline}
      </h1>
      <p className="text-lg text-muted-foreground max-w-xl">{subheadline}</p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href={ctaHref} className={buttonVariants({ size: "lg" })}>
          {ctaLabel}
        </Link>
        <Link
          href="/login"
          className={buttonVariants({ variant: "outline", size: "lg" })}
        >
          Sign in
        </Link>
      </div>
    </section>
  );
}
