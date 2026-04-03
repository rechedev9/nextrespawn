import { config } from "@/config";
import { CheckoutButton } from "@/components/shared/CheckoutButton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function Pricing(): React.ReactElement {
  return (
    <section id="pricing" className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">Simple pricing</h2>
      <div className="grid gap-6 md:grid-cols-2 max-w-3xl mx-auto">
        {config.pricing.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-xl border p-6 flex flex-col gap-4 ${
              plan.highlighted ? "border-primary shadow-md" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              {plan.highlighted && <Badge>Most popular</Badge>}
            </div>
            <p className="text-muted-foreground text-sm">{plan.description}</p>
            <p className="text-3xl font-bold">
              ${plan.price}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                {plan.interval === "one_time" ? "one-time" : `/${plan.interval}`}
              </span>
            </p>
            <Separator />
            <ul className="space-y-2 text-sm flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="text-primary font-bold">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            {plan.stripePriceId ? (
              <CheckoutButton priceId={plan.stripePriceId} label={`Get ${plan.name}`} />
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
