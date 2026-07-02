import type { Metadata } from "next";
import { AuthShell } from "../_components/auth-shell";
import { LoginForm } from "../_components/login-form";

export const metadata: Metadata = { title: "Log In" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string }>;
}) {
  const { registered } = await searchParams;

  return (
    <AuthShell>
      <LoginForm registered={registered === "1"} />
    </AuthShell>
  );
}
