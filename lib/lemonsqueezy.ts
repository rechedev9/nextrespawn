import {
  lemonSqueezySetup,
  createCheckout,
  type NewCheckout,
} from "@lemonsqueezy/lemonsqueezy.js";

// Lemon Squeezy is an optional alternative to Stripe.
// Enable by setting PAYMENT_PROVIDER=lemonsqueezy in your environment.
// All required env vars are documented in .env.local.example.

if (process.env.LEMONSQUEEZY_API_KEY) {
  lemonSqueezySetup({ apiKey: process.env.LEMONSQUEEZY_API_KEY });
}

/**
 * Create a Lemon Squeezy checkout URL.
 *
 * @param variantId - The Lemon Squeezy variant ID (from your store dashboard)
 * @param email     - Pre-fill the checkout form with the user's email
 * @param userId    - Passed as custom data for webhook correlation
 */
export async function createLSCheckoutUrl(
  variantId: string,
  email: string,
  userId: string
): Promise<string> {
  if (!process.env.LEMONSQUEEZY_STORE_ID) {
    throw new Error("LEMONSQUEEZY_STORE_ID is not set");
  }

  const checkout: NewCheckout = {
    productOptions: {
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? ""}/dashboard?checkout=success`,
    },
    checkoutOptions: {
      embed: false,
    },
    checkoutData: {
      email,
      custom: { userId },
    },
  };

  const { data, error } = await createCheckout(
    process.env.LEMONSQUEEZY_STORE_ID,
    variantId,
    checkout
  );

  if (error) {
    throw new Error(`Lemon Squeezy checkout error: ${error.message}`);
  }

  const url = data?.data?.attributes?.url;
  if (!url) {
    throw new Error("Lemon Squeezy checkout URL is null");
  }

  return url;
}
