import { Suspense } from "react";
import { AppHeader } from "@/components/layout/app-header";
import ThesesBrowser from "@/components/layout/theses-browser";
import { getCurrentUser } from "@/lib/services/auth-service";
import { SubmissionBanner } from "./_components/submission-banner";
import { items } from "@/lib/mock-data/theses";

export default async function HomePage() {
  const userResult = await getCurrentUser();
  const role = userResult.data?.role ?? null;

  return (
    <main className="h-screen overflow-hidden bg-[#14181c] text-white">
      <AppHeader role={role} />
      <Suspense fallback={null}>
        <SubmissionBanner />
      </Suspense>
      <ThesesBrowser items={items} />
    </main>
  );
}
