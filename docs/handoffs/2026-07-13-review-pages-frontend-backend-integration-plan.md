# Handoff: Review Pages Frontend/Backend Integration Plan

Date: 2026-07-13
Workspace: Alexandria - DCISM Thesis Repository
Audience: Frontend implementation agent, backend integration agent
Related docs:

- `docs/handoffs/2026-07-09-review-feedback-functionality.md`
- `docs/handoffs/2026-07-08-moderator-review-lifecycle.md`
- `docs/DESIGN.md`
- `docs/api-contracts.md`
- `docs/backend-readiness-plan.md`

## Purpose

This document explains how the moderator review page and member correction flow
should connect to backend services and Supabase-backed data.

The frontend implementation should preserve the current moderator review page
structure and interaction style. The work is mostly about replacing mock data
with service-layer DTOs and ensuring the member-side correction experience uses
the same review/comment data as the moderator side.

This is not a request to build a PDF annotation editor, automated email system,
or full admin metadata editor during the final MVP push.

## Scope For The Final Push

Implement or plan around these two connected experiences:

1. Moderator/admin review page:
   - Review submitted theses.
   - Add field-level comments.
   - Add general PDF feedback through `pdf_general`.
   - Flag, accept, or trash submissions.
   - View audit history.

2. Member correction flow:
   - Show a home-like "My Submissions" view/filter.
   - Show a flagged-submission badge count.
   - Open flagged owned submissions in a correction view.
   - Let the member edit fields, mark feedback as addressed, and resubmit.

Defer:

- Automated email notifications.
- In-browser PDF annotation.
- Uploading reviewer-annotated PDFs.
- Admin direct metadata/PDF editing unless the core loop is already stable.

## Backend Status Contract

Use only canonical database review statuses in data and service calls.

| Backend Status | UI Label | Who Sees It | Meaning |
| --- | --- | --- | --- |
| `for_review` | Pending | Reviewers, owner | Submitted and locked while waiting for review. |
| `flagged` | Flagged | Reviewers, owner | Returned to member for correction. |
| `accepted` | Approved | Public | Approved and visible in `/home`. |
| `trashed` | Trashed | Reviewers/admins | Removed from active review/public surfaces. |

Allowed final-push transitions:

```text
for_review -> accepted
for_review -> flagged
for_review -> trashed
flagged -> for_review
flagged -> trashed
```

Important behavior:

- `flagged -> for_review` should happen through member resubmission.
- Moderators should not have a "Remove Flag" action that directly returns a thesis to `for_review`.
- Members cannot edit a `for_review` thesis.
- Members can edit only their own `flagged` thesis.
- Admin edits, if implemented later, preserve current status unless the admin explicitly changes status.

## Supabase Data Sources

The backend service layer should assemble frontend-safe DTOs from these tables:

| Data | Supabase Source |
| --- | --- |
| Core thesis metadata | `theses` |
| Authors/advisers | `thesis_authors` using `contribution_role` |
| Tags | `thesis_tags` |
| Primary PDF | `thesis_files` where `is_primary = true` |
| Field comments | `thesis_review_comments` |
| Audit timeline | `thesis_audits` |
| Current user role/ownership | `users` and auth session |

Frontend pages should not query raw Supabase tables directly. They should call
service functions that return DTOs.

## Required Review DTOs

Use camelCase in frontend DTOs. Database rows may remain snake_case.

```ts
type ReviewFieldKey =
  | "title"
  | "authors"
  | "advisers"
  | "department"
  | "study_type"
  | "publication_date"
  | "research_area"
  | "tags"
  | "abstract"
  | "recommendations"
  | "lessons_learned"
  | "pdf_general";

type ReviewComment = {
  id: number;
  thesisId: number;
  fieldKey: ReviewFieldKey;
  comment: string;
  createdByUserId: string;
  createdByName: string;
  createdAt: string;
  addressedAt: string | null;
  addressedByUserId: string | null;
};

type ReviewAuditEventType =
  | "submitted"
  | "comment_added"
  | "comment_addressed"
  | "status_changed"
  | "metadata_edited"
  | "pdf_replaced"
  | "resubmitted";

type ReviewAuditEvent = {
  id: number;
  thesisId: number;
  event: ReviewAuditEventType;
  description: string;
  createdByName: string;
  createdAt: string;
};

type ReviewSubmission = {
  id: number;
  title: string;
  authors: string[];
  advisers: string[];
  department: string;
  studyType: "thesis" | "capstone";
  publicationDate: string;
  researchArea: string | null;
  tags: string[];
  abstract: string;
  recommendations: string | null;
  lessonsLearned: string | null;
  submittedAt: string;
  submittedByUserId: string | null;
  reviewStatus: "for_review" | "flagged" | "accepted" | "trashed";
  primaryFile: {
    fileName: string;
    fileSize: string | null;
    pdfUrl: string;
  } | null;
  fieldComments: ReviewComment[];
  auditEvents: ReviewAuditEvent[];
};
```

The backend should use `addressed_at` for the member action timestamp. Avoid
"resolved" wording because it can imply reviewer approval, which is not the MVP
rule.

## Backend Service Functions The Frontend Should Expect

The final backend implementation may use server actions or route handlers, but
frontend agents should plan around these service-level capabilities.

### Moderator/Admin Review Services

```ts
listReviewSubmissions(params: {
  reviewStatus?: ReviewStatus;
  q?: string;
  page?: number;
  limit?: number;
}): Promise<ServiceResult<ReviewSubmissionListItem[]>>

getReviewSubmission(thesisId: number): Promise<ServiceResult<ReviewSubmission>>

addReviewComment(input: {
  thesisId: number;
  fieldKey: ReviewFieldKey;
  comment: string;
}): Promise<ServiceResult<ReviewComment>>

setReviewStatus(input: {
  thesisId: number;
  nextStatus: "flagged" | "accepted" | "trashed";
}): Promise<ServiceResult<ReviewSubmission>>
```

`setReviewStatus()` should:

- Require `admin` or `moderator`.
- Reject `flagged -> for_review` from the moderator page.
- Insert a `thesis_audits` row.
- Return the updated review submission or enough data for the frontend to refresh.

`addReviewComment()` should:

- Require `admin` or `moderator`.
- Insert into `thesis_review_comments`.
- Insert a `comment_added` audit row.
- Return the created comment.

### Member Submission/Correction Services

```ts
listOwnSubmissions(params?: {
  status?: ReviewStatus | "all";
  q?: string;
}): Promise<ServiceResult<MySubmissionListItem[]>>

getOwnSubmissionForCorrection(thesisId: number): Promise<ServiceResult<ReviewSubmission>>

updateFlaggedSubmission(input: {
  thesisId: number;
  values: Partial<SubmitThesisInput>;
}): Promise<ServiceResult<ReviewSubmission>>

markReviewCommentAddressed(input: {
  thesisId: number;
  commentId: number;
}): Promise<ServiceResult<ReviewComment>>

resubmitFlaggedSubmission(thesisId: number): Promise<ServiceResult<ReviewSubmission>>
```

`listOwnSubmissions()` should:

- Require an authenticated member.
- Return only rows where `submitted_by_user_id = current user id`.
- Include `flaggedCommentCount` or enough data to count flagged submissions.

`getOwnSubmissionForCorrection()` should:

- Require ownership.
- Return a correction DTO only if the thesis is owned by the user.
- Allow editable fields only if `review_status = 'flagged'`.

`updateFlaggedSubmission()` should:

- Require ownership.
- Require `review_status = 'flagged'`.
- Update thesis fields and related authors/tags as needed.
- Keep status as `flagged`.

`markReviewCommentAddressed()` should:

- Require ownership.
- Require `review_status = 'flagged'`.
- Mark the comment as addressed by the member.
- Insert a `comment_addressed` audit row.

`resubmitFlaggedSubmission()` should:

- Require ownership.
- Require `review_status = 'flagged'`.
- Move status to `for_review`.
- Insert a `resubmitted` or `status_changed` audit row.
- Lock member editing after success.

## Moderator Review Page Plan

Target routes after the dashboard pivot:

- `/admin/dashboard?status=for_review`
- `/admin/review/[id]`
- `/admin/all-studies?status=accepted`

The standalone `/admin/review` queue should redirect to the dashboard pending
filter. Do not keep the mock review queue as the primary moderation entrypoint.
Published Studies should not remain a separate admin navigation item; use All
Studies with the approved/`accepted` status filter instead.

Current focused review structure can remain largely intact:

- Dashboard submission queue with status filter.
- Focused detail page.
- Sticky/collapsible review panel.
- Main content area with reviewable fields.
- Comment side panel.
- Decision controls.
- Audit timeline.

Implementation steps for the frontend agent:

1. Source the dashboard submission queue from `listReviewSubmissions()`.
2. Add dashboard status filters for `all`, `for_review`, `flagged`, `accepted`, and `trashed`.
3. Link pending rows to `/admin/review/[id]`.
4. Replace mock detail lookup in `/admin/review/[id]` with `getReviewSubmission(id)`.
5. Keep `ReviewSubmission` as the page DTO, but source it from the service layer.
6. Replace mock `addFieldComment()` with `addReviewComment()`.
7. Replace local status mutation with `setReviewStatus()`.
8. Remove moderator "Remove Flag" / direct `flagged -> for_review` action.
9. Keep `accepted` and `trashed` pages read-only for moderator decisions unless a future admin flow reopens them.
10. Refresh or optimistically update only after the service call succeeds.
11. Keep all file access through `primaryFile.pdfUrl`, which should point to the guarded `/api/theses/:id/file` route or equivalent service-generated route.

UI behavior:

- Pending review queue defaults to `for_review`.
- Comment icon and count appear per field.
- Comment side panel is opened by click/focus; hover-only is not enough.
- `Flag for Revision` should be allowed from `for_review`.
- `Approve` should be allowed from `for_review` and possibly from `flagged` only if the backend allows reviewer approval after rechecking comments.
- `Trash` should be allowed from `for_review` and `flagged`.
- If the submission is already `accepted` or `trashed`, decision controls should be disabled/read-only.

## Member "My Submissions" Plan

Preferred approach:

- Use `/home` layout language and add a "My Submissions" filter/button for authenticated users.
- Do not make this feel like the admin dashboard.
- Keep public browse and owned submissions visually related, but clearly distinguish owned-review states.

Possible route shapes:

- `/home?view=my-submissions`
- `/home?mine=1`
- `/submissions` if routing constraints make query-state awkward

Frontend behavior:

1. When an authenticated member is present, show a "My Submissions" filter/button.
2. If any owned submission is `flagged`, show a badge count equal to the number of flagged owned submissions.
3. Clicking "My Submissions" calls `listOwnSubmissions()`.
4. Owned submission cards show status badges: Pending, Flagged, Approved.
5. Clicking an accepted owned submission may open the normal public detail view.
6. Clicking a `for_review` owned submission opens a read-only owned detail/status view.
7. Clicking a `flagged` owned submission opens the correction view.

Important badge rule:

- Badge count = number of flagged submissions owned by the current member.
- Badge count is not total comments and not total submissions.

## Member Correction View Plan

The correction view should mirror the moderator review page enough that comments
feel connected, but it should be member-oriented and editable.

Possible route shapes:

- `/submissions/[id]/edit`
- `/home/submissions/[id]`
- `/home?view=my-submissions&submission=<id>`

Frontend behavior:

1. Load with `getOwnSubmissionForCorrection(id)`.
2. If status is not `flagged`, render read-only status messaging.
3. If status is `flagged`, render editable fields.
4. Show the same field-level comments beside each reviewable field.
5. Let the member mark a comment/comment group as addressed after editing.
6. Keep addressed comments visible, but visually quiet them.
7. Do not auto-resubmit when comments are addressed.
8. The member must press `Resubmit for Review`.
9. On successful resubmission, show status as Pending / `for_review` and lock editing.

Suggested member-side controls:

- Small check button on each comment or field comment group: "Mark addressed".
- Save changes button for metadata edits.
- Resubmit button once the user is ready.

The frontend should avoid wording like "Resolved" if it implies moderator
approval. Prefer:

- "Marked addressed"
- "Addressed by you"
- "Ready for review"

## Member Editable Fields

For a flagged thesis, members may edit the same content they submitted:

- `title`
- `authors`
- `advisers`
- `department`
- `study_type`
- `publication_date`
- `research_area`
- `tags`
- `abstract`
- `recommendations`
- `lessons_learned`

PDF replacement by members is not part of the minimum final push unless the
backend explicitly exposes it. For MVP, paper-specific feedback can remain in
`pdf_general`.

## Audit Expectations

Audit rows should be visible to reviewers and may be visible to members in a
simplified way.

Recommended event values:

```ts
type ReviewAuditEventType =
  | "submitted"
  | "comment_added"
  | "comment_addressed"
  | "status_changed"
  | "metadata_edited"
  | "pdf_replaced"
  | "resubmitted";
```

Recommended backend direction:

- Add an `event` column to `thesis_audits` if low-risk.
- Keep `change_description` for human-readable copy.
- If an event column is not added, the service layer should map audit rows to
  `ReviewAuditEventType`; UI components should not parse free-form text.

## Frontend States To Plan

Moderator page:

- Loading queue.
- Empty review queue.
- Detail loading.
- Detail not found.
- Add comment pending/error.
- Decision pending/error.
- Accepted/trashed read-only state.

Member page:

- Logged-out state for My Submissions.
- No submissions.
- No flagged submissions.
- Flagged badge count.
- Correction loading.
- Correction forbidden/not owner.
- Correction read-only because status is not `flagged`.
- Save pending/error.
- Mark addressed pending/error.
- Resubmit pending/error.
- Resubmitted success state.

## Minimum Done Criteria For Frontend Planning

The frontend plan is ready when it specifies:

- Which route owns the My Submissions view/filter.
- Which route owns flagged correction.
- Which services each page calls.
- Which DTOs each page expects.
- How moderator comments map to member correction fields.
- How field comments are marked addressed.
- How resubmission moves `flagged -> for_review`.
- How audit events appear in the moderator timeline.
- How loading, empty, forbidden, and error states are displayed.
- Which items are deferred: email, PDF annotation, reviewer PDF upload, admin edit/PDF replacement.

## Human Review Gate

After implementation changes:

- Stop and present changed files.
- Do not run tests, lint, type-checking, builds, browser automation, E2E tests,
  smoke tests, or dev servers.
- Wait for: `Human review approved; run verification.`
- E2E/browser testing requires separate explicit approval.
