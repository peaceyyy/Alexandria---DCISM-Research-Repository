import type { UploadStatus } from "./mock-data";
import styles from "./status-badge.module.css";

const STATUS_MAP: Record<UploadStatus, { label: string; className: string }> = {
  Pending: { label: "Pending", className: styles.pending },
  Approved: { label: "Approved", className: styles.approved },
  Rejected: { label: "Rejected", className: styles.flagged },
  Flagged: { label: "Flagged", className: styles.flagged },
};

export function StatusBadge({ status }: { status: UploadStatus }) {
  const { label, className } = STATUS_MAP[status];
  return <span className={`${styles.badge} ${className}`}>{label}</span>;
}
