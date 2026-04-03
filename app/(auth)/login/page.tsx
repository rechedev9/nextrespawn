import { LoginForm } from "@/components/shared/LoginForm";
import { config } from "@/config";

export const metadata = {
  title: "Login",
};

export default function LoginPage(): React.ReactElement {
  return (
    <main className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{config.appName}</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in to your account</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
