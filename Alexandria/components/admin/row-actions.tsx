"use client";

import { Pencil, Trash2 } from "lucide-react";
import styles from "./row-actions.module.css";

interface RowActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  editLabel?: string;
  deleteLabel?: string;
}

export function RowActions({
  onEdit,
  onDelete,
  editLabel = "Edit",
  deleteLabel = "Delete",
}: RowActionsProps) {
  return (
    <div className={styles.actions}>
      <button
        type="button"
        className={`${styles.btn} ${styles.edit}`}
        onClick={onEdit}
        aria-label={editLabel}
        title={editLabel}
      >
        <Pencil size={14} aria-hidden />
        <span className={styles.btnLabel}>{editLabel}</span>
      </button>
      <button
        type="button"
        className={`${styles.btn} ${styles.delete}`}
        onClick={onDelete}
        aria-label={deleteLabel}
        title={deleteLabel}
      >
        <Trash2 size={14} aria-hidden />
        <span className={styles.btnLabel}>{deleteLabel}</span>
      </button>
    </div>
  );
}
