import { Suspense } from "react";
import { AppHeader } from "@/components/layout/app-header";
import ThesesBrowser from "@/components/layout/theses-browser";
import { getCurrentUser } from "@/lib/services/auth-service";
import { getTheses } from "@/lib/services/thesis-service";
import { SubmissionBanner } from "./_components/submission-banner";

export default async function HomePage() {
  const [userResult, thesesResult] = await Promise.all([
    getCurrentUser(),
    getTheses({ limit: 100 }),
  ]);

  const role = userResult.data?.role ?? null;
  const items = thesesResult.data ?? [];

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
