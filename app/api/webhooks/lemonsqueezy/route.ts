import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface LsWebhookMeta {
  event_name: string;
  custom_data?: { userId?: string };
}

interface LsOrder {
  attributes: {
    customer_id: number;
    status: string;
    first_order_item?: { variant_id: number };
  };
}

interface LsSubscription {
  attributes: {
    customer_id: number;
    status: string;
    variant_id: number;
  };
}

interface LsPayload {
  meta: LsWebhookMeta;
  data: LsOrder | LsSubscription;
}

export async function POST(request: Request): Promise<NextResponse> {
  const rawBody = await request.text();
  const signature = request.headers.get("x-signature");

  if (!signature || !process.env.LEMONSQUEEZY_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // Verify webhook signature
  const hmac = createHmac("sha256", process.env.LEMONSQUEEZY_WEBHOOK_SECRET);
  hmac.update(rawBody);
  const digest = Buffer.from(hmac.digest("hex"), "utf8");
  const incoming = Buffer.from(signature, "utf8");

  if (digest.length !== incoming.length || !timingSafeEqual(digest, incoming)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let payload: LsPayload;
  try {
    payload = JSON.parse(rawBody) as LsPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { event_name, custom_data } = payload.meta;
  const userId = custom_data?.userId;

  if (!userId) {
    console.warn("[lemonsqueezy/webhook] Missing custom_data.userId for event:", event_name);
  }

  try {
    switch (event_name) {
      case "order_created":
      case "subscription_created":
        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              hasAccess: true,
              subscriptionStatus: event_name === "order_created" ? "one_time" : "active",
            },
          });
        }
        break;

      case "subscription_updated": {
        const sub = payload.data as LsSubscription;
        if (userId) {
          const isActive =
            sub.attributes.status === "active" ||
            sub.attributes.status === "on_trial";
          await prisma.user.update({
            where: { id: userId },
            data: {
              hasAccess: isActive,
              subscriptionStatus: sub.attributes.status,
            },
          });
        }
        break;
      }

      case "subscription_cancelled":
        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              hasAccess: false,
              subscriptionStatus: "cancelled",
            },
          });
        }
        break;

      default:
        break;
    }
  } catch (err) {
    console.error("[lemonsqueezy/webhook] Handler error:", err);
    return NextResponse.json({ error: "Handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
