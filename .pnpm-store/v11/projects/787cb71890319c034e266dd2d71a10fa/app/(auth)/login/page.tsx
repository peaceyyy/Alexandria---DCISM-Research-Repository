import type { Metadata } from "next";
import { AuthShell } from "../_components/auth-shell";
import { LoginForm } from "../_components/login-form";

export const metadata: Metadata = { title: "Log In" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; reason?: string }>;
}) {
  const { reason, registered } = await searchParams;

  return (
    <AuthShell>
      <LoginForm
        deactivated={reason === "account-deactivated"}
        registered={registered === "1"}
      />
    </AuthShell>
  );
}
