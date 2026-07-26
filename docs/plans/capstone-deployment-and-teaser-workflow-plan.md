# Plan: Capstone Deployment Links and Thesis Teaser Thumbnails

**Status:** Ready for human plan review  
**Scope:** Submission, moderator/admin review, member correction, acceptance, and public detail surfaces.

## Product decisions

| Concern | Decision |
| --- | --- |
| Deployment link | Optional, HTTP/S only, and available only to capstones. It complements rather than replaces the publication link. |
| Teaser thumbnail | Optional for every thesis and capstone. Phase one accepts one JPEG, PNG, or WebP image up to 5 MiB. |
| Submission placement | Keep the PDF and thumbnail in one **Submission materials** group, but as separate sibling controls. The thumbnail is not part of the PDF dropzone and is not a full extra wizard step. |
| Public delivery | The accepted thumbnail uses `thesis_teasers_public`; the existing Supabase Storage CDN is sufficient for phase one. No additional CDN is needed. |
| Pre-acceptance visibility | Staging thumbnails remain private and are shown to submitters/reviewers through an authorized application route, never by exposing a staging URL. |
| Reviewability | `deployment_link` and `teaser_thumbnail` are first-class review fields. New reviewable fields must be added across the full field-adoption checklist below. |
| Moderator authority | Moderators/admins can view and comment on both fields. They do not silently replace a member's thumbnail; a thumbnail correction is returned to the member through the normal flagged workflow. |

## Why the upload screen should not merge the two files

The paper PDF is the required primary record. A teaser is optional repository artwork. Combining them inside one dropzone makes their requirements and failure states ambiguous.

Instead, update [`StepUpload`](../../Alexandria/app/upload/_components/steps/step-upload.tsx) into **Submission materials**:

1. **Primary paper** — the existing required PDF card, unchanged in behavior.
2. **Teaser thumbnail (optional)** — a smaller sibling card with an image preview, filename, file size, replace, and remove controls.

Both cards use the same quiet surface, border, and selected-file treatment, so the teaser feels intentionally adjacent rather than suddenly inserted. The thumbnail card should say: “A visual preview for the repository. JPEG, PNG, or WebP; up to 5 MiB.”

The capstone deployment URL belongs in [`StepPublication`](../../Alexandria/app/upload/_components/steps/step-publication.tsx), directly below the publication link. It appears only after selecting **Capstone**, using a short height/opacity transition. Switching back to Thesis clears the local value and shows a brief non-blocking notice; no hidden deployment value is retained.

## Submission contract

The browser continues to submit one `FormData` packet to the authenticated server action. It does not upload directly to the public bucket.

```text
browser form
  -> authenticated server action
     -> validate PDF and optional image
     -> upload PDF to thesis_files_bucket
     -> upload image to thesis_teaser_staging
     -> submit_thesis_transaction(payload with teaser_thumbnail.storage_path)
     -> thesis + primary PDF + optional thesis_media record commit together
```

The submission RPC already accepts the optional thumbnail path and independently verifies its staging bucket, owner, MIME type, and byte size. The client must never submit trusted `mime_type` or `byte_size` values.

### Required application additions

- Add image validation constants and a dedicated `validateTeaserThumbnail` helper beside [`file-validation.ts`](../../Alexandria/lib/upload/file-validation.ts).
- Add staging upload and admin-cleanup helpers beside [`storage-helper.ts`](../../Alexandria/lib/upload/storage-helper.ts). Use UUID-based paths under `uploads/{userId}/...` and a long immutable cache period because replacement always creates a new path.
- Extend `SubmitThesisInput`/`SubmitThesisPayload` with `deployment_link` and an optional thumbnail input. Keep only `storage_path` in the RPC payload.
- Extend [`submission-service.ts`](../../Alexandria/lib/services/submission-service.ts) to remove every newly uploaded object if a later upload or RPC call fails.
- Update the review step to summarize a selected thumbnail and, for capstones, the deployment URL.

No upload occurs until final submit. Leaving the wizard with a selected file therefore creates no orphan. After submit starts, a failed downstream operation cleans up both newly uploaded assets.

## Field-adoption checklist

Every reviewable addition must make all of these changes in the same implementation pass:

| Layer | `deployment_link` | `teaser_thumbnail` |
| --- | --- | --- |
| Database invariant | Capstone-only check and URL validation in submission/admin/member RPCs. | Existing `thesis_media` constraints plus staged object verification. |
| Canonical types | Add to `DbThesis`, submission inputs, `ReviewSubmission`, and public `ThesisDetail` where applicable. | Add a safe `TeaserThumbnail` DTO; do not expose staging paths. |
| Review vocabulary | Add to both `ReviewFieldKey` unions and RPC field-key validation. | Same. |
| Moderator/admin detail | View/comment field; admin may edit a capstone URL. | View/comment thumbnail; replacement stays member-owned. |
| Flagged correction | Editable only while capstone. Historic comments remain visible if study type changes to thesis. | Replace/remove while flagged; successful replacement stamps `member_revised_at` for `teaser_thumbnail` comments. |
| Review comments | Existing comments must never disappear if study type changes. Render a subdued “No longer applicable” deployment field when a historic comment exists. | Existing comments remain attached to the thumbnail field and show revision evidence after replacement. |
| Audit | Existing metadata audit captures the URL change. | Use `metadata_edited` with media-specific details; do not add a new audit-event value without a separate schema decision. |
| Public page | Accepted capstones show “Open deployed system” beside, never instead of, publication. | Accepted records show one optimized teaser image on the detail view; cards/search stay unchanged. |

## Flagged correction and moderation lifecycle

The existing status model remains the source of truth:

```text
for_review -> flagged -> for_review -> accepted
```

### Deployment link

- A moderator can comment on it only for a capstone.
- A flagged member can edit it in the familiar metadata section.
- A real change marks linked comments revised through the existing `update_flagged_submission` mechanism.
- If the member changes the study type to Thesis, the server clears the link. A previous deployment comment remains readable as “no longer applicable,” rather than disappearing.

### Teaser thumbnail

- A moderator sees a protected preview and can attach a `teaser_thumbnail` comment.
- A flagged member sees the same compact teaser card as submission, with replace/remove actions and a clear unsaved state.
- Add a dedicated flagged-thumbnail replacement operation. Do not overload `update_flagged_submission` with file transfer.
- The operation must verify member role, thesis ownership, and `flagged` status; attach the new staged object; stamp revision evidence for existing thumbnail comments; then clean up the old staging object only after the database link succeeds.
- If attaching the new thumbnail fails, remove only the new staged object and leave the prior thumbnail intact.

## Acceptance and publication

`set_review_status` cannot itself copy objects between Storage buckets. Keep Storage writes out of SQL, as required by Supabase Storage guidance.

Use a dedicated server-side acceptance path when a submission has a teaser:

```text
moderator accepts
  -> authorized server service copies staging object to a UUID public path
  -> guarded acceptance RPC confirms the public object and records published_storage_path
  -> status becomes accepted
  -> if the RPC fails, remove the newly copied public object
```

For records without a teaser, retain the existing status transition. The moderator UI should call the dedicated acceptance path only when a teaser exists. The public detail page builds its image URL from `published_storage_path` only after `accepted`; it never receives the staging path.

## UI surfaces

| Surface | Required behavior |
| --- | --- |
| Upload wizard | Submission materials group; capstone-only deployment field; final review summary. |
| Moderator review | Deployment and teaser use `ReviewableField`, so comments follow the existing side-panel pattern. |
| Admin direct edit | Deployment URL is editable only for capstones. Teaser is view/comment-only; return it to the member when replacement is needed. |
| Member correction | Both fields appear in the normal document order, are editable only while flagged, and participate in revision evidence. |
| Accepted public detail | Thumbnail and deployment redirect appear only when present and accepted. Publication action remains independent. |

## Implementation sequence

1. Update TypeScript DTOs, service mappers, review-field unions, and upload schema so all surfaces can carry the new values.
2. Build the upload-side thumbnail validation, staging helper, payload assembly, cleanup behavior, and tactile sibling-card UI.
3. Add moderator/admin/member rendering for deployment and protected staging thumbnail previews.
4. Preflight, review, and apply the flagged-thumbnail replacement and acceptance-promotion SQL/RPCs. The user executes modifying SQL; the assistant runs live preflight and postflight checks.
5. Route acceptance through the promotion service and render public CDN-backed teasers on accepted detail pages.
6. Add focused tests, then stop for human review. Do not run tests, builds, lint, or browser automation until explicit approval under the repository workflow.

## Verification matrix

- Thesis submission: no deployment control; optional teaser attaches successfully.
- Capstone submission: deployment and publication links coexist; optional teaser attaches successfully.
- Invalid image: wrong MIME type, empty image, and over-5-MiB image fail before upload; server rejects mismatched staged objects.
- Submission failure: newly uploaded PDF and teaser are both cleaned up.
- Flagged thumbnail correction: only the owner can replace it; reviewer sees revision evidence; failed replacement retains the old image.
- Acceptance: public path exists before the accepted record exposes the image; failed finalization removes the copied public object.
- Public detail: a thesis never shows a deployment action; an accepted capstone may show publication and deployment actions together.

## Explicit non-goals

- Video teasers or playback.
- Thumbnail display on search cards or changes to search/filter behavior.
- Third-party CDN adoption before actual delivery metrics require it.
- Moderator replacement of a member-owned teaser.
