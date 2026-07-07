"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, CheckCircle2, FileText, MessageSquareText, Plus, XCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { mockReviewSubmissions, updateReviewSubmission, type UploadStatus } from "@/components/admin/mock-data";
import { StatusBadge } from "@/components/admin/status-badge";

export default function ReviewStudyDetailPage() {
  const params = useParams<{ id: string }>();
  const submissionId = Number(params?.id ?? 0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [submissions, setSubmissions] = useState(mockReviewSubmissions);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const [splitRatio, setSplitRatio] = useState(60);
  const [isResizing, setIsResizing] = useState(false);
  const [pdfPreviewFailed, setPdfPreviewFailed] = useState(false);

  const selectedSubmission = useMemo(() => {
    return submissions.find((item) => item.id === submissionId) ?? null;
  }, [submissionId, submissions]);

  useEffect(() => {
    if (selectedSubmission) {
      setComments(selectedSubmission.comments ?? []);
    }
  }, [selectedSubmission]);

  useEffect(() => {
    if (!isResizing) {
      return;
    }

    const handleMouseMove = (event: MouseEvent) => {
      if (!containerRef.current) {
        return;
      }

      const rect = containerRef.current.getBoundingClientRect();
      const nextRatio = ((event.clientX - rect.left) / rect.width) * 100;
      setSplitRatio(Math.min(75, Math.max(25, nextRatio)));
    };

    const handleMouseUp = () => setIsResizing(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const handleStatusChange = (status: UploadStatus) => {
    if (!selectedSubmission) {
      return;
    }

    const updatedSubmission = updateReviewSubmission(selectedSubmission.id, {
      status,
      moderatorComment: comment,
      comments,
    });

    if (!updatedSubmission) {
      return;
    }

    setSubmissions((current) =>
      current.map((submission) => (submission.id === selectedSubmission.id ? updatedSubmission : submission)),
    );
  };

  const handleAddComment = () => {
    const trimmed = comment.trim();
    if (!trimmed || !selectedSubmission) {
      return;
    }

    const updatedComments = [...comments, trimmed];
    setComments(updatedComments);

    const updatedSubmission = updateReviewSubmission(selectedSubmission.id, {
      comments: updatedComments,
      moderatorComment: trimmed,
    });

    if (!updatedSubmission) {
      return;
    }

    setSubmissions((current) =>
      current.map((submission) => (submission.id === selectedSubmission.id ? updatedSubmission : submission)),
    );
    setComment("");
  };

  if (!selectedSubmission) {
    return (
      <div className="flex flex-col gap-6 p-8">
        <Link
          href="/admin/review"
          className="flex w-fit items-center gap-2 rounded-[7px] border border-white/10 bg-white/[0.04] px-3 py-2 text-[13px] font-semibold text-[#d8dadc] transition hover:bg-white/[0.08]"
        >
          <ArrowLeft size={14} aria-hidden />
          Back to Review Queue
        </Link>
        <div className="rounded-[10px] border border-dashed border-white/10 bg-[#1a1e23] p-6 text-sm text-[#9ea4ad]">
          This review submission could not be found.
        </div>
      </div>
    );
  }

  const statusMessage =
    selectedSubmission.status === "Pending"
      ? "No decision has been made yet."
      : `Last updated to ${selectedSubmission.status.toLowerCase()} with moderator notes.`;

  return (
    <div className="flex flex-col gap-6 p-8">
      <Link
        href="/admin/review"
        className="flex w-fit items-center gap-2 rounded-[7px] border border-white/10 bg-white/[0.04] px-3 py-2 text-[13px] font-semibold text-[#d8dadc] transition hover:bg-white/[0.08]"
      >
        <ArrowLeft size={14} aria-hidden />
        Back to Review Queue
      </Link>

      <div ref={containerRef} className="flex flex-col gap-4 xl:flex-row xl:gap-0">
        <section
          className="rounded-[10px] border border-white/[0.07] bg-[#1a1e23] p-5"
          style={{ flexBasis: `${splitRatio}%`, minWidth: 0 }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#969696]">Study Review</p>
              <h1 className="mt-1 text-[20px] font-bold text-white">{selectedSubmission.title}</h1>
            </div>
            <StatusBadge status={selectedSubmission.status} />
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="rounded-[8px] border border-white/[0.07] bg-[#14181c] p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#969696]">Authors</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedSubmission.authors.map((author) => (
                  <span key={author} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-[#d8dadc]">
                    {author}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-[8px] border border-white/[0.07] bg-[#14181c] p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#969696]">Department</p>
              <p className="mt-1 text-sm font-medium text-white">{selectedSubmission.department}</p>
            </div>
            <div className="rounded-[8px] border border-white/[0.07] bg-[#14181c] p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#969696]">Study Type</p>
              <p className="mt-1 text-sm font-medium text-white">{selectedSubmission.studyType}</p>
            </div>
            <div className="rounded-[8px] border border-white/[0.07] bg-[#14181c] p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#969696]">Publication Date</p>
              <p className="mt-1 text-sm font-medium text-white">{selectedSubmission.publicationDate}</p>
            </div>
            <div className="rounded-[8px] border border-white/[0.07] bg-[#14181c] p-3 md:col-span-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#969696]">Research Area</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedSubmission.researchArea.map((area) => (
                  <span key={area} className="rounded-full border border-[#368bfe]/30 bg-[#368bfe]/10 px-3 py-1 text-sm text-[#8ec5ff]">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-[8px] border border-white/[0.07] bg-[#14181c] p-4">
            <div className="flex items-center gap-2 text-white">
              <MessageSquareText size={16} aria-hidden />
              <h2 className="text-[14px] font-semibold">Research Abstract</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#d8dadc]">{selectedSubmission.abstract}</p>
          </div>

          <div className="mt-5 rounded-[8px] border border-white/[0.07] bg-[#14181c] p-4">
            <div className="flex items-center gap-2 text-white">
              <FileText size={16} aria-hidden />
              <h2 className="text-[14px] font-semibold">Lessons Learned</h2>
            </div>
            <p className="mt-3 text-sm leading-6 text-[#d8dadc]">{selectedSubmission.lessonsLearned}</p>
          </div>

          <div className="mt-5 rounded-[8px] border border-white/[0.07] bg-[#14181c] p-4">
            <div className="flex items-center gap-2 text-white">
              <FileText size={16} aria-hidden />
              <h2 className="text-[14px] font-semibold">Attached PDF</h2>
            </div>
            <div className="mt-3 rounded-[8px] border border-white/[0.07] bg-white/[0.03] p-3">
              <p className="text-sm font-medium text-white">{selectedSubmission.fileName}</p>
              <p className="mt-1 text-xs text-[#9ea4ad]">{selectedSubmission.fileSize}</p>
              <a
                href={selectedSubmission.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex rounded-[7px] bg-[#368bfe] px-3 py-2 text-[12px] font-semibold text-white transition hover:opacity-90"
              >
                Open PDF in new tab
              </a>
              {!pdfPreviewFailed ? (
                <iframe
                  src={selectedSubmission.pdfUrl}
                  title={`${selectedSubmission.title} PDF preview`}
                  className="mt-4 h-[320px] w-full rounded-[8px] border border-white/10 bg-white"
                  onError={() => setPdfPreviewFailed(true)}
                />
              ) : (
                <div className="mt-4 rounded-[8px] border border-dashed border-white/10 bg-[#0f1317] p-4 text-sm text-[#d8dadc]">
                  The embedded preview is blocked in this browser. Open the PDF directly using the button above.
                </div>
              )}
            </div>
          </div>
        </section>

        <div
          className="hidden cursor-col-resize rounded-full bg-white/10 xl:block"
          style={{ width: "8px", alignSelf: "stretch" }}
          onMouseDown={() => setIsResizing(true)}
          aria-label="Resize review panels"
          role="separator"
        />

        <section className="rounded-[10px] border border-white/[0.07] bg-[#1a1e23] p-5" style={{ flexBasis: `${100 - splitRatio}%`, minWidth: 0 }}>
          <div className="flex items-center gap-2 text-white">
            <CheckCircle2 size={16} aria-hidden />
            <h2 className="text-[14px] font-semibold">Moderator Review</h2>
          </div>

          <div className="mt-4 rounded-[8px] border border-white/[0.07] bg-[#14181c] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#969696]">Add Comment</p>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Write a moderator comment..."
              className="mt-3 min-h-[100px] w-full rounded-[8px] border border-white/10 bg-[#0f1317] px-3 py-3 text-sm text-white outline-none"
            />
            <button
              type="button"
              onClick={handleAddComment}
              className="mt-3 inline-flex items-center gap-2 rounded-[7px] bg-[#368bfe] px-3 py-2 text-[13px] font-semibold text-white transition hover:opacity-90"
            >
              <Plus size={14} aria-hidden />
              Add Comment
            </button>
          </div>

          <div className="mt-5 rounded-[8px] border border-white/[0.07] bg-[#14181c] p-4">
            <div className="flex items-center gap-2 text-white">
              <MessageSquareText size={16} aria-hidden />
              <h3 className="text-[14px] font-semibold">Moderator Comments</h3>
            </div>
            <div className="mt-3 flex flex-col gap-3">
              {comments.map((item, index) => (
                <div key={`${item}-${index}`} className="rounded-[8px] border border-white/[0.07] bg-white/[0.03] p-3">
                  <p className="text-sm text-[#d8dadc]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleStatusChange("Approved")}
              className="rounded-[7px] bg-[#368bfe] px-3 py-2 text-[13px] font-semibold text-white transition hover:opacity-90"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange("Flagged")}
              className="rounded-[7px] border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[13px] font-semibold text-rose-300 transition hover:bg-rose-500/20"
            >
              Flag
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange("Pending")}
              className="rounded-[7px] border border-white/10 bg-white/[0.04] px-3 py-2 text-[13px] font-semibold text-[#d8dadc] transition hover:bg-white/[0.08]"
            >
              Pending
            </button>
          </div>

          <div className="mt-5 rounded-[8px] border border-white/[0.07] bg-[#14181c] p-4">
            <div className="flex items-center gap-2 text-white">
              <XCircle size={16} aria-hidden />
              <h3 className="text-[14px] font-semibold">Decision History</h3>
            </div>
            <p className="mt-3 text-sm text-[#d8dadc]">{statusMessage}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
