"use client";

import { ClipboardCheck, ExternalLink, LayoutDashboard, LogOut, Users, UserCheck, BookOpenText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./admin-sidebar.module.css";

import type { UserRole } from "@/lib/auth/auth-contract";

type NavLink = {
  href: string;
  label: string;
  icon: any;
  roles: UserRole[];
};

const NAV_LINKS: NavLink[] = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "moderator"] },
  { href: "/admin/review", label: "Review & Approval", icon: ClipboardCheck, roles: ["admin", "moderator"] },
  { href: "/admin/allStudies", label: "All Studies", icon: BookOpenText, roles: ["admin", "moderator"] },
  { href: "/admin/published-studies", label: "Published Studies", icon: BookOpenText, roles: ["admin", "moderator"] },
  { href: "/admin/members", label: "Members", icon: Users, roles: ["admin"] },
  { href: "/admin/moderators", label: "Moderators", icon: UserCheck, roles: ["admin"] },
];

export function AdminSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      {/* Brand */}
      <Link href="/admin/dashboard" className={styles.brand} aria-label="Alexandria Admin Home">
        <Image
          src="/brand/alexandria-mark.svg"
          width={36}
          height={36}
          alt=""
          priority
        />
        <span className={styles.brandText}>ALEXANDRIA</span>
      </Link>

      {/* Navigation */}
      <nav className={styles.nav} aria-label="Admin navigation">
        <ul role="list" className={styles.navList}>
          {NAV_LINKS.filter((link) => link.roles.includes(role)).map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon size={18} aria-hidden className={styles.navIcon} />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Browse Repository — lets admins/mods see the public site */}
      <div className={styles.viewSite}>
        <Link
          href="/home"
          className={styles.viewSiteLink}
          aria-label="Browse the public thesis repository"
        >
          <ExternalLink size={14} aria-hidden />
          <span>Browse Repository</span>
        </Link>
      </div>

      {/* Logout */}
      <div className={styles.footer}>
        <button
          type="button"
          className={styles.logoutBtn}
          aria-label="Log out"
        >
          <LogOut size={16} aria-hidden />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
