# Admin Dashboard Backend Integration — Current Codebase Audit

Date: 2026-07-02  
Mode: Static/read-only audit  
Baseline commit: `2d4268da59e2842d63eae0e901cc5f2b8e7a7c2c`

## Verdict

The admin frontend remains ready for backend binding, but the original execution graph must be rebased before coding. The dashboard/member/moderator pages are still mock-backed and the planned admin services still do not exist. New submission, routing, auth-contract, and documentation work changes the prerequisites and file ownership.

## Proven Current State

| Area | Current evidence | Plan impact |
| --- | --- | --- |
| Repository route | Public browsing moved from `/theses` to `/home`; admin layout/sidebar and auth routing use `/home`. | Replace every stale `/theses` assumption and preserve `/home` during deactivation redirects. |
| Submission flow | `submission-service.ts` uses `requireSession()` for all protected exports. Initial submission validates one PDF, uploads through the server client, then calls `submit_thesis_transaction` with cleanup on RPC failure. | Do not assign `submission-service.ts` to the auth agent. Central active-account enforcement will propagate through the existing guard. |
| Direct backend bypass | The application calls a privileged RPC and authenticated Storage APIs. The repository schema snapshot contains no RLS policies, and the SQL scripts that described RPC/Storage setup were deleted in the observed working tree. | Database readiness must validate live RLS, Storage policies, and active-account checks inside privileged RPCs; Next.js guards alone are insufficient. |
| Shared contracts | `lib/auth/auth-contract.ts` re-exports `CurrentUser`, `ServiceResult`, `ServiceError`, and role types from `lib/services/types.ts`. | Remove obsolete duplicate-contract consolidation work. Keep `types.ts` canonical. |
| Admin frontend | `/admin/dashboard`, `/admin/members`, and `/admin/moderators` still import `components/admin/mock-data.ts`; `DataTable` still paginates only an in-memory array. | Live page binding and controlled/server pagination remain required. |
| Admin backend | `admin-dashboard-service.ts`, `admin-thesis-service.ts`, and `user-service.ts` are absent. | Create only the aggregate dashboard and user services needed by these three pages; do not absorb the full moderation feature. |
| Auth/session plumbing | `lib/supabase/server.ts` uses legacy per-cookie methods and suppresses write failures on the assumption that refresh middleware exists; no `proxy.ts` or `middleware.ts` exists. | Add a Next.js 16 `proxy.ts` refresh boundary and modern `getAll`/`setAll` cookie handling before relying on long-lived protected sessions. |
| Repeated principal reads | Admin layout resolves `getCurrentUser()` and planned page services would resolve it again through `requireRole()`. | Add request-scoped principal memoization while retaining server-side role checks in every service/action. |
| Moderator routing | `auth-routing.ts` sends moderators to `/admin/moderators`, whose nested layout immediately redirects them to `/admin/dashboard`; the accepted design says moderators land on the dashboard. | Normalize the post-auth destination to `/admin/dashboard` and update the adjacent routing test. |
| Audit timestamp | SQL defines `thesis_audits.updated_at`; `DbThesisAudit` currently declares `created_at`. | Correct the canonical raw type before implementing audit-only activity. |
| User account state | `DbUser` and `UserAdminRow` have no deactivation fields; current canonical docs expose only list and role-update contracts. | Add deactivation fields/functions to executable types and authoritative docs in one contract-alignment pass. |
| Tests | Existing tests are adjacent `*.test.ts` files under `lib/auth`; no admin service/component tests exist. | New tests should follow the adjacent-file convention and remain unexecuted until approval. |

## Source-of-Truth Adjustment

Use, in order:

1. Live code under `Alexandria/app`, `Alexandria/components`, and `Alexandria/lib`.
2. `Alexandria/lib/services/types.ts` for executable shared contracts.
3. `docs/api-contracts.md`, `docs/backend_functions.md`, and `docs/backend-readiness-plan.md`.
4. `docs/database-engineer-reference.md`, `docs/design-decision-log.md`, and `docs/updated_db_fields.sql`.
5. Current completion reports and handoffs as evidence, not executable contracts.

Do not depend on deleted `docs/page_backend_mapping.md`, deleted SQL scripts, old frontend `features/...` paths, or stale draft/published/contributor language.

## Preserved Working-Tree Changes

At audit time, unrelated documentation/SQL deletions and an untracked thesis-submission completion report were present. They belong to the user/other work and were not restored, staged, or rewritten.

## Rebased Critical Path

Contract freeze → live DB/RLS/RPC/Storage readiness + canonical DTO/docs alignment → session refresh and active-principal enforcement → dashboard/user services → page binding → human review → approved verification.

## Verification Status

No tests, lint, type-checking, builds, development servers, browser automation, or live Supabase checks were run during this audit.
