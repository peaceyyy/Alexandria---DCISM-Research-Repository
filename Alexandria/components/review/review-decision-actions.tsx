"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle2, Flag, ShieldAlert, Pencil, Trash2 } from "lucide-react";
import type { ReviewStatus } from "@/lib/services/types";
import type { UserRole } from "@/lib/services/types";
import styles from "./review-decision-actions.module.css";

// ─── Allowed transitions (per handoff spec) ───────────────────────────────────
//
//   for_review → accepted | flagged | trashed
//   flagged    → for_review (only by member resubmission) | trashed
//   accepted   → (no further moderator transitions)
//   trashed    → (no further moderator transitions)
//
// The UI disables irrelevant actions to reflect these rules.

function canAccept(status: ReviewStatus) {
  return status === "for_review";
}
function canFlag(status: ReviewStatus) {
  return status === "for_review";
}
function canTrash(status: ReviewStatus) {
  return status === "for_review" || status === "flagged";
}

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
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ReviewDecisionActions({
  status,
  role,
  onDecision,
  isSubmitting = false,
}: ReviewDecisionActionsProps) {
  const [showTrashConfirm, setShowTrashConfirm] = useState(false);

  const handleTrashClick = () => setShowTrashConfirm(true);
  const handleTrashCancel = () => setShowTrashConfirm(false);
  const handleTrashConfirm = () => {
    setShowTrashConfirm(false);
    onDecision("trashed");
  };

  const alreadyDecided = status === "accepted" || status === "trashed";

  return (
    <>
      <div className={styles.actions}>
        <p className={styles.sectionLabel}>Decision</p>

        {alreadyDecided ? (
          <p className={styles.statusNote}>
            {status === "accepted"
              ? "This submission has been approved. No further moderator actions are available."
              : "This submission has been trashed."}
          </p>
        ) : (
          <div className={styles.primaryActions}>
            {/* Accept */}
            <button
              type="button"
              className={styles.btnAccept}
              onClick={() => onDecision("accepted")}
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
              onClick={() => onDecision("flagged")}
              disabled={isSubmitting || !canFlag(status)}
              aria-label="Flag submission for member revision"
            >
              <Flag size={14} aria-hidden />
              Flag for Revision
            </button>

            {/* Trash — soft destructive, requires confirm */}
            <button
              type="button"
              className={styles.btnTrash}
              onClick={handleTrashClick}
              disabled={isSubmitting || !canTrash(status)}
              aria-label="Move submission to trash"
            >
              <Trash2 size={14} aria-hidden />
              Trash
            </button>
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
                disabled
                title="Direct metadata editing will be available after backend connection"
                aria-label="Edit metadata — coming soon"
              >
                <Pencil size={13} aria-hidden />
                Edit Metadata
              </button>
              <p className={styles.adminNote}>
                Direct field and PDF editing is available after the backend
                is connected.
              </p>
            </div>
          </>
        )}
      </div>

      {/* ── Trash Confirmation Modal (portaled to body to escape stacking context) ── */}
      {showTrashConfirm &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className={styles.confirmOverlay}
            role="dialog"
            aria-modal="true"
            aria-labelledby="trash-confirm-title"
          >
            <div className={styles.confirmDialog}>
              <h2 id="trash-confirm-title" className={styles.confirmTitle}>
                Trash this submission?
              </h2>
              <p className={styles.confirmBody}>
                This will remove the submission from the active review queue.
                It can be reviewed again if retrieved from the trash.
              </p>
              <div className={styles.confirmActions}>
                <button
                  type="button"
                  className={styles.btnConfirmCancel}
                  onClick={handleTrashCancel}
                  autoFocus
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={styles.btnConfirmTrash}
                  onClick={handleTrashConfirm}
                >
                  <Trash2 size={13} aria-hidden style={{ marginRight: 4 }} />
                  Move to Trash
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
