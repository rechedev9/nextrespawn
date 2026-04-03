import type React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { auth } from "@/lib/auth";

export default async function MarketingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): Promise<React.ReactElement> {
  const session = await auth();

  return (
    <>
      <Header isLoggedIn={!!session} />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
