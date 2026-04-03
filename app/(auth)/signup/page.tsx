export const metadata = {
  title: "Sign Up",
};

export default function SignUpPage(): React.ReactElement {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-sm p-6 space-y-4 rounded-xl border bg-card">
        <h1 className="text-xl font-semibold">Create an account</h1>
        <p className="text-muted-foreground text-sm">
          Authentication coming in Phase 2.
        </p>
      </div>
    </main>
  );
}
