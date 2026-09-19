"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useTransition,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

type ResultUpdateContextValue = {
  /** True while any URL navigation triggered through `navigate()` is pending. */
  isPending: boolean;
  /**
   * Navigate to a new URL through a shared React transition.
   * Components inside the result region MUST call this instead of calling
   * `router.push` directly so that the shared `isPending` signal stays
   * accurate and focus is restored after the update completes.
   */
  navigate: (url: string) => void;
};

// ─── Context ──────────────────────────────────────────────────────────────────

const ResultUpdateContext = createContext<ResultUpdateContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * Wrap the result region (including search bar, filter controls, and card list)
 * in this provider. It owns the single `useTransition` that tracks when a
 * URL-backed result update is in flight.
 *
 * Focus is captured from `document.activeElement` at the moment `navigate` is
 * called and restored once `isPending` clears, preserving keyboard focus on
 * the control that initiated the update.
 */
export function ResultUpdateProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const focusTargetRef = useRef<Element | null>(null);
  const wasPendingRef = useRef(false);

  // Restore focus after React has committed the pending → resolved transition.
  useEffect(() => {
    if (isPending) {
      wasPendingRef.current = true;
      return;
    }

    if (!wasPendingRef.current || !focusTargetRef.current) return;

    if (
      focusTargetRef.current instanceof HTMLElement ||
      focusTargetRef.current instanceof SVGElement
    ) {
      focusTargetRef.current.focus({ preventScroll: true });
    }

    focusTargetRef.current = null;
    wasPendingRef.current = false;
  }, [isPending]);

  const navigate = useCallback(
    (url: string) => {
      // Capture focus before the transition begins
      focusTargetRef.current = document.activeElement;
      startTransition(() => router.push(url));
    },
    [router],
  );

  return (
    <ResultUpdateContext.Provider value={{ isPending, navigate }}>
      {children}
    </ResultUpdateContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Consume the shared result-update pending state and navigator.
 *
 * Safe fallback: if called outside a `ResultUpdateProvider` (e.g. in a unit
 * test or a standalone page), returns a no-op `isPending=false` and delegates
 * directly to `router.push` so the component remains functional.
 */
export function useResultUpdate(): ResultUpdateContextValue {
  const ctx = useContext(ResultUpdateContext);
  const router = useRouter();

  if (ctx) return ctx;

  // Fallback — component is rendered outside the provider
  return {
    isPending: false,
    navigate: (url) => router.push(url),
  };
}
