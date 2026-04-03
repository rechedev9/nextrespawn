// Next.js instrumentation — runs once at server startup before any request is handled.
// Importing lib/env here activates the Zod validation so the app fails fast on
// missing or malformed environment variables instead of crashing mid-request.
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("@/lib/env");
  }
}
