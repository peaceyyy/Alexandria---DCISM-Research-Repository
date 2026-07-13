# Handoff: Review Feedback Functionality

Date: 2026-07-09
Workspace: Alexandria - DCISM Thesis Repository
Audience: Frontend implementation planner
Related docs:

- `docs/handoffs/2026-07-08-moderator-review-lifecycle.md`
- `docs/DESIGN.md`
- `docs/api-contracts.md`
- `docs/backend-readiness-plan.md`

## Purpose

This document freezes the expected functionality for the moderator/admin review
feedback experience before frontend implementation planning begins.

The goal is to let moderators and admins review submitted theses, leave
field-specific feedback, flag submissions for member correction, and preserve a
clear audit trail without building a full in-browser PDF annotation editor for
the MVP.

## Locked Product Decisions

- Website-side feedback is the MVP source of truth.
- Automated email notifications are deferred.
- Built-in PDF annotation/editing is deferred.
- Moderators cannot directly edit submitted metadata or PDF files.
- Moderators can review, comment, flag, accept, and trash submissions.
- Admins can review, comment, flag, accept, trash, directly edit metadata, and replace the primary PDF.
- Admin direct edits keep the thesis current status unless the admin explicitly changes the status.
- Members can edit their own submission only after it is `flagged`.
- Member resubmission moves the thesis back to `for_review` and locks member editing again.
- Flagged member submissions should be reachable through a home-like "My Submissions" view/filter.
- The "My Submissions" entry point should show a badge count for flagged submissions, not total comments.
- Members may mark individual feedback items as addressed after editing, but this does not equal moderator approval.
- Friendly UI labels may say Pending, Flagged, and Approved, but backend status values remain `for_review`, `flagged`, `accepted`, and `trashed`.

## Review Lifecycle

Use the existing review status contract.

| Backend Status | UI Label | Meaning |
| --- | --- | --- |
| `for_review` | Pending | Submitted and waiting for moderator/admin review. Member editing is locked. |
| `flagged` | Flagged | Returned to the submitter for correction with review comments. Member editing is unlocked. |
| `accepted` | Approved | Approved and publicly visible in the repository. |
| `trashed` | Trashed | Removed from active review and public surfaces. |

Allowed MVP transitions:

```text
for_review -> accepted
for_review -> flagged
for_review -> trashed
flagged -> for_review
flagged -> trashed
```

## Field-Level Feedback

Field-level comments should be stored separately from audit rows. Audit rows
record major history. Field comments record what the submitter needs to fix.

Every reviewable field can be flagged:

| Field Key | UI Meaning |
| --- | --- |
| `title` | Thesis/capstone title |
| `authors` | Author list |
| `advisers` | Adviser list |
| `department` | Department |
| `study_type` | Thesis or capstone |
| `publication_date` | Publication/conference date |
| `research_area` | Research area |
| `tags` | Tags/keywords |
| `abstract` | Research abstract |
| `recommendations` | Recommendations for future researchers |
| `lessons_learned` | Lessons learned |
| `pdf_general` | General PDF/paper-specific feedback |

Recommended frontend-facing comment shape:

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
  thesis_id: number;
  field_key: ReviewFieldKey;
  comment: string;
  created_by_user_id: string;
  created_by_name: string;
  created_at: string;
  resolved_at: string | null;
};
```

Resolution / addressed behavior for MVP:

- Members may press a small check-style control to mark a comment as addressed
  after making the corresponding edit.
- Member-side "addressed" means "I believe I handled this feedback"; it does
  not approve the thesis and does not remove reviewer authority.
- Moderators/admins do not need per-comment resolve controls for MVP.
- Comments can remain reviewer-visible until a moderator/admin accepts the
  submission or flags it again.
- A later version may add stricter `resolved_at` / reviewer-confirmed behavior.

## Audit Trail

`thesis_audits` should remain the source of major history, not the source of
field-level feedback.

Recommended audit events:

| Event | Example Description |
| --- | --- |
| Review comment added | `Moderator added feedback on Abstract.` |
| Review comment addressed | `Member marked feedback on Abstract as addressed.` |
| Status changed to flagged | `Submission flagged for member revision.` |
| Status changed to accepted | `Submission approved for publication.` |
| Status changed to trashed | `Submission moved to trash.` |
| Member resubmitted | `Member resubmitted the flagged thesis for review.` |
| Admin edited metadata | `Admin updated thesis metadata while preserving current status.` |
| Admin replaced PDF | `Admin replaced the primary PDF attachment.` |

The audit UI can be a compact history list. It does not need the full text of
every field comment if field comments already appear beside their fields.

Recommended audit schema direction:

- Add a small `event` field for new audit rows if it is faster and low-risk.
- Keep `change_description` as the human-readable timeline text.
- If adding `event` is too risky for the final push, derive the frontend event
  type in the service layer from a small internal mapping rather than exposing
  raw free-form text parsing throughout the UI.

## Moderator Review Experience

The moderator review page should support:

- Review queue filtered to `for_review` by default.
- Detail page for one submitted thesis.
- All reviewable fields visible, including tags and adviser information.
- PDF preview/open behavior using the existing guarded file route or file-access contract.
- Field-level comment icon and count for every reviewable field.
- Add comment flow for each field.
- General PDF feedback through `pdf_general`.
- Flag action that returns the thesis to the member for correction.
- Accept action that approves the thesis.
- Trash action for invalid, duplicate, spam, or unusable submissions.

Moderator restrictions:

- No direct field edits.
- No direct PDF replacement.
- No manual status wording outside the canonical mappings.

## Admin Review Experience

Admins should have all moderator review capabilities plus:

- Edit submitted metadata directly.
- Replace the primary PDF attachment.
- Keep the current status when editing fields or replacing the PDF, unless the admin explicitly changes status.
- Write audit rows for direct metadata edits and PDF replacement.

Admin direct editing should be visually distinct from moderator comment-only
review so the user understands why controls differ by role.

## Member Revision Experience

When a submission is `flagged`, the submitting member should see:

- A home-like submissions list or filter showing only their own submissions.
- A flagged-submission badge count near the "My Submissions" filter or button.
- The thesis fields they can edit.
- Review comments attached to the relevant fields.
- A visible correction summary or count.
- General PDF feedback if present.
- A small check-style addressed control beside each comment or comment group.
- A resubmit action.

Member restrictions:

- Editing is allowed only while the thesis is `flagged`.
- Marking a comment as addressed is allowed only while the thesis is `flagged`.
- Addressing all comments should not automatically resubmit the thesis.
- Resubmitting moves the thesis to `for_review`.
- After resubmission, the fields lock again.
- Members cannot approve, trash, or change review status directly.

Preferred entry point:

- Use the `/home` layout language for a "My Submissions" filtered view rather
  than forcing a separate-feeling admin-style page.
- Authenticated members should be able to toggle from public repository results
  to their own submissions.
- If any owned submission is `flagged`, the filter/button should display a
  count of flagged submissions.
- Selecting a flagged submission should open a correction view, not the public
  read-only thesis detail view.

## PDF Feedback Boundary

Do not build an in-browser PDF annotation editor for MVP.

MVP behavior:

- Reviewers can preview/open the submitted PDF.
- Reviewers can leave paper-specific notes in the `pdf_general` comment field.
- If a reviewer manually annotates a PDF outside Alexandria, sending it by email remains an acceptable temporary workaround.

Deferred behavior:

- Uploading reviewer-annotated PDFs into Supabase.
- Displaying multiple reviewer attachments.
- Page-coordinate PDF annotations.
- Inline PDF highlight/comment rendering.

If reviewer PDF uploads are added later, use a separate attachment model rather
than overloading the primary thesis file:

```text
thesis_review_attachments
- id
- thesis_id
- uploaded_by_user_id
- storage_path
- file_type
- note
- created_at
```

Possible storage path:

```text
review-attachments/<thesis_id>/<reviewer_id>/<uuid>.pdf
```

The submitter does not need to be duplicated on the attachment row because it
can be derived from `theses.submitted_by_user_id`.

## Frontend Interaction Pattern

Use a Notion-style field comment affordance adapted to Alexandria's design
language.

For fields with comments:

- Keep the field container dark and restrained.
- Add a subtle blue/cyan edge, glow, or outline.
- Show a small comment icon near the field label or right edge.
- Show a compact count if multiple comments exist.
- On hover or focus, open a floating comment preview.
- On click, pin or open the full comment panel.

For fields without comments:

- Do not visually clutter the page.
- Show the comment affordance on hover/focus if the current role can comment.

Accessibility requirements:

- Hover must not be the only way to read comments.
- The icon must be keyboard reachable.
- Clicking or pressing Enter/Space should open the comment popover or panel.
- The floating panel should not obscure the field in a way that prevents reading.

## Visual Rules

Follow `docs/DESIGN.md` as the visual source of truth.

- Use dark charcoal surfaces based on `#14181C`.
- Use Inter for functional UI.
- Keep panels compact and archive-like.
- Use thin borders and restrained elevation.
- Use `#1752F0`, `#368BFE`, or `#1DA0C9` for comment/focus accents.
- Avoid large warning fills, heavy yellow highlights, or full-field bright overlays.
- Keep annotation styling closer to "quiet review note" than "form error."
- Use accessible production text sizes even if mockups use smaller Figma microtype.

## Expected Frontend Components

Recommended components for the frontend plan:

- `ReviewSubmissionList`
- `ReviewSubmissionDetail`
- `ReviewableField`
- `ReviewCommentIcon`
- `ReviewCommentPopover`
- `ReviewCommentPanel`
- `ReviewDecisionActions`
- `ReviewAuditTimeline`
- `MemberFlaggedSubmissionEditor`
- `MySubmissionsFilter`
- `MySubmissionCorrectionView`
- `AdminSubmissionEditor`
- `PdfGeneralFeedbackField`

## Done When

The frontend implementation plan should be considered complete when it covers:

- Moderator queue behavior.
- Moderator detail page behavior.
- Field-level comment display and authoring.
- Member "My Submissions" entry point with flagged-submission count.
- Member flagged-edit and resubmission behavior.
- Member-side comment addressed controls.
- Admin direct-edit behavior.
- Audit timeline display.
- PDF feedback MVP boundary.
- Role-specific permissions in the UI.
- Design alignment with `docs/DESIGN.md`.
- Human review gate before verification.
