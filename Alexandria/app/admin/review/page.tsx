"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { mockReviewSubmissions } from "@/components/admin/mock-data";

export default function ReviewApprovalPage() {
  const [submissions] = useState(mockReviewSubmissions);
  const [search, setSearch] = useState("");

  const pendingSubmissions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return submissions.filter((submission) => {
      const matchesStatus = submission.status === "Pending";
      const matchesQuery =
        query.length === 0 ||
        submission.title.toLowerCase().includes(query) ||
        submission.department.toLowerCase().includes(query) ||
        submission.category.toLowerCase().includes(query) ||
        submission.authors.some((author) => author.toLowerCase().includes(query));

      return matchesStatus && matchesQuery;
    });
  }, [search, submissions]);

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-white">Review & Approval</h1>
      </div>

      <section className="rounded-[10px] border border-white/[0.07] bg-[#1a1e23] p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-bold text-white">Pending Review Queue</h2>
            <p className="text-sm text-[#9ea4ad]">Only pending studies are shown here for moderation.</p>
          </div>
          <label className="flex items-center gap-2 rounded-[7px] border border-white/10 bg-[#14181c] px-3 py-2 text-sm text-[#9ea4ad]">
            <Search size={14} aria-hidden />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search studies"
              className="w-36 bg-transparent text-sm text-white outline-none placeholder:text-[#6b7280]"
            />
          </label>
        </div>

        <div className="flex flex-col gap-3">
          {pendingSubmissions.length === 0 ? (
            <div className="rounded-[10px] border border-dashed border-white/10 bg-[#14181c] p-4 text-sm text-[#9ea4ad]">
              No pending studies match your search.
            </div>
          ) : (
            pendingSubmissions.map((submission) => (
              <div key={submission.id} className="flex flex-col gap-3 rounded-[10px] border border-white/[0.07] bg-[#14181c] p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-white">{submission.title}</p>
                <p className="mt-1 text-xs text-[#9ea4ad]">
                  {submission.authors.slice(0, 2).join(", ")} • {submission.department} • {submission.category}
                </p>
              </div>
                <Link
                  href={`/admin/review/${submission.id}`}
                  className="rounded-[7px] bg-[#368bfe] px-3 py-2 text-[13px] font-semibold text-white transition hover:opacity-90"
                >
                  View Study
                </Link>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
