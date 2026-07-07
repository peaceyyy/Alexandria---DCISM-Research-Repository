# Admin Dashboard Backend Integration Contract Freeze

Status: Approved  
Owner: Homer  
Approved: 2026-07-01
Rebased: 2026-07-02

## Scope

This contract governs live Supabase data for `/admin/dashboard` and unified `/admin/users` role tabs, plus reversible account deactivation as observed by authenticated users. Legacy `/admin/members` and `/admin/moderators` URLs redirect into the corresponding tab. Public repository redirects and signed-out fallback target `/home`.

## Current-Code Addendum

- Initial thesis submission is an existing `submitThesis(FormData)` server action using `requireSession()`, server-side PDF validation, Supabase Storage, and `submit_thesis_transaction`. This phase preserves that boundary.
- All current protected submission-service exports already use `requireSession()`; account enforcement belongs in the shared principal/guard plus database and Storage policy layers, not in a submission-service rewrite.
- `auth-contract.ts` already re-exports shared contracts from `services/types.ts`.
- `DbThesisAudit` must use the live `updated_at` column, not its stale `created_at` property.
- The current repository has no admin dashboard/user services and no Next.js 16 `proxy.ts`.
- Admin UI primitives are co-located under `Alexandria/app/admin/_components`.
- SQL reference artifacts are under `docs/sql`; they guide reviewed migrations but do not prove live deployment state.
- The current submission SQL reference is not contract-compliant because it trusts `payload.submitted_by_user_id`; the reviewed SQL must restore `auth.uid()` ownership while retaining current `study_type` support.

## Live Supabase Reconciliation

- All relevant `public` tables and `storage.objects` already have RLS enabled.
- The only live public-table policy is authenticated self-read on `public.users`; preserve that behavior and add active-admin read access.
- The live submission RPC is `SECURITY DEFINER`, trusts payload ownership, and was executable by `anon`. Anonymous execution was revoked manually before this migration.
- The private `thesis_files_bucket` has no MIME or size limits. Keep it private and configure PDF-only uploads with a 10 MiB limit.
- Existing Storage policies permit public object reads and bucket-wide authenticated inserts. Replace them with active-owner upload/delete policies; PDF delivery occurs through a guarded server route using a server-only service-role client.
- Live `thesis_audits.changed_by_user_id` is non-null while `change_description` is nullable. Dashboard activity uses a safe fallback for null descriptions.
- `thesis_files.file_url` contains one legacy public-style URL. Add canonical `storage_path`, backfill and validate it, preserve nullable `file_url` for rollback, and write only `storage_path` for new submissions.
- Existing rows are preserved: four users, three theses, one file row, one ownerless thesis, and eight Storage objects. Storage orphan cleanup is a separate reviewed operation.

## Submission Actor And Author Identity

- `submitted_by_user_id` always records the authenticated Alexandria account that performed the submission and is derived from Supabase `auth.uid()`.
- When an administrator submits a thesis, the administrator remains the submitter. The ordinary submission RPC has no browser-controlled ownership override.
- Thesis credit is separate: every `thesis_authors` row stores `display_name`, while `user_id` remains nullable for authors without accounts and may support future account/profile linking.
- A linked author does not automatically receive submission-owner editing rights. Ownership checks continue to use `theses.submitted_by_user_id`.

## Dashboard Snapshot

`getAdminDashboardSnapshot()` is available to `admin` and `moderator` roles and returns one serializable `ServiceResult<AdminDashboardSnapshot>`.

```ts
type AdminDashboardSnapshot = {
  viewer: { profile_name: string };
  metrics: {
    total_research: number;
    registered_users: number;
    pending_docs: number;
  };
  recent_uploads: DashboardUploadRow[];
  recent_activity: DashboardActivityRow[];
  research_by_department: DepartmentResearchCount[];
};

type DashboardUploadRow = {
  id: number;
  title: string;
  author: string;
  created_at: string;
  review_status: ReviewStatus;
};

type DashboardActivityRow = {
  id: number;
  thesis_id: number;
  text: string;
  occurred_at: string;
};

type DepartmentResearchCount = {
  department: string;
  count: number;
};
```

### Frozen Query Semantics

- `total_research`: count `theses` where `review_status <> 'trashed'`.
- `registered_users`: count active `users` across all roles, where `deactivated_at IS NULL`.
- `pending_docs`: count `theses` where `review_status = 'for_review'`.
- `research_by_department`: group all non-trashed theses by the stored `department` value. `DCISM` is the current default; future department values appear automatically.
- `recent_uploads`: newest five non-trashed theses by `created_at DESC`; author is the first `thesis_authors` row with `contribution_role = 'author'`, ordered by `sort_order` then `id`; fall back to `Unknown author`.
- `recent_activity`: newest five `thesis_audits` rows by `updated_at DESC`. Do not synthesize registration or upload events that lack an audit row.
- UI mapping: `for_review → Pending`, `accepted → Approved`, `flagged → Flagged`. Trashed rows do not appear in dashboard lists.

## User Management

- `/admin/users?role=member|moderator|admin` requests the matching `getUsers({ role })` page.
- Members, moderators, and administrators share one table and URL-backed role navigation.
- Administrator rows are read-only and visibly protected; browser actions cannot change, deactivate, or delete them.
- `/admin/members` and `/admin/moderators` remain compatibility redirects.
- Both routes use a `page` search parameter, default limit 20, and controlled server pagination from `PaginationMeta`.
- Only an active `admin` may read these lists or mutate roles/account status.
- UI role transitions are limited to `member → moderator` and `moderator → member`.
- Admin creation, profile editing, hard deletion, and assigning the `admin` role are not part of this phase.

`UserAdminRow` adds:

```ts
{
  deactivated_at: string | null;
  deactivation_reason: string | null;
  deactivated_by_user_id: string | null;
}
```

## Reversible Account Deactivation

- `deactivateUser(userId, reason)` targets only member/moderator accounts.
- `reason` is required after trimming and must be suitable for an administrator audit note.
- The mutation sets `deactivated_at`, `deactivation_reason`, and `deactivated_by_user_id`.
- `reactivateUser(userId)` clears those three current-state fields.
- Deactivation never deletes `auth.users`, `public.users`, submissions, or thesis credits.
- The acting admin cannot deactivate themselves. Admin targets are excluded from this UI and service operation.
- The members/moderators tables show Active or Deactivated and switch the row action between Deactivate and Reactivate.
- Successful role or status changes revalidate `/admin/dashboard` and `/admin/users`.

## User-Side Enforcement

- `ACCOUNT_DEACTIVATED` is a stable `ServiceError.code`.
- After valid credentials, `login()` checks the profile. A deactivated profile is immediately signed out and receives `ACCOUNT_DEACTIVATED`.
- `getCurrentUser()` is the canonical, request-memoized principal resolver; `requireSession()` and `requireRole()` consume it.
- `getCurrentUser()` and all shared guards reject deactivated profiles even when an older Supabase session cookie remains valid.
- Existing protected submission functions remain `requireSession()` consumers and must not be split away from the transactional FormData/RPC/Storage flow.
- Next.js 16 `proxy.ts` refreshes Supabase SSR cookies; it performs no database role decision and does not replace service guards.
- Protected routes redirect a deactivated session to `/login?reason=account-deactivated`.
- The login page explains that an administrator must reactivate the account.
- Public repository browsing at `/home` remains available as a signed-out guest.
- Moderator login resolves directly to `/admin/dashboard`; it must not bounce through the admin-only `/admin/moderators` route.

## Security and Data Rules

- RLS must enforce active-account and role checks; layouts alone are not authorization.
- Every `SECURITY DEFINER` function callable by `authenticated` users, including the live thesis-submission RPC, must explicitly reject `users.deactivated_at IS NOT NULL` because it can bypass table RLS.
- Storage insert/delete policies must reject deactivated users even when their Supabase Auth JWT remains valid.
- Live RPC, RLS, and Storage-policy state must be inspected before local SQL is authored; repository snapshots do not prove deployment state.
- No Supabase service-role key may enter a `NEXT_PUBLIC_*` variable, Client Component, or browser request.
- No runtime mock fallback is allowed when a live service fails.
- Guests may view the complete PDF for accepted theses through an inline server response. This is byte access, so hiding download controls is not a technical download restriction.
- Active members may explicitly download accepted PDFs. The submitter may preview their own `for_review` or `flagged` PDF. Active admin/moderator accounts may access all review states.
- Raw storage paths and the service-role key never cross into client DTOs or browser code.
- Deactivated users retain guest access after sign-out but cannot submit, explicitly download, or use authenticated privileges.
- SQL must use the migration location approved during database readiness; deleted documentation scripts must not be restored implicitly.
- SQL migrations and live Supabase changes remain behind human review.

## Human Review Gate

Coding agents may write production and test files, but must not execute tests, lint, type-checking, builds, development servers, Supabase migrations, or browser automation. Non-browser verification unlocks only after `Human review approved; run verification.` E2E/browser work requires separate explicit approval.
