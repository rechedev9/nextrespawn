import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { resend, getFromAddress } from "@/lib/resend";
import { rateLimit } from "@/lib/rate-limit";

// Internal-only route for programmatic email sends.
// Protected — requires an active session.

const bodySchema = z.object({
  to: z.string().regex(/^[^@]+@[^@]+\.[^@]+$/, "Invalid email address"),
  subject: z.string().min(1).max(998),
  html: z.string().min(1),
});

export async function POST(request: Request): Promise<NextResponse> {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = rateLimit(`email:${session.user.id}`, 10, 60_000);
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

  const { to, subject, html } = parsed.data;

  // Restrict sends to the authenticated user's own email
  if (to !== session.user.email) {
    return NextResponse.json(
      { error: "Can only send emails to your own address" },
      { status: 403 }
    );
  }

  try {
    const { data, error } = await resend.emails.send({
      from: getFromAddress(),
      to,
      subject,
      html,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 502 });
    }

    return NextResponse.json({ id: data?.id });
  } catch (err) {
    console.error("[api/email/send] Resend error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
