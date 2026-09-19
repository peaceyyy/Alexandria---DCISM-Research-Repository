# Route-level state inventory

**Status:** planning artifact — code audit complete; visual spot-check still required  
**Scope:** public/member routes plus the authenticated admin workspace  
**Audit date:** 2026-09-20

This is the P1-6 inventory from `docs/reports/ui-vibe-critique-report.md`. It records explicit route or component handling visible in the current code. It is not a substitute for exercising the routes in dark and light themes.

## Legend

| Mark | Meaning |
| --- | --- |
| Implemented | A route or its rendered component explicitly handles the state. |
| Redirect | The route guard moves the user to the appropriate destination. |
| N/A | That state is not meaningful for this route's current responsibility. |
| Gap | A possible state has no dedicated, user-visible handling. |

## Public and member shell

| Route | Loading | Empty | Error | Permission-denied | Success | Destructive / busy | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | N/A | N/A | N/A | N/A | Implemented | N/A | Static landing page. |
| `/home` | **Gap** | Implemented | **Gap** | N/A | Implemented | Implemented | `ThesesBrowser` handles no results and URL-filter updates. Initial route loading has no `loading.tsx`; failed list calls are reduced to `[]`, so an outage is presented as an empty repository. |
| `/theses` | N/A | N/A | N/A | N/A | Redirect | N/A | Legacy alias redirects to `/home`. |
| `/theses/[thesisId]` | **Gap** | N/A | Implemented (generic) | Implemented (generic) | Implemented | N/A | Invalid IDs, inaccessible records, and data failures show “Thesis not found.” The state exists but its causes are intentionally not distinguished. |
| `/upload` | N/A | N/A | Implemented | Server-enforced; no route message audited | Implemented | Implemented | Seven-step validation, submission dialog, progress, and retryable submit error are explicit. |
| `/profile` | **Gap** | N/A | **Gap** | Redirect | Implemented | Implemented | Unauthenticated/deactivated users are redirected. The route has no loading boundary or visible fallback if the current-user lookup itself fails. |
| `/login` | N/A | N/A | Implemented | N/A | Implemented | Implemented | Inline validation/service errors and pending submit state. |
| `/sign-up` | N/A | N/A | Implemented | N/A | Implemented | Implemented | Inline validation/service errors and pending submit state. |
| `/submissions/[thesisId]/corrections` | **Gap** | N/A | Implemented | Implemented (combined) | Implemented | Implemented | The unavailable screen covers member-only access, missing data, and invalid workflow state; correction submission has busy/error handling. |

## Admin workspace

The `/admin` layout is the permission boundary: unauthenticated users redirect to `/login`; non-staff users redirect to `/home`; deactivated accounts redirect to the login explanation. `app/admin/loading.tsx` supplies a shared loading skeleton for this route segment.

| Route | Loading | Empty | Error | Permission-denied | Success | Destructive / busy | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/admin` | Redirect | N/A | N/A | Redirect (layout) | Redirect | N/A | Index redirects to dashboard. |
| `/admin/dashboard` | Implemented | Implemented | Implemented | Redirect (layout) | Implemented | Implemented | `AdminDataState`, empty dashboard panels, query refresh state, and queue error are present. |
| `/admin/review` | Redirect | N/A | N/A | Redirect (layout) | Redirect | N/A | Redirects to the dashboard review filter. |
| `/admin/review/[id]` | Implemented | N/A | Implemented | Redirect (layout); unavailable state for invalid/non-reviewable record | Implemented | Implemented | Review actions use an explicit confirmation and submitting state. |
| `/admin/activity` | Implemented | Implemented | Implemented | Redirect (layout) | Implemented | N/A | Empty activity history and unavailable data state are distinct. |
| `/admin/users` | Implemented | Implemented | Implemented | Redirect (layout) | Implemented | Implemented | User-management view owns table/action busy states. |
| `/admin/members` | Redirect | N/A | N/A | Redirect (layout) | Redirect | N/A | Alias for `/admin/users?role=member`. |
| `/admin/moderators` | Redirect | N/A | N/A | Redirect (layout) | Redirect | N/A | Alias for `/admin/users?role=moderator`. |
| `/admin/all-studies` | Redirect | N/A | N/A | Redirect (layout) | Redirect | N/A | Legacy index redirects to dashboard. |
| `/admin/published-studies` | Redirect | N/A | N/A | Redirect (layout) | Redirect | N/A | Legacy index redirects to the all-studies accepted filter. |
| `/admin/published-studies/[id]` | Redirect | N/A | N/A | Redirect (layout) | Redirect | N/A | Legacy detail redirects to the corresponding all-studies detail path. |

The `allStudies`, `allstudy`, and `all-studies/[id]` paths are legacy/compatibility routes. They should be included in a later route-retirement decision, not treated as new UI surfaces in this inventory.

## Actual gaps to triage

1. **`/home`: distinguish unavailable data from no results.** Preserve the existing empty state for a successful zero-result query; add a separate repository-unavailable treatment only when the list request fails.
2. **Public/member route loading boundaries.** `/home`, thesis detail, profile, and corrections can wait on server data with no sibling `loading.tsx`. Decide whether the public shell needs a scoped shared loading treatment, rather than four inconsistent route skeletons.
3. **`/profile`: current-user service failure.** Redirects are correct for absent/deactivated accounts, but a service error currently has no defined user-facing outcome.

## Required visual follow-up

Before implementation, open each non-redirect route in both themes and check the listed explicit state plus the gap candidate. Verify focus placement after redirects/dialog close, readable error contrast, and that loading does not shift the shell unexpectedly.
