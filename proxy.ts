import { NextResponse } from "next/server";
import type { NextRequest, NextProxy, ProxyConfig } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

// Proxy — auth guard + rate limiting.
// Renamed from middleware.ts in Next.js 16 (see: nextjs.org/docs/messages/middleware-to-proxy).

// Rate limit: 5 magic link requests per email per hour
const MAGIC_LINK_LIMIT = 5;
const MAGIC_LINK_WINDOW_MS = 60 * 60 * 1000;

export const proxy: NextProxy = async function (
  request: NextRequest
): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // ── Rate limit magic link requests ────────────────────────────────────────
  if (
    pathname === "/api/auth/signin/resend" &&
    request.method === "POST"
  ) {
    const body = await request.clone().formData().catch(() => null);
    const email = body?.get("email");
    if (typeof email === "string" && email.length > 0) {
      const result = rateLimit(
        `magic-link:${email.toLowerCase()}`,
        MAGIC_LINK_LIMIT,
        MAGIC_LINK_WINDOW_MS
      );
      if (!result.success) {
        return NextResponse.json(
          { error: "Too many magic link requests. Try again later." },
          {
            status: 429,
            headers: {
              "Retry-After": String(
                Math.ceil((result.resetsAt - Date.now()) / 1000)
              ),
              "X-RateLimit-Limit": String(MAGIC_LINK_LIMIT),
              "X-RateLimit-Remaining": "0",
            },
          }
        );
      }
    }
  }

  // ── Auth guard for protected routes ────────────────────────────────────────
  // Auth.js session verification happens in (dashboard)/layout.tsx via auth().
  // The proxy only adds security headers and rate limiting to keep it stateless.

  return NextResponse.next();
};

export const config: ProxyConfig = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
