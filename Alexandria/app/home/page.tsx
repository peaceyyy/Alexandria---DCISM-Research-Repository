import { Suspense } from "react";
import { AppHeader } from "@/components/layout/app-header";
import { getCurrentUser } from "@/lib/services/auth-service";
import { SubmissionBanner } from "./_components/submission-banner";

export default async function HomePage() {
  const userResult = await getCurrentUser();
  const role = userResult.data?.role ?? null;

  return (
    <div className="min-h-screen bg-[#14181c] text-white">
      <AppHeader role={role} />

      {/* Submission success banner — only visible after ?submitted=1 redirect */}
      <Suspense fallback={null}>
        <SubmissionBanner />
      </Suspense>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-12 sm:px-10 lg:px-16">
        <h1 className="text-3xl font-bold mb-8">Repository</h1>

        <div className="flex flex-col gap-6">
          {/* Mock Thesis Card */}
          <div className="rounded-lg border border-[#d9d9d9]/15 p-6 transition-colors hover:bg-white/5">
            <div className="mb-2 text-sm text-[#969696]">2026 • Computer Science</div>
            <h2 className="mb-3 text-xl font-extrabold leading-tight">
              An Analysis of Distributed Systems in Micro-Frontend Architectures
            </h2>
            <p className="text-sm text-[#d8dadc] line-clamp-3">
              This paper explores the intricacies of implementing distributed systems concepts within the context of micro-frontend architectures, focusing on performance, state synchronization, and fault tolerance across decoupled UI domains.
            </p>
            <div className="mt-4 flex gap-2">
              <span className="rounded-full bg-[#1da0c9]/10 px-3 py-1 text-xs font-medium text-[#1da0c9]">Architecture</span>
              <span className="rounded-full bg-[#1da0c9]/10 px-3 py-1 text-xs font-medium text-[#1da0c9]">Frontend</span>
            </div>
          </div>

          <div className="rounded-lg border border-[#d9d9d9]/15 p-6 transition-colors hover:bg-white/5">
            <div className="mb-2 text-sm text-[#969696]">2025 • Information Technology</div>
            <h2 className="mb-3 text-xl font-extrabold leading-tight">
              Evaluating Machine Learning Models for Early Bug Detection
            </h2>
            <p className="text-sm text-[#d8dadc] line-clamp-3">
              A comprehensive study on utilizing various machine learning approaches to identify potential software defects during the early stages of the development lifecycle, significantly reducing QA turnaround times.
            </p>
            <div className="mt-4 flex gap-2">
              <span className="rounded-full bg-[#1da0c9]/10 px-3 py-1 text-xs font-medium text-[#1da0c9]">Machine Learning</span>
              <span className="rounded-full bg-[#1da0c9]/10 px-3 py-1 text-xs font-medium text-[#1da0c9]">QA</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
