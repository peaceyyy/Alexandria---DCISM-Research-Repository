import type { ReviewStatus } from "@/lib/services/types";
import { REVIEW_STATUS_LABEL } from "@/components/review/types";
import styles from "./status-badge.module.css";

const STATUS_CLASS: Record<ReviewStatus, string> = {
  for_review: styles.pending,
  accepted: styles.approved,
  flagged: styles.flagged,
  trashed: styles.trashed,
};

export function StatusBadge({ status }: { status: ReviewStatus }) {
  return (
    <span className={`${styles.badge} ${STATUS_CLASS[status]}`}>
      {REVIEW_STATUS_LABEL[status]}
    </span>
  );
}
