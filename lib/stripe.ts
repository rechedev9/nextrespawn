import Stripe from "stripe";

// Lazy singleton — Stripe client is created on first use, not at module load.
// This avoids failing at static page generation time when STRIPE_SECRET_KEY is not set.
// The env validation in lib/env.ts catches missing vars at runtime startup.

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key, {
      apiVersion: "2025-03-31.basil",
      typescript: true,
    });
  }
  return _stripe;
}

// Re-export for convenience — callers import `stripe` directly
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return (getStripe() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

/**
 * Create a Stripe Checkout session.
 */
export async function createCheckoutSession({
  userId,
  email,
  priceId,
  mode,
  successUrl,
  cancelUrl,
}: {
  userId: string;
  email: string | undefined;
  priceId: string;
  mode: "subscription" | "payment";
  successUrl: string;
  cancelUrl: string;
}): Promise<string> {
  const session = await getStripe().checkout.sessions.create({
    mode,
    client_reference_id: userId,
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { userId },
  });

  if (!session.url) throw new Error("Stripe checkout session URL is null");
  return session.url;
}

/**
 * Create a Stripe Customer Portal session.
 */
export async function createPortalSession(
  stripeCustomerId: string,
  returnUrl: string
): Promise<string> {
  const session = await getStripe().billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: returnUrl,
  });
  return session.url;
}
