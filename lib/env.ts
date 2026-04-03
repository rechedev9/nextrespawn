import { z } from "zod";

// Validated at module load — app will not start if required vars are missing.
// Add new required vars here so the error surface stays in one place.

const serverSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_URL: z.string().min(1, "DIRECT_URL is required"),

  // Auth.js
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),
  AUTH_GOOGLE_ID: z.string().min(1, "AUTH_GOOGLE_ID is required"),
  AUTH_GOOGLE_SECRET: z.string().min(1, "AUTH_GOOGLE_SECRET is required"),

  // Resend
  RESEND_API_KEY: z.string().regex(/^re_/, "RESEND_API_KEY must start with re_"),
  RESEND_FROM: z.string().regex(/^[^@]+@[^@]+\.[^@]+$/, "RESEND_FROM must be a valid email address"),

  // Stripe
  STRIPE_SECRET_KEY: z.string().min(1, "STRIPE_SECRET_KEY is required"),
  STRIPE_WEBHOOK_SECRET: z.string().regex(/^whsec_/, "STRIPE_WEBHOOK_SECRET must start with whsec_"),

  // Node
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().regex(/^https?:\/\/.+/, "NEXT_PUBLIC_APP_URL must be a valid URL"),
});

function validateEnv(): z.infer<typeof serverSchema> & z.infer<typeof clientSchema> {
  // Only validate server-side env vars on the server
  if (typeof window !== "undefined") {
    const clientResult = clientSchema.safeParse(process.env);
    if (!clientResult.success) {
      const missing = clientResult.error.issues
        .map((i) => `  ${i.path.join(".")}: ${i.message}`)
        .join("\n");
      throw new Error(`Missing or invalid client environment variables:\n${missing}`);
    }
    // Return a partial object on client — server vars are not available
    return clientResult.data as ReturnType<typeof validateEnv>;
  }

  const serverResult = serverSchema.safeParse(process.env);
  const clientResult = clientSchema.safeParse(process.env);

  const errors: string[] = [];
  if (!serverResult.success) {
    errors.push(
      ...serverResult.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`)
    );
  }
  if (!clientResult.success) {
    errors.push(
      ...clientResult.error.issues.map((i) => `  ${i.path.join(".")}: ${i.message}`)
    );
  }

  if (errors.length > 0) {
    // Fail fast — do not let the app boot with missing configuration
    console.error("❌ Invalid environment variables:\n" + errors.join("\n"));
    process.exit(1);
  }

  // Both results are valid here — process.exit(1) was called if either failed
  if (serverResult.success && clientResult.success) {
    return { ...serverResult.data, ...clientResult.data };
  }
  // Unreachable — TypeScript cannot infer process.exit(1) as never
  throw new Error("Environment validation failed");
}

export const env = validateEnv();
