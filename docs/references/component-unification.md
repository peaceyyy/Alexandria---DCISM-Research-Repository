# Controlled component unification sweep

**Status:** planning artifact — no migrations approved  
**Scope:** P1-7 families from `docs/reports/ui-vibe-critique-report.md`  
**Audit date:** 2026-09-20

This sweep uses the three-instance threshold. A documented family contract is not authorization to replace every local control: product-specific copy, consequences, and state content remain local.

## 1. Return controls

| Evidence | Current behavior | Contract / decision |
| --- | --- | --- |
| `components/ui/back-link.tsx` | Shared navigation affordance: arrow, text label, focus ring, and optional compact icon-only form. | **Canonical for ordinary route navigation.** Keep `href`, `label`, optional `compact`, and a narrowly-scoped `className` escape hatch. |
| `components/layout/task-header.tsx` | Uses `BackLink` in a focused member task header. | Existing canonical use. |
| `app/profile/_components/profile-page.tsx` | Uses `BackLink` to return to repository/dashboard. | Existing canonical use. |
| `app/admin/review/[id]/review-detail-client.tsx` | Uses full and compact `BackLink` variants at responsive breakpoints. | Existing canonical use. |
| `app/theses/[thesisId]/page.tsx` | Defines an inline `Link` with an arrow and “Back” label. | **Migration candidate:** use `BackLink` while retaining the route's safe `returnTo` calculation. |
| `app/upload/page.tsx` | Back moves between wizard steps or invokes unsaved-work protection. | **Exception:** this is workflow history, not ordinary navigation; do not replace with `BackLink`. |

## 2. Icon-only utility actions

| Evidence | Current behavior | Contract / decision |
| --- | --- | --- |
| `components/layout/theses-browser.tsx` | Density toggles use `Button`, an icon size, `aria-label`, and `title`. | A stable example for compact view-mode actions. |
| `app/admin/_components/admin-dashboard-view.tsx` | Refresh and search-scope actions are `size-9` buttons with `aria-label` and `title`. | A stable example for admin toolbar actions. |
| `app/admin/review/[id]/review-detail-client.tsx` | Review-panel collapse control supplies a changing `aria-label`; its visual size is context-specific. | A stable example for stateful icon actions. |

**Contract to adopt before any migration:** icon-only interactive controls must have an accessible name; show a tooltip/title when the action is not apparent from surrounding text; use a minimum 32px desktop target and preserve the 44px mobile target where touch is primary; use the shared focus treatment and `aria-pressed` for toggles. Keep the existing `Button` primitive as the base. Do not add a separate universal icon-button component unless a later audit finds repeated styling that the primitive cannot express.

## 3. Confirmation shells

| Evidence | Current behavior | Contract / decision |
| --- | --- | --- |
| `components/ui/confirm-dialog.tsx` and `components/review/review-decision-actions.tsx` | The shared shell owns title, description, cancel/confirm footer, intent, optional cancel copy, and pending lockout. | **Canonical for ordinary irreversible review decisions.** |
| `app/upload/_components/staff-sample-confirm-dialog.tsx` | Uses the shared shell with neutral “Keep editing” and “Load sample fields” wording. | **Migrated:** the shared contract preserves the staff workflow's copy without adding a separate shell. |
| `app/upload/_components/exit-warning-dialog.tsx` | Local destructive warning with no asynchronous action. | **Exception:** leave/stay language and unsaved-work consequence are workflow-specific; either retain it or extend the shared shell only if other guarded-exit dialogs appear. |
| `app/upload/_components/submit-confirm-dialog.tsx` | Local shell includes submission progress, retryable error content, and a sample-data warning. | **Exception:** it needs a body slot and a different footer interaction model; do not force it into the current `ConfirmDialog`. |

The staff-sample dialog is now migrated. `ConfirmDialog` gained only optional cancel copy, which preserves local workflow wording without changing the confirmation behavior.

## 4. Status notices and inline errors

| Evidence | Current behavior | Contract / decision |
| --- | --- | --- |
| `app/admin/_components/admin-data-state.tsx` | Shared unavailable-data surface with title and message. | **Canonical for admin route-level unavailable states.** |
| `components/ui/toast-provider.tsx` | Shared transient success/error/info notification. | **Canonical for non-blocking, transient feedback.** |
| `app/(auth)/_components/auth-field.tsx` and `password-field.tsx` | Field-scoped validation messages connected by `aria-describedby`. | **Canonical at the field level; do not replace with toasts.** |
| `app/upload/_components/submit-confirm-dialog.tsx` | A persistent error inside an open submit dialog, with retry context. | **Exception:** must remain local to the decision surface. |

No new generic alert component is justified. The meaningful distinction is placement and recovery path: field errors stay with fields, action errors stay beside the action, admin route failures use `AdminDataState`, and transient feedback uses the toast provider.

## Proposed implementation order after review

1. Decide whether to migrate the public thesis-detail return link to `BackLink`.
2. Re-audit icon-only controls after the route-level state work; migrate only repeated deviations from the documented contract.
