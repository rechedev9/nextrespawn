import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { config } from "@/config";
import { createCheckoutSession } from "@/lib/stripe";
import { rateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  priceId: z.string().min(1),
});

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = rateLimit(`checkout:${session.user.id}`, 10, 60_000);
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const { priceId } = parsed.data;

  // Verify the priceId is one of ours — prevent checkout session spoofing
  const plan = config.pricing.find((p) => p.stripePriceId === priceId && p.stripePriceId !== "");
  if (!plan) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }

  const mode = plan.interval === "one_time" ? "payment" : "subscription";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? config.domain;

  try {
    const url = await createCheckoutSession({
      userId: session.user.id,
      email: session.user.email ?? undefined,
      priceId,
      mode,
      successUrl: `${appUrl}/dashboard?checkout=success`,
      cancelUrl: `${appUrl}/pricing`,
    });

    return NextResponse.json({ url });
  } catch (err) {
    console.error("[api/checkout] Stripe error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
