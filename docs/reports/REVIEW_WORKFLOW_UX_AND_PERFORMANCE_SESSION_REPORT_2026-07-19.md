# Review Workflow, UX, and Performance Session Report

**Date:** 2026-07-19  
**Scope:** Thesis review lifecycle, submitter corrections, admin/moderator parity, dashboard usability, QA fixes, and first-pass dashboard performance work.  
**Verification status:** Mixed. SQL preflights/postflights and several end-to-end manual flows were reported as successful by the user. The newest frontend changes remain pending the repository's human-gated verification process.

## Executive Summary

This session solidified Alexandria's review loop from submission through staff
feedback, submitter corrections, resubmission, and a new review decision. It
also aligned administrator and moderator experiences, tightened role-based
controls, normalized key thesis metadata, and addressed a substantial QA
backlog.

The most important operational correction was clarifying the review lifecycle:

```text
for_review -> flagged -> for_review -> accepted
                         ^ member resubmission
```

Staff may comment while a thesis is `for_review` or `flagged`. A submitter can
edit only while the thesis is `flagged`; resubmitting returns it to
`for_review`. Administrators can return an accepted study to `for_review` for
integrity corrections. Trashing and restoration are administrator-only.

The session also identified that a slow dashboard was initially being amplified
by automatic Next.js prefetches of all visible review links. Those prefetches
caused expensive review-detail routes to load before a moderator or
administrator selected one.

## Implemented Outcomes

### 1. Review and correction workflow

- Added confirmation-oriented approval and resubmission flows to reduce
  accidental state changes.
- Added the submitter correction workspace for flagged theses, including
  field-level feedback visibility and the ability to edit all allowed thesis
  metadata before resubmission.
- Preserved reviewer feedback after a submitter addresses it. A field revision
  is an indication for staff that the submitter changed the field; it does not
  delete or retire the original comment.
- Ensured a submitter is returned to `My Submissions` after resubmitting and
  receives concise status feedback.
- Added a clear locked-state warning: after resubmission, further correction
  edits must wait until staff flag the thesis again.
- Added submitter-visible status context when opening an owned, non-flagged
  thesis from `My Submissions`; public browsing does not disclose that private
  workflow status.
- Corrected title feedback support so title comments work consistently in
  reviewer and submitter correction views.

### 2. Staff lifecycle and role boundaries

- Removed the obsolete unflag workflow and aligned UI/SQL behavior around the
  approved lifecycle.
- Kept staff commenting available for both `for_review` and `flagged` theses.
- Kept `flagged -> for_review` exclusive to a member resubmission.
- Allowed the accepted-to-review correction path for staff integrity work.
- Restricted trashed thesis visibility, trash, and restore behavior to
  administrators; moderators do not receive trashed-dashboard access or UI.
- Added double-confirmation expectations for destructive trash operations and
  retained administrator restoration as the soft-delete recovery path.

The user ran the review-access postflight successfully, reporting:

```json
{
  "staff_unflag_is_blocked": true,
  "admin_trash_guard_present": true,
  "admin_restore_path_present": true,
  "search_blocks_moderator_trash": true,
  "comment_policy_hides_trashed_from_moderators": true
}
```

### 3. Feedback data and correction reliability

- Diagnosed the correction workspace failure as a missing
  `thesis_review_comments.member_revised_at` column in the live database.
- Updated the review-feedback backend contract so saved corrected fields record
  revision timestamps used by staff-facing feedback indicators.
- Confirmed the user successfully applied the relevant Supabase SQL after the
  missing-column diagnosis.
- Restored reviewer/submitter comment author display behavior after the
  addressed-state work changed the comment data path.
- Improved comment and long-text wrapping to avoid overflow in feedback
  panels and correction surfaces.
- Moved correction errors toward bottom-right toast feedback so upload/save
  failures are visible without scrolling to the top of a long form.

### 4. Thesis metadata consistency

- Added `conference` to the relevant thesis and approval/review surfaces.
- Constrained departments to the Alexandria scope: `CS`, `IT`, and `IS`.
- Recorded the department decision for data consistency and legacy-data
  cleanup.
- Normalized research areas into the approved ten selectable values:
  Artificial Intelligence Engineering, Machine Learning, Web Development,
  Mobile Development, Cybersecurity, Internet of Things, Data Science,
  Networking, Algorithms, and Mathematics.
- Replaced free-form research-area editing in review/correction flows with the
  same constrained selection model used by thesis submission.
- Preserved the existing text-column database representation while mapping the
  deterministic selection values correctly in application code.
- Added research-area filtering and updated the staff search RPC contract.

### 5. Lessons learned and long-form content

- Standardized lessons learned as ordered, newline-separated entries rather
  than an unconstrained free-form correction textbox.
- Added a 120-character maximum per lesson entry and visible per-entry counters
  in the submission modal.
- Reused the same entry model in submitter corrections.
- Rendered lessons as numbered, wrapping entries in reviewer and public-detail
  views, preventing the published-card overflow found in QA.
- Kept abstract, recommendations, and lessons previews in dedicated dialogs so
  expanding a long field does not destabilize a review form's layout.

### 6. Admin and moderator dashboard alignment

- Consolidated the staff thesis experience around the dashboard/review queue
  rather than maintaining a redundant All Studies destination.
- Kept the intentional difference: administrators receive User Management and
  administrator-only thesis actions; moderators focus on review work.
- Removed Registered Users from the dashboard metrics; the metric belongs in
  User Management for administrators.
- Added responsive, collapsible staff navigation with a mobile navigation
  treatment and keyboard-accessible controls.
- Improved compact-window behavior and corrected the collapsed-brand overlap.
- Added a manual dashboard refresh icon that calls `router.refresh()` and
  retains the current filters instead of forcing a full browser reload.
- Grouped queue and Activity pagination controls on the right, with page
  context remaining on the left.

### 7. Staff search and filter experience

- Added debounced, URL-driven staff search with Title as the default scope and
  Author as an alternate scope.
- Kept status and department as direct controls; placed research area in the
  filter popover.
- Added persistent public-browser filters, including My Submissions state, so
  returning from a thesis does not discard the user's browsing context.
- Added thesis/capstone filtering in the public browser and exposed
  `study_type` through the relevant thesis-card/detail service types.
- Ported teammate search work carefully into the active UI rather than
  overwriting the current theme/header work.

### 8. QA fixes completed in this session

- Fixed the invalid `use server` export that broke View All Activity.
- Fixed stale client callback dependencies so a reviewer can add a comment and
  flag in the same visit without leaving and reopening the review page.
- Expanded the administrator metadata dialog to fit long editing forms.
- Added PDF replacement UX for a newly selected-but-unsaved PDF, including a
  clearer save/upload experience. Existing stored thesis PDFs remain preserved.
- Restored thesis-card abstract truncation and improved justified abstract
  text presentation.
- Added status-aware routing from My Submissions: flagged studies enter
  corrections; for-review and accepted studies open their standard preview.

## Database and Documentation Work

Relevant SQL artifacts updated or used during the session include:

- `docs/sql/review_feedback_backend.sql`
- `docs/sql/review_staff_access_fix.sql`
- `docs/sql/review_status_transition_preflight.sql`
- `docs/sql/research_area_normalization.sql`

Documentation was aligned to the final review-state decision, particularly the
removal of unflagging and the staff/comment/trash authorization boundaries.
The legacy review-submission search SQL was marked as superseded where the
current `search_review_submission_ids_v2` contract is now authoritative.

## Performance Finding: Dashboard Review-Route Prefetch

### Root cause

The dashboard rendered review links for the submission queue and recent
activity. Next.js automatically prefetches visible `<Link>` destinations. Each
prefetched `/admin/review/:id` route invoked authenticated review-detail work,
including authorization and thesis/comment-related loads.

As a result, one dashboard visit could fan out into several expensive review
requests. This matched the reported repeated arbitrary
`GET /admin/review/<id>` entries and could delay the actual dashboard.

### Applied containment

The dense dashboard review links now set `prefetch={false}`. This keeps direct
navigation intact but defers review-detail work until staff select a specific
thesis. The manual refresh control uses `router.refresh()` so it reloads the
current dashboard route without losing URL-backed filters.

### Hosting implication

The staff dashboard is authenticated and should remain dynamically rendered;
it is not a candidate for a broad static cache. For Vercel and later Coolify,
the practical next steps are:

1. Measure the dashboard RPC and review-list query latency with production-like
   data.
2. Cache only public, accepted-thesis discovery data with explicit invalidation.
3. Keep staff views authorization-aware and use route revalidation after
   mutations rather than serving stale shared dashboard data.
4. Add realtime updates only when the review workflow genuinely needs them;
   they are not required to correct this prefetch issue.

## Verification Record

### User-confirmed during the session

- The Supabase review-feedback SQL was successfully applied after the schema
  mismatch was corrected.
- Research-area normalization SQL completed successfully.
- Staff search behavior was manually tested successfully.
- The user reported the review/correction workflow working end to end after
  the database fix.
- The review-access postflight returned all expected guards as present.

### Not executed by this agent in the latest pass

The active repository gate requires explicit approval before running tests,
lint, builds, servers, or browser automation. No automated verification was
run after the latest frontend changes, including:

- dashboard review-link prefetch suppression;
- dashboard refresh control;
- queue and Activity pagination alignment;
- My Submissions owner-status indicator and study-type filter work.

## Recommended Follow-up Order

1. Manually verify the dashboard under a cold load: it should no longer issue
   review-detail requests until a review link is clicked.
2. Verify the refresh icon retains status, department, research-area, search,
   and page parameters.
3. Check queue and Activity pagination at desktop and constrained widths.
4. After explicit human approval, run the project’s intended verification set
   and record any pre-existing toolchain limitations separately from feature
   regressions.
5. Before Vercel/Coolify deployment, perform a focused production-readiness
   pass covering environment variables, Supabase connection latency, cache
   boundaries, error monitoring, and deployment-specific file-storage rules.

## Key Frontend Files Touched Across the Session

- `Alexandria/app/admin/_components/admin-dashboard-view.tsx`
- `Alexandria/app/admin/_components/admin-activity-view.tsx`
- `Alexandria/app/admin/_components/data-table.tsx`
- `Alexandria/app/admin/_components/data-table.module.css`
- `Alexandria/app/admin/review/[id]/review-detail-client.tsx`
- `Alexandria/app/submissions/[thesisId]/corrections/member-correction-client.tsx`
- `Alexandria/app/submissions/[thesisId]/corrections/member-correction-client.module.css`
- `Alexandria/app/upload/_components/lessons-modal.tsx`
- `Alexandria/components/review/review-decision-actions.tsx`
- `Alexandria/components/review/admin-metadata-editor-dialog.tsx`
- `Alexandria/components/review/comment-side-panel.module.css`
- `Alexandria/components/layout/theses-browser.tsx`
- `Alexandria/components/layout/filter-sidebar.tsx`
- `Alexandria/components/layout/details-sidebar.tsx`
- `Alexandria/lib/services/review-service.ts`
- `Alexandria/lib/services/thesis-service.ts`
- `Alexandria/lib/services/types.ts`
- `Alexandria/lib/domain/lessons.ts`

