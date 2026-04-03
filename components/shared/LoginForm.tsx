"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm(): React.ReactElement {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleMagicLink(e: React.SyntheticEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("resend", {
      email,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Could not send the link. Please try again.");
    } else {
      setSent(true);
    }
  }

  async function handleGoogle(): Promise<void> {
    setLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  if (sent) {
    return (
      <div className="rounded-xl border bg-card p-6 text-center space-y-2">
        <p className="font-medium">Check your inbox</p>
        <p className="text-sm text-muted-foreground">
          A magic link was sent to <strong>{email}</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-6 space-y-4">
      <Button
        variant="outline"
        className="w-full"
        onClick={handleGoogle}
        disabled={loading}
        type="button"
      >
        Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs text-muted-foreground">
          <span className="bg-card px-2">or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleMagicLink} className="space-y-3">
        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          autoComplete="email"
        />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading || !email}>
          {loading ? "Sending…" : "Send magic link"}
        </Button>
      </form>
    </div>
  );
}
