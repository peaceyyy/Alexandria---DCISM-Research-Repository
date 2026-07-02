"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import styles from "./data-table.module.css";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  title: string;
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  /** Optional right-side header element (e.g. an "Add" button) */
  headerAction?: ReactNode;
  /** Unique key identifier for each row */
  rowKey: keyof T;
}

export function DataTable<T extends object>({
  title,
  columns,
  data,
  pageSize = 5,
  headerAction,
  rowKey,
}: DataTableProps<T>) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const slicedData = data.slice((page - 1) * pageSize, page * pageSize);

  return (
    <section className={styles.wrapper}>
      {/* Table header */}
      <div className={styles.tableHeader}>
        <h2 className={styles.tableTitle}>{title}</h2>
        {headerAction && <div>{headerAction}</div>}
      </div>

      {/* Scrollable table area */}
      <div className={styles.tableScroll}>
        <table className={styles.table} aria-label={title}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={String(col.key)} scope="col" className={`${styles.th} ${col.className ?? ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slicedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className={styles.empty}>
                  No records found.
                </td>
              </tr>
            ) : (
              slicedData.map((row) => (
                <tr key={String(row[rowKey])} className={styles.tr}>
                  {columns.map((col) => (
                    <td key={String(col.key)} className={`${styles.td} ${col.className ?? ""}`}>
                      {col.render
                        ? col.render(row)
                        : (row[col.key as keyof T] as ReactNode)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <button
          type="button"
          className={styles.pageBtn}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={14} aria-hidden />
          Previous
        </button>
        <span className={styles.pageInfo}>
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          className={styles.pageBtn}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          aria-label="Next page"
        >
          Next
          <ChevronRight size={14} aria-hidden />
        </button>
      </div>
    </section>
  );
}
