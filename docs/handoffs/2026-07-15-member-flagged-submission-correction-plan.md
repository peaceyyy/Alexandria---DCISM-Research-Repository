# Plan: Member Flagged-Submission Correction Flow

Date: 2026-07-15
Status: READY FOR HUMAN PLAN REVIEW
Scope: A thesis owner corrects a flagged submission, acknowledges field-level
feedback without hiding it, reattaches a corrected primary PDF when needed,
and resubmits the thesis for moderator/admin review.

## 1. Purpose

Make the flagged-submission loop feel like a calm, document-oriented revision
experience instead of a generic form. A member should immediately understand
what feedback exists, what they have changed, which comments they have
acknowledged, and that resubmission does not itself mean approval.

This plan completes the member-facing side of the existing review lifecycle:

```text
for_review -- moderator/admin flags --> flagged
flagged -- member saves corrections --> flagged
flagged -- member resubmits --> for_review
for_review -- moderator/admin accepts --> accepted
```

The previously approved moderator correction path remains separate:

```text
accepted -- moderator/admin sends back --> for_review
```

## 2. Locked Product Decisions

| Area | Decision |
| --- | --- |
| Entry point | A flagged card in `/home?mine=1` opens a dedicated correction route, never the public thesis detail page. |
| Edit access | Only the submitting member may edit, and only while `review_status = flagged`. All thesis metadata fields are editable, not only fields with feedback. |
| Comment visibility | Every moderator/admin comment remains visible to both the member and reviewer after acknowledgement and resubmission. Comments are never retired or deleted by this flow. |
| Evidence of revision | Saving a real change to a field records that each pre-existing comment on that field has been revised after feedback. This is separate from acknowledgement. |
| Member acknowledgement | A per-comment `Mark as addressed` control is enabled only after its field has been saved with a real revision. It records the member's acknowledgement without hiding the comment. |
| Comment immutability | No user may edit or delete a posted review comment. Remove the currently dormant edit/delete controls from the shared comment panel instead of adding unsupported backend mutations. |
| PDF correction | While flagged, the member may reattach a corrected primary PDF. It uses existing PDF validation and keeps the prior file metadata rather than overwriting history. |
| Published-study corrections | Annotated-PDF correction for an already accepted/public study remains an email workflow and is out of scope here. |
| Resubmission | The member may resubmit at any time while flagged. A confirmation dialog lists unacknowledged comments but does not block resubmission. |
| After resubmission | Status becomes `for_review`; correction editing and acknowledgement controls lock immediately. |

## 3. Current-State Gaps

| Existing behavior | Required change |
| --- | --- |
| `/home?mine=1` shows a flagged-submission count and comment count. Non-accepted cards intentionally have no link. | Route flagged cards into a member correction workspace. |
| `updateFlaggedSubmission` already accepts the metadata, author, tag, and written-content fields while the member owns a flagged thesis. | Provide a correction UI that exposes those fields together and reports the revised fields back to comment state. |
| `mark_review_comment_addressed` sets `addressed_at`, and list counts treat that comment as no longer open. | Keep this acknowledgement but display acknowledged comments everywhere. Add explicit field-revised evidence instead of treating acknowledgement as proof of an edit. |
| The shared comment panel contains edit/delete UI hooks, but the database contract has no safe comment-edit or comment-delete RPC. | Make the shared comment UI immutable for every role. |
| The member correction service has no primary-PDF replacement operation. | Add a flagged-owner PDF reattachment path with server validation, storage cleanup on failure, file history, and audit history. |

## 4. UX Blueprint

### 4.1 Entry and orientation

1. An authenticated user opens **My Submissions** from `/home`.
2. A flagged card carries a compact flagged status and moderator-comment count.
3. Selecting that card opens `/submissions/[thesisId]/corrections`.
4. The correction page rejects every other state with a clear locked/not-found
   state; it must not expose a public or another member's record.

### 4.2 Correction workspace

Use the review page's information architecture, but make the main document
editable and remove moderator-only decision controls.

- Left, sticky rail: status, correction summary, save state, audit timeline,
  Back to My Submissions, and the final resubmit action.
- Main document: all thesis fields grouped in the upload flow's familiar order:
  basics, publication, people, abstract/classification, insights, and PDF.
- Field affordances: the same restrained comment icon and count used in review.
  Comments remain keyboard-accessible and open in the side panel.
- Comment states in the side panel:
  - `Needs attention`: no saved revision after that feedback.
  - `Field revised`: the owner saved a real change to the linked field after
    the comment was created.
  - `Marked addressed`: the owner intentionally acknowledged that comment
    after its field was revised. The full comment remains readable.
- Save behavior: a visible `Save changes` command persists the edited fields.
  Do not use silent blur autosave; the member needs a clear success/failure
  boundary before acknowledgement becomes available.
- Resubmit behavior: confirmation dialog states that the thesis returns to
  pending review, summarizes acknowledged and unacknowledged comments, and
  allows the member to continue either way.

Use the established Alexandria charcoal surfaces, thin borders, Inter UI text,
and blue/cyan comment accents. Revision states should use small labels and
icons, never full-field warning fills or noisy highlighting.

## 5. Data and Service Contract

### 5.1 Review-comment evidence

Keep the existing immutable comment text and acknowledgement columns. Add a
timestamp such as `member_revised_at timestamptz null` to
`thesis_review_comments`.

Semantics:

- `member_revised_at`: set by the database when the owner saves a real change
  to the comment's target field while the thesis is flagged. It is evidence,
  not a claim.
- `addressed_at` and `addressed_by_user_id`: retain their existing storage
  shape, but interpret them in this UX as the owner's acknowledgement. They do
  not remove the comment from reviewer detail views.
- Acknowledge RPC: reject acknowledgement unless `member_revised_at` is set for
  that exact comment. Preserve ownership and `flagged` checks.
- A new review comment starts with both timestamps null. A later revision only
  affects comments that already existed for that field.

The `update_flagged_submission` RPC must compare submitted values with the
locked thesis record and identify changed review field keys. It must only stamp
`member_revised_at` for fields that truly changed; including an unchanged value
in a client payload is not sufficient evidence. Text, authors/advisers, and
tags need normalized comparisons before the thesis write is finalized.

### 5.2 Primary-PDF reattachment

Add a member-owned flagged-submission replacement operation rather than
reusing the initial submission transaction wholesale.

1. Server-side upload validation keeps the existing PDF-only, size, and file
   signature requirements.
2. The upload helper stores the new object under the owner-scoped thesis file
   convention.
3. A role/ownership/status-checked RPC demotes the prior primary file, writes
   metadata for the new primary file, and records a `pdf_replaced` audit event.
4. If the metadata/RPC step fails, remove the newly uploaded object so storage
   does not accumulate orphaned files.
5. When a `pdf_general` comment exists, saving the replacement marks its
   related comment(s) as `member_revised_at` evidence just as metadata edits do.

### 5.3 Frontend DTOs

Extend the canonical `ReviewComment` shape in the service and component layers
with `memberRevisedAt`. Keep `addressedAt` and `addressedByUserId` intact.

Add a correction-summary shape derived from all comments:

```ts
type CorrectionSummary = {
  totalComments: number;
  revisedCommentCount: number;
  acknowledgedCommentCount: number;
  unacknowledgedCommentCount: number;
};
```

The summary is informational only; it is not a transition guard.

## 6. Implementation Plan

### Phase 1: Freeze contracts and database behavior

1. Update `docs/sql/review_feedback_backend.sql` with the revision-evidence
   column, compatible indexes, and comments documenting the new semantics.
2. Update `update_flagged_submission` to calculate true changed field keys in
   its transaction, then stamp only matching pre-existing review comments.
3. Update `mark_review_comment_addressed` to require revision evidence while
   retaining the current ownership and flagged-status checks.
4. Add the flagged-owner primary-PDF reattachment RPC, audit event, grants,
   and RLS-compatible data mutations.
5. Preserve the status contract: only `resubmit_flagged_submission` moves the
   thesis from `flagged` to `for_review`.

### Phase 2: Service-layer contracts

1. Extend `ReviewComment`, review DTO mapping, and comment-count helpers with
   revision evidence and the correction summary.
2. Keep `getOwnSubmissionForCorrection` owner-scoped; do not reuse public
   thesis detail loading for the correction route.
3. Update `updateFlaggedSubmission` and `markReviewCommentAddressed` result
   handling to refresh the full correction DTO after success.
4. Add a server-only `replaceFlaggedSubmissionPdf` service using existing
   upload validation and guaranteed cleanup on downstream failure.
5. Remove service/API assumptions for comment edit or delete. Do not add such
   mutations.

### Phase 3: My Submissions entry point

1. Make flagged cards from `/home?mine=1` link to
   `/submissions/[thesisId]/corrections`.
2. Keep accepted cards linked to the public detail page.
3. Keep pending and trashed records non-editable; they should never route into
   the correction workspace.
4. Retain the flagged-submission badge and add clear accessible labels that
   identify a card as requiring revision.

### Phase 4: Member correction experience

1. Create a server route that loads `getOwnSubmissionForCorrection` and a
   client correction workspace with only member-safe actions.
2. Reuse field grouping and validation rules from the upload flow while
   pre-populating every editable thesis value.
3. Reuse `ReviewableField` and the comment-side panel for field targeting, but
   make the panel read-only for comments and add correction-state indicators.
4. Add explicit save, PDF reattachment, acknowledgement, error, loading, and
   unsaved-change states.
5. After each save, refresh comment evidence so `Mark as addressed` only
   becomes available for comments whose fields were actually revised.
6. Add the resubmission confirmation dialog with its non-blocking comment
   summary and lock the workspace after a successful transition.

### Phase 5: Moderator/admin review continuity

1. Update the existing review detail to show all comments, including
   acknowledged ones.
2. Surface `Field revised` and `Marked addressed` indicators beside each
   comment and in the correction summary when the thesis re-enters
   `for_review`.
3. Remove edit/delete controls from the shared comment panel so UI behavior
   matches the immutable database contract.
4. Keep moderator/admin actions unchanged: comment, flag, approve, trash, and
   the already-planned approval correction path.

### Phase 6: Review and deployment handoff

1. Add focused tests for comment-evidence stamping, acknowledgement guards,
   owner/status checks, PDF reattachment cleanup, and resubmission behavior.
2. Add component coverage for correction state labels, disabled acknowledgement
   before a field save, and the non-blocking resubmit confirmation.
3. Prepare a Supabase deployment checklist for the review-feedback SQL. The
   active project must receive this SQL before the UI can use the added RPCs.
4. Stop after implementation for the repository's human review gate. Do not
   execute tests, lint, builds, local servers, or browser automation until the
   required verification approval is given; browser/E2E work needs its own
   explicit approval.

## 7. Acceptance Criteria

- [ ] A member sees a flagged indicator from My Submissions and reaches only
  their own flagged correction workspace.
- [ ] Every editable thesis field, including the primary PDF reattachment
  control, is available while flagged and locked otherwise.
- [ ] Review comments remain visible after acknowledgement and resubmission.
- [ ] A member cannot acknowledge a comment until the linked field has been
  saved with a real change after that comment was posted.
- [ ] A moderator/admin can distinguish field revision evidence from the
  member's acknowledgement.
- [ ] The member can resubmit with remaining comments, after a clear
  confirmation dialog.
- [ ] Resubmission changes the status to `for_review` and disables member
  editing immediately.
- [ ] No comment edit or delete control is exposed to any role.
- [ ] Failed PDF reattachment does not leave a new orphaned storage object.
- [ ] The live Supabase project has the reviewed SQL deployed before UI
  verification begins.

## 8. Explicit Non-Goals

- Editing or deleting review comments.
- Moderator/admin confirmation that a member's acknowledgement is correct.
- Automatic approval after all comments are acknowledged.
- In-browser PDF annotation or page-coordinate feedback.
- Uploading moderator-annotated PDFs for accepted/public studies.
- Reopening a flagged correction workspace after the member resubmits.

