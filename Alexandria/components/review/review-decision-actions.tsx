"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Flag, RotateCcw, ShieldAlert, Pencil, Trash2, Clock } from "lucide-react";
import type { ReviewStatus } from "@/lib/services/types";
import type { UserRole } from "@/lib/services/types";
import styles from "./review-decision-actions.module.css";

// ─── Allowed transitions (per handoff spec) ───────────────────────────────────
//
//   for_review → accepted | flagged | trashed (admin only)
//   flagged    → for_review (reviewer adds more feedback) | trashed (admin only)
//   accepted   → for_review (moderator correction when approved by mistake)
//   trashed    → for_review (admin restore)
//
// The UI disables irrelevant actions to reflect these rules.

function canAccept(status: ReviewStatus) {
  return status === "for_review";
}
function canFlag(status: ReviewStatus) {
  return status === "for_review";
}
function canTrash(status: ReviewStatus) {
  return status !== "trashed";
}
function canSendBackToReview(status: ReviewStatus) {
  return status === "accepted";
}
function canUnflag(status: ReviewStatus) {
  return status === "flagged";
}

function getStatusSummary(status: ReviewStatus) {
  switch (status) {
    case "for_review":
      return "Pending";
    case "accepted":
      return "Approved";
    case "flagged":
      return "Flagged";
    case "trashed":
      return "Trashed";
  }
}

function getStatusIcon(status: ReviewStatus, size = 14) {
  switch (status) {
    case "for_review":
      return <Clock size={size} aria-hidden />;
    case "accepted":
      return <CheckCircle2 size={size} aria-hidden />;
    case "flagged":
      return <Flag size={size} aria-hidden />;
    case "trashed":
      return <Trash2 size={size} aria-hidden />;
  }
}

const STATUS_SUMMARY_CLASS: Record<ReviewStatus, string> = {
  for_review: styles.statusPending,
  accepted: styles.statusApproved,
  flagged: styles.statusFlagged,
  trashed: styles.statusTrashed,
};

type ConfirmDecision = Extract<
  ReviewStatus,
  "accepted" | "flagged" | "for_review" | "trashed"
>;

const CONFIRM_COPY: Record<
  ConfirmDecision,
  {
    title: string;
    body: string;
    actionLabel: string;
    titleId: string;
    actionClassName: string;
    icon: "approve" | "flag" | "review" | "trash";
  }
> = {
  accepted: {
    title: "Approve this submission?",
    body: "This will publish the thesis to the accepted catalog and make it visible through approved-thesis surfaces.",
    actionLabel: "Approve",
    titleId: "approve-confirm-title",
    actionClassName: styles.btnConfirmAccept,
    icon: "approve",
  },
  flagged: {
    title: "Flag this submission for revision?",
    body: "The member will be asked to review the feedback, save any needed changes, and resubmit the study for another review.",
    actionLabel: "Flag for Revision",
    titleId: "flag-confirm-title",
    actionClassName: styles.btnConfirmFlag,
    icon: "flag",
  },
  for_review: {
    title: "Send back to review?",
    body: "This will remove the approval and return the submission to the pending review queue.",
    actionLabel: "Send Back to Review",
    titleId: "send-back-confirm-title",
    actionClassName: styles.btnConfirmReview,
    icon: "review",
  },
  trashed: {
    title: "Trash this submission?",
    body: "This will remove the submission from active queues and public browsing. Only an administrator can restore it later.",
    actionLabel: "Continue",
    titleId: "trash-confirm-title",
    actionClassName: styles.btnConfirmTrash,
    icon: "trash",
  },
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface ReviewDecisionActionsProps {
  /** Current review status of the submission. */
  status: ReviewStatus;
  /** Current reviewer's role — controls which controls are visible. */
  role: UserRole;
  /** Called with the target status after the user confirms. */
  onDecision: (nextStatus: ReviewStatus) => void;
  /** Shown in a disabled state when an async action is in progress. */
  isSubmitting?: boolean;
  /** Opens the admin-only metadata correction workspace. */
  onAdminEdit?: () => void;
}

export function ReviewStatusIndicator({ status }: { status: ReviewStatus }) {
  return (
    <div
      className={`${styles.statusSummary} ${STATUS_SUMMARY_CLASS[status]}`}
      data-status={status}
      title={getStatusSummary(status)}
    >
      {getStatusIcon(status)}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ReviewDecisionActions({
  status,
  role,
  onDecision,
  isSubmitting = false,
  onAdminEdit,
}: ReviewDecisionActionsProps) {
  const [pendingDecision, setPendingDecision] = useState<ConfirmDecision | null>(null);
  const [trashConfirmationStep, setTrashConfirmationStep] = useState(1);

  const openConfirmation = (decision: ConfirmDecision) => {
    setTrashConfirmationStep(1);
    setPendingDecision(decision);
  };
  const handleConfirmCancel = () => {
    setTrashConfirmationStep(1);
    setPendingDecision(null);
  };
  const handleConfirmDecision = () => {
    if (!pendingDecision) {
      return;
    }

    if (pendingDecision === "trashed" && trashConfirmationStep === 1) {
      setTrashConfirmationStep(2);
      return;
    }

    const nextStatus = pendingDecision;
    setTrashConfirmationStep(1);
    setPendingDecision(null);
    onDecision(nextStatus);
  };

  const confirmCopy = pendingDecision
    ? pendingDecision === "trashed" && trashConfirmationStep === 2
      ? {
          ...CONFIRM_COPY.trashed,
          title: "Confirm move to trash",
          body: "The submission will now leave all active queues. Only an administrator can restore it to pending review.",
          actionLabel: "Move to Trash",
        }
      : pendingDecision === "for_review" && status === "trashed"
        ? {
            ...CONFIRM_COPY.for_review,
            title: "Restore this submission to review?",
            body: "This will return the submission to the pending review queue for a fresh moderator decision.",
            actionLabel: "Restore to Review",
            titleId: "restore-confirm-title",
          }
        : pendingDecision === "for_review" && status === "flagged"
          ? {
              ...CONFIRM_COPY.for_review,
              title: "Return this submission to review?",
              body: "The submitter will lose edit access while you add more feedback. Existing feedback will remain saved for the next flag.",
              actionLabel: "Return to Review",
              titleId: "unflag-confirm-title",
            }
          : CONFIRM_COPY[pendingDecision]
    : null;
  const confirmIcon = confirmCopy?.icon === "trash"
    ? <Trash2 size={13} aria-hidden style={{ marginRight: 4 }} />
    : confirmCopy?.icon === "review"
      ? <RotateCcw size={13} aria-hidden style={{ marginRight: 4 }} />
      : confirmCopy?.icon === "flag"
        ? <Flag size={13} aria-hidden style={{ marginRight: 4 }} />
      : <CheckCircle2 size={13} aria-hidden style={{ marginRight: 4 }} />;
  const alreadyDecided = status === "trashed";

  return (
    <>
      <div className={styles.actions}>
        <p className={styles.sectionLabel}>Decision</p>

        {canSendBackToReview(status) ? (
          <div className={styles.primaryActions}>
            <p className={styles.statusNote}>
              This submission has been approved.
            </p>
            <button
              type="button"
              className={styles.btnReview}
              onClick={() => openConfirmation("for_review")}
              disabled={isSubmitting}
              aria-label="Send submission back to review"
            >
              <RotateCcw size={14} aria-hidden />
              Send Back to Review
            </button>
            {role === "admin" && (
              <button
                type="button"
                className={styles.btnTrash}
                onClick={() => openConfirmation("trashed")}
                disabled={isSubmitting}
                aria-label="Move submission to trash"
              >
                <Trash2 size={14} aria-hidden />
                Trash
              </button>
            )}
          </div>
        ) : alreadyDecided ? (
          <div className={styles.primaryActions}>
            <p className={styles.statusNote}>
              This submission has been trashed.
            </p>
            {role === "admin" && (
              <button
                type="button"
                className={styles.btnReview}
                onClick={() => openConfirmation("for_review")}
                disabled={isSubmitting}
                aria-label="Restore submission to review"
              >
                <RotateCcw size={14} aria-hidden />
                Restore to Review
              </button>
            )}
          </div>
        ) : canUnflag(status) ? (
          <div className={styles.primaryActions}>
            <p className={styles.statusNote}>
              This submission is flagged for member revision.
            </p>
            <button
              type="button"
              className={styles.btnReview}
              onClick={() => openConfirmation("for_review")}
              disabled={isSubmitting}
              aria-label="Return flagged submission to review"
            >
              <RotateCcw size={14} aria-hidden />
              Return to Review
            </button>
            {role === "admin" && (
              <button
                type="button"
                className={styles.btnTrash}
                onClick={() => openConfirmation("trashed")}
                disabled={isSubmitting}
                aria-label="Move submission to trash"
              >
                <Trash2 size={14} aria-hidden />
                Trash
              </button>
            )}
          </div>
        ) : (
          <div className={styles.primaryActions}>
            {/* Accept */}
            <button
              type="button"
              className={styles.btnAccept}
              onClick={() => openConfirmation("accepted")}
              disabled={isSubmitting || !canAccept(status)}
              aria-label="Approve this submission"
            >
              <CheckCircle2 size={15} aria-hidden />
              Approve
            </button>

            {/* Flag for member-side revision. Members return it to pending by resubmitting. */}
            <button
              type="button"
              className={styles.btnFlag}
              onClick={() => openConfirmation("flagged")}
              disabled={isSubmitting || !canFlag(status)}
              aria-label="Flag submission for member revision"
            >
              <Flag size={14} aria-hidden />
              Flag for Revision
            </button>

            {/* Trash — soft destructive, requires confirm */}
            {role === "admin" && (
              <button
                type="button"
                className={styles.btnTrash}
                onClick={() => openConfirmation("trashed")}
                disabled={isSubmitting || !canTrash(status)}
                aria-label="Move submission to trash"
              >
                <Trash2 size={14} aria-hidden />
                Trash
              </button>
            )}
          </div>
        )}

        {/* ── Admin-only controls ─────────────────────────────────────────── */}
        {role === "admin" && (
          <>
            <div className={styles.adminDivider} role="separator" />
            <div className={styles.adminSection}>
              <p className={styles.adminLabel}>
                <ShieldAlert size={12} aria-hidden />
                Admin Controls
              </p>
              <button
                type="button"
                className={styles.btnAdminEdit}
                onClick={onAdminEdit}
                disabled={isSubmitting || status === "trashed" || !onAdminEdit}
                title={
                  status === "trashed"
                    ? "Restore the submission before correcting metadata"
                    : "Correct submission metadata"
                }
                aria-label="Correct submission metadata"
              >
                <Pencil size={13} aria-hidden />
                Correct Metadata
              </button>
              <p className={styles.adminNote}>
                Corrections keep the current review status and require an audit reason.
              </p>
            </div>
          </>
        )}
      </div>

      {/* ── Decision Confirmation Modal (portaled to body to escape stacking context) ── */}
      {confirmCopy &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className={styles.confirmOverlay}
            role="dialog"
            aria-modal="true"
            aria-labelledby={confirmCopy.titleId}
          >
            <div className={styles.confirmDialog}>
              <h2 id={confirmCopy.titleId} className={styles.confirmTitle}>
                {confirmCopy.title}
              </h2>
              <p className={styles.confirmBody}>
                {confirmCopy.body}
              </p>
              <div className={styles.confirmActions}>
                <button
                  type="button"
                  className={styles.btnConfirmCancel}
                  onClick={handleConfirmCancel}
                  autoFocus
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={confirmCopy.actionClassName}
                  onClick={handleConfirmDecision}
                >
                  {confirmIcon}
                  {confirmCopy.actionLabel}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
