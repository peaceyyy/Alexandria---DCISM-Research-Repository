import type { Metadata } from "next";
import { AuthShell } from "../_components/auth-shell";
import { SignUpForm } from "../_components/sign-up-form";

export const metadata: Metadata = { title: "Sign Up" };

export default function SignUpPage() {
  return (
    <AuthShell>
      <SignUpForm />
    </AuthShell>
  );
}
