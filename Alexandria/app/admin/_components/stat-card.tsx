import type { LucideIcon } from "lucide-react";
import styles from "./stat-card.module.css";

interface StatCardProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
}

export function StatCard({ icon: Icon, value, label }: StatCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.iconWrap} aria-hidden>
        <Icon size={24} />
      </div>
      <div className={styles.body}>
        <span className={styles.value}>{value}</span>
        <span className={styles.label}>{label}</span>
      </div>
    </article>
  );
}
