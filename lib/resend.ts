import { Resend } from "resend";

// Lazy singleton — same pattern as lib/stripe.ts
let _resend: Resend | null = null;

export function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY is not set");
    _resend = new Resend(key);
  }
  return _resend;
}

export const resend = new Proxy({} as Resend, {
  get(_target, prop) {
    return (getResend() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

// Lazy read — deferred until first use so env validation in lib/env.ts runs first
let _fromAddress: string | null = null;
export function getFromAddress(): string {
  if (!_fromAddress) {
    _fromAddress = process.env.RESEND_FROM ?? "noreply@localhost";
  }
  return _fromAddress;
}
