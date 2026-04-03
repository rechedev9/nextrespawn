import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check your email",
};

export default function VerifyPage(): React.ReactElement {
  return (
    <main className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-sm text-center space-y-4">
        <h1 className="text-xl font-semibold">Check your email</h1>
        <p className="text-muted-foreground text-sm">
          We sent a magic link to your email address. Click it to sign in. The link
          expires in 10 minutes.
        </p>
        <p className="text-xs text-muted-foreground">
          Did not receive it? Check your spam folder or go back and try again.
        </p>
      </div>
    </main>
  );
}
