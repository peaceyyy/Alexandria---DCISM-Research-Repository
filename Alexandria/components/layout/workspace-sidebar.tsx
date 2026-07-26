"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  BookOpen,
  FileText,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Upload,
  HelpCircle,
  Users,
} from "lucide-react";
import FaqModal from "./faq-modal";
import MaintainersModal from "./maintainers-modal";
import type { UserRole } from "@/lib/auth/auth-contract";
import { getPostAuthDestination } from "@/lib/auth/auth-routing";
import { logoutAction } from "@/lib/auth/actions";
import { getRoleDisplay } from "@/lib/auth/role-display";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AlexandriaBrandLockup } from "@/components/ui/alexandria-brand-lockup";
import { AuthInterceptModal } from "@/app/(auth)/_components/auth-intercept-modal";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import styles from "./filter-sidebar.module.css";

type WorkspaceSidebarProps = {
  role: UserRole | null;
  profileName?: string | null;
  flaggedSubmissionCount?: number;
};

const STORAGE_KEY = "alex:public-sidebar-collapsed";
const LEGACY_STORAGE_KEY = "alex:filter-sidebar-collapsed";

function SidebarContent({
  role,
  profileName,
  flaggedSubmissionCount = 0,
  className,
  isCollapsed = false,
  onToggleCollapse,
  onNavigate,
}: WorkspaceSidebarProps & {
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const display = getRoleDisplay(role);
  const accountName = profileName?.trim() || display.label;
  const isPrivileged = role === "admin" || role === "moderator";
  const browseActive = pathname === "/home";
  const submissionsActive = pathname === "/home" && searchParams.get("mine") === "1";
  const [faqOpen, setFaqOpen] = useState(false);
  const [maintainersOpen, setMaintainersOpen] = useState(false);

  return (
    <>
    <aside
      id="public-workspace-sidebar"
      className={cn(
        styles.sidebar,
        isCollapsed && styles.collapsed,
        "flex h-full flex-col px-3 py-4",
        className,
      )}
      aria-label="Alexandria navigation"
    >
      <div className={styles.brandRow}>
        <Link href="/home" className={styles.brand} aria-label="Alexandria repository home" onClick={onNavigate}>
          <AlexandriaBrandLockup wordmarkClassName={styles.brandName} />
        </Link>
        {onToggleCollapse && (
          <button
            type="button"
            className={styles.collapseButton}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!isCollapsed}
            aria-controls="public-workspace-sidebar"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={onToggleCollapse}
          >
            {isCollapsed ? <PanelLeftOpen size={14} aria-hidden /> : <PanelLeftClose size={14} aria-hidden />}
          </button>
        )}
      </div>

      <div className={styles.ctaRow}>
        {!role ? (
          <AuthInterceptModal iconOnly={isCollapsed} triggerClassName={isCollapsed ? styles.ctaButtonIcon : styles.ctaButton} />
        ) : (
          <Link
            href="/upload"
            className={isCollapsed ? styles.ctaButtonIcon : styles.ctaButton}
            aria-label="Contribute a thesis"
            title="Contribute"
            onClick={onNavigate}
          >
            <Upload size={14} aria-hidden />
            {!isCollapsed && <span>Contribute</span>}
          </Link>
        )}
      </div>

      <nav className={styles.workspaceNav} aria-label="Repository navigation">
        <Link
          href="/home"
          className={cn(styles.workspaceAction, browseActive && !submissionsActive && styles.workspaceActionActive)}
          aria-current={browseActive && !submissionsActive ? "page" : undefined}
          title={isCollapsed ? "Browse research" : undefined}
          onClick={onNavigate}
        >
          <BookOpen size={15} aria-hidden />
          <span className={styles.workspaceLabel}>Browse research</span>
        </Link>
        {role && (
          <Link
            href="/home?mine=1"
            className={cn(styles.workspaceAction, submissionsActive && styles.workspaceActionActive)}
            aria-current={submissionsActive ? "page" : undefined}
            title={isCollapsed ? "My submissions" : undefined}
            onClick={onNavigate}
          >
            <FileText size={15} aria-hidden />
            <span className={styles.workspaceLabel}>My submissions</span>
            {flaggedSubmissionCount > 0 && <span className={styles.revisionBadge}>{flaggedSubmissionCount}</span>}
          </Link>
        )}
      </nav>

      {!isCollapsed && (
        <div className="mt-2 border-t border-[var(--color-separator)] pt-4 text-[11px] text-[var(--color-text-muted)]">
          <div className="flex items-center gap-2 font-semibold uppercase tracking-[0.12em]">
            <LockKeyhole size={12} aria-hidden />
            <span>Coming later</span>
          </div>
          <p className="mt-2 leading-5">Bookmarks and saved drafts will live in your library.</p>
        </div>
      )}

      <div className={styles.bottomBlock}>
        <div className={styles.utilityRow}>
          <button
            type="button"
            className={styles.utilityTile}
            aria-label="Alexandria maintainers"
            title="Maintainers"
            onClick={() => {
              setMaintainersOpen(true);
              onNavigate?.();
            }}
          >
            <Users size={15} aria-hidden />
          </button>

          <button
            type="button"
            className={styles.utilityTile}
            aria-label="Frequently asked questions"
            title="FAQ"
            onClick={() => {
              setFaqOpen(true);
              onNavigate?.();
            }}
          >
            <HelpCircle size={15} aria-hidden />
          </button>

          <ThemeToggle presentation="strip" className={styles.utilityTile} />
        </div>

        <footer className={styles.accountArea}>
          {role ? (
            <div className={cn(styles.accountPill, display.className)}>
              <Link href="/profile" draggable={false} className={styles.accountLink} aria-label={`Open profile for ${accountName}`} title={accountName} onClick={onNavigate}>
                <span className={styles.roleMarker} aria-hidden>{display.abbreviation}</span>
                <span className={styles.accountName}>{accountName}</span>
              </Link>
              <form action={logoutAction} className={styles.logoutForm}>
                <button type="submit" className={styles.logoutBtn} aria-label="Log out" title="Log out">
                  <LogOut size={14} aria-hidden />
                </button>
              </form>
            </div>
          ) : (
            <Link href="/login" draggable={false} className={cn(styles.accountPill, styles.accountLink, display.className)} aria-label="Sign in" title="Sign in" onClick={onNavigate}>
              <span className={styles.roleMarker} aria-hidden>{display.abbreviation}</span>
              <span className={styles.accountName}>{accountName}</span>
            </Link>
          )}
        </footer>
      </div>
    </aside>
    <FaqModal isOpen={faqOpen} onOpenChange={setFaqOpen} />
    <MaintainersModal isOpen={maintainersOpen} onOpenChange={setMaintainersOpen} />
    </>
  );
}

/** Shared public navigation for repository, detail, and profile routes. */
export function WorkspaceSidebar(props: WorkspaceSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
    if (stored === "1") setIsCollapsed(true);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed((current) => {
      const next = !current;
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  };

  return (
    <>
      <SidebarContent {...props} className="hidden xl:flex xl:flex-col" isCollapsed={isCollapsed} onToggleCollapse={toggleCollapse} />
      <Dialog open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DialogContent className="!left-0 !top-0 h-dvh w-[min(22rem,calc(100%-2rem))] !max-w-none !translate-x-0 !translate-y-0 gap-0 overflow-y-auto rounded-none border-r border-[var(--color-separator)] bg-[var(--color-bg)] p-0 text-[var(--color-text)]">
          <SidebarContent {...props} className="border-0 px-5 pt-3 pb-5" onNavigate={() => setDrawerOpen(false)} />
        </DialogContent>
      </Dialog>
      <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        className="fixed left-0 top-4 z-30 inline-flex h-11 w-11 items-center justify-center rounded-r-md border border-l-0 border-[var(--color-separator-mid)] bg-[var(--color-surface)] text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-brand-bright)]/30 hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-bright)]/30 xl:hidden"
        aria-label="Open navigation"
        title="Open navigation"
      >
        <PanelLeftOpen size={16} aria-hidden />
      </button>
    </>
  );
}
