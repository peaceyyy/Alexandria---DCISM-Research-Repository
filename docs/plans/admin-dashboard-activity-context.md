# Admin Dashboard Activity Context Plan

> [!TIP]
> **Plan Status: READY** — The activity read boundary is approved: guarded Supabase RPCs.

## Objective

Make the admin dashboard's audit activity actionable without changing its source of truth:

- Keep `thesis_audits` as the activity source.
- Keep the dashboard preview scoped to the five newest audit events globally.
- Show each preview event's actor, thesis title, event detail, timestamp, and a link to its review record.
- Add a full, paginated activity view for active administrators and moderators.

This plan does not invent registration or upload events that do not have an audit row.

## Current State

`get_admin_dashboard_snapshot()` currently returns five audit rows with only `id`, `thesis_id`, `text`, and `occurred_at`. The dashboard component therefore cannot identify who acted, what thesis was affected, or provide an intelligible destination. The existing review-detail service already resolves audit actors and renders thesis-scoped history, but it is not suitable for a cross-thesis activity feed.

## Architecture

```text
thesis_audits + theses + users
        |
        v
guarded activity read (active admin/moderator only)
        |
        +--> get_admin_dashboard_snapshot() -> five enriched preview rows
        |
        +--> get_admin_activity_page() -> paginated enriched activity rows
                                              |
                                              v
                                  /admin/activity -> /admin/review/[thesisId]
```

The UI remains presentation-only. It receives frontend-safe activity DTOs from server services and never queries Supabase directly.

## Data Contract

Replace the ambiguous `DashboardActivityRow` shape with an explicit shared activity item used by both the dashboard preview and activity page:

```ts
type AdminActivityItem = {
  id: number;
  thesisId: number;
  thesisTitle: string;
  actorName: string;
  event: ReviewAuditEventType;
  description: string;
  occurredAt: string;
};
```

Fallback rules must preserve incomplete historic data without hiding activity:

- blank `change_description` -> `"Thesis activity recorded."`
- missing/blank actor profile -> `"Unknown user"`
- missing/blank thesis title -> `"Untitled thesis"`
- missing legacy `event` column -> reuse the established `status_changed` fallback already used by review history

`thesisId` remains an implementation identifier only; the user-facing label is the title. A row links to `/admin/review/[thesisId]`, where existing role enforcement and review-detail loading remain authoritative.

## Approved Read Boundary

The activity read boundary is **guarded Supabase RPCs**. `get_admin_dashboard_snapshot()` will enrich its five-row preview, and `get_admin_activity_page(page, limit)` will return the full feed. Both functions enforce active `admin`/`moderator` access in SQL.

The page RPC returns this SQL payload before the service maps it to the application result envelope:

```ts
{
  items: AdminActivityItem[];
  page: number;
  limit: number;
  total_count: number;
}
```

The application requests 20 rows per page; the RPC accepts a positive requested limit and clamps it to 100 rows.

## Implementation Plan

### Phase 1: Freeze the enriched activity contract

- [ ] Update `Alexandria/lib/services/types.ts` with `AdminActivityItem` and revise `AdminDashboardSnapshot.recent_activity` to use it.
- [ ] Keep dashboard-specific database naming contained in the service mapper; client-facing fields use the existing camelCase convention used by review DTOs.
- [ ] Use the approved page response shape: `items`, `page`, `limit`, and `total_count`, so the full feed can render deterministic server pagination.
- [ ] Update `docs/api-contracts.md` to state that preview activity remains the newest five globally, includes actor/title/link context, and exposes a separate paginated activity service/page.

### Phase 2: Add guarded data access

- [ ] Amend `docs/sql/admin_dashboard_backend.sql` (or the database engineer's approved migration location) so the snapshot's `recent_activity` query joins `public.theses` and `public.users` before the five-row limit is applied.
- [ ] Return the enriched fields with defensive `COALESCE`/`NULLIF` fallbacks and stable ordering: `updated_at DESC, id DESC`.
- [ ] Add `public.get_admin_activity_page(page integer, limit integer)` returning frontend-safe JSON rows and pagination metadata. Validate positive page/limit values, clamp the requested limit to 100, and use the same active admin/moderator guard as the snapshot RPC. The application requests 20 rows per page.
- [ ] Compute the count and page slice from the same audit eligibility rules. Do not filter out old rows merely because a profile/title lookup is unavailable.
- [ ] Apply least-privilege grants matching `get_admin_dashboard_snapshot()`; do not loosen table grants, RLS, or expose storage paths.
- [ ] Have the database owner review the SQL artifact and deploy it through the approved Supabase migration workflow. Repository SQL is a reviewed reference, not proof of live deployment.

### Phase 3: Map and expose the server contracts

- [ ] Update `Alexandria/lib/services/admin-dashboard-service.ts` to map each enriched snapshot row strictly and reject malformed records rather than leaking raw RPC JSON into UI code.
- [ ] Create an admin-activity service adjacent to the dashboard service that calls the approved paginated read, uses `requireRole(["admin", "moderator"])`, and returns the established `ServiceResult`/pagination envelope.
- [ ] Keep error messages user-safe and preserve the existing no-mock/no-client-Supabase rule.
- [ ] Reuse event fallback semantics from `Alexandria/lib/services/review-service.ts`; do not duplicate an incompatible actor-name resolver in client code.

### Phase 4: Make the dashboard preview useful

- [ ] Update `Alexandria/app/admin/_components/admin-dashboard-view.tsx` to show the activity description as the primary text, then actor, thesis title, and time as compact context.
- [ ] Make each preview entry a clear keyboard-accessible link to `/admin/review/[thesisId]`; title it so the destination is understandable before click.
- [ ] Add a `View all activity` link in the Recent Activity card heading or footer. Preserve the existing token-based styling, calm density, and empty state.
- [ ] Do not add a separate client fetch, infinite scroll, or dashboard-side filter state.

### Phase 5: Add the full activity page

- [ ] Add `Alexandria/app/admin/activity/page.tsx` as a Server Component that parses a positive `page` search parameter and calls the new activity service.
- [ ] Add a focused activity-feed presentation component under `Alexandria/app/admin/_components/`; render a chronological list or table with description, actor, thesis link, exact accessible timestamp, and page navigation.
- [ ] Surface a scoped unavailable state through the existing `AdminDataState` component when the service fails, rather than failing the entire dashboard.
- [ ] Add the page to the admin navigation only if product review confirms that it should be persistent navigation; the dashboard's `View all activity` link is required either way.

### Phase 6: Documentation and review handoff

- [ ] Update `docs/api-contracts.md` and any dashboard completion/report artifact that still describes activity as only text/time/thesis ID.
- [ ] Add focused service and component tests for enriched mapping, fallbacks, paging links, and authorization-error states, but do not execute them until the repository's human-review gate is explicitly approved.
- [ ] Before coding, re-read the working-tree status and preserve unrelated user changes, especially the existing review and admin UI work.

## Acceptance Criteria

- The dashboard still shows exactly five newest audit events across all theses, ordered by `updated_at DESC, id DESC`.
- Each preview event visibly identifies the actor, thesis title, action/description, and time, and opens the affected review record.
- The full activity page lists the same audit stream with server pagination; it does not silently cap the history at five events.
- Both dashboard preview and full page remain available only to active administrators and moderators.
- Historic incomplete audit/profile/thesis data is displayed with explicit fallbacks rather than causing a failed dashboard.
- No client component accesses Supabase directly; no service-role key, storage path, email, or deactivation reason enters the activity DTO.
- SQL changes receive database-owner/human review before live deployment. No tests, builds, linting, type checks, servers, or browser automation run until the explicit approval gate is given.

## Non-Goals

- Recording new categories of events such as account registration or file upload when no `thesis_audits` row exists.
- Replacing the thesis-scoped review timeline.
- Adding audit mutation/edit/delete controls, export, live polling, or notification delivery.
- Relaxing existing RLS or authorization rules to make actor names available.
