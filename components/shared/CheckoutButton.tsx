"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  readonly priceId: string;
  readonly label?: string;
}

export function CheckoutButton({
  priceId,
  label = "Get started",
}: Props): React.ReactElement {
  const [loading, setLoading] = useState(false);

  async function handleClick(): Promise<void> {
    setLoading(true);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });

    if (!res.ok) {
      setLoading(false);
      const data = (await res.json()) as { error?: string };
      alert(data.error ?? "Something went wrong. Please try again.");
      return;
    }

    const data = (await res.json()) as { url: string };
    window.location.href = data.url;
  }

  return (
    <Button onClick={handleClick} disabled={loading} className="w-full">
      {loading ? "Redirecting…" : label}
    </Button>
  );
}
