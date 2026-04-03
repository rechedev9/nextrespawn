import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

// Protected layout — unauthenticated users are redirected to /login.
export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>): Promise<React.ReactElement> {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
