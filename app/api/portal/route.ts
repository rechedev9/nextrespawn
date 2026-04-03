import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPortalSession } from "@/lib/stripe";
import { config } from "@/config";

export async function POST(): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeCustomerId: true },
  });

  if (!user?.stripeCustomerId) {
    return NextResponse.json(
      { error: "No Stripe customer found. Purchase a plan first." },
      { status: 400 }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? config.domain;

  try {
    const url = await createPortalSession(
      user.stripeCustomerId,
      `${appUrl}/dashboard`
    );
    return NextResponse.json({ url });
  } catch (err) {
    console.error("[api/portal] Stripe error:", err);
    return NextResponse.json({ error: "Failed to create portal session" }, { status: 500 });
  }
}
