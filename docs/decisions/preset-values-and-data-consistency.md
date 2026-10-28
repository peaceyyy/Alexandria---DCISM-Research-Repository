# Preset Values and Data Consistency Guide

Last updated: 2026-07-16

Status: implemented policy source of truth.

## Purpose

Alexandria currently has several metadata values repeated across upload forms, browse filters, admin mock data, review pages, services, and project documentation. Some of those repeated values disagree with each other.

This guide organizes the agreed preset values so future implementation can remove inconsistencies without guessing at the intended product vocabulary.

## Consistency Rules

1. Store canonical values and display the same clear, controlled labels.
   - Example: store and display `CS`, `IT`, or `IS`.

2. Keep the DCISM repository scope separate from its program classifications.
   - Alexandria is for DCISM work; `CS`, `IT`, and `IS` classify each submitted record.

3. Use one preset source in code.
   - Upload forms, browse filters, admin pages, review pages, mock data, and seed data should consume the same preset source.

4. Keep broad categories separate from tags.
   - Research areas are curated, reusable filters.
   - Tags are flexible keywords contributed per thesis.

5. Keep required/optional rules consistent across upload, review, detail, docs, and backend contracts.
   - If a field is required during upload, it should also appear in review/approval surfaces.
   - If a field is optional in the database contract, the upload form should not silently make it mandatory unless that is an intentional product decision.

## Canonical Preset Families

### Department

Meaning: the DCISM academic program classification for a thesis/capstone record.

MVP decision:

Alexandria is a DCISM repository. For this MVP, the only enabled, valid, and submitted department values are `CS`, `IT`, and `IS`.

MVP canonical value:

| Stored value | Display label | Notes |
| --- | --- | --- |
| `CS` | CS | Computer Science |
| `IT` | IT | Information Technology |
| `IS` | IS | Information Systems |

Department UI rule:

| UI location | Expected treatment |
| --- | --- |
| Upload, correction, and admin edit forms | Select only `CS`, `IT`, or `IS`. |
| Browse and dashboard filters | Offer only `CS`, `IT`, and `IS`. Do not derive choices from stored rows. |
| Review and detail pages | Display the stored code. |
| Legacy data | Remove records holding other values manually in Supabase. No automated migration is planned. |

Invalid department values:

| Invalid value | Why invalid | Recommended handling |
| --- | --- | --- |
| `BSCS` | Legacy course code | Remove or manually correct to `CS`. |
| `BSIT` | Legacy course code | Remove or manually correct to `IT`. |
| `BSIS` | Legacy course code | Remove or manually correct to `IS`. |
| `Computer Science` | Legacy display label | Remove or manually correct to `CS`. |
| `Information Technology` | Legacy display label | Remove or manually correct to `IT`. |
| `Information Systems` | Legacy display label | Remove or manually correct to `IS`. |

Candidate future department values needing official codes/names:

| Candidate | Open decision |
| --- | --- |
| `CpE` | Future-only. Confirm official department name and storage code before enabling. |
| `CE` | Future-only. Confirm official department name and storage code before enabling. |
| `Biology` | Future-only. Confirm official department name and storage code before enabling. |
| `Psychology` | Future-only. Confirm official department name and storage code before enabling. |

Known current drift:

| Location | Current value shape | Problem |
| --- | --- | --- |
| Submission, correction, admin, and staff dashboard filters | `CS`, `IT`, `IS` | Uses the shared controlled vocabulary. |
| Public filter service | `CS`, `IT`, `IS` | Returns the controlled vocabulary rather than values found in stored rows. |
| Legacy Supabase rows | Older department values | Must be cleared manually before relying on department reporting. |

### Research Area

Meaning: a broad research domain used for discovery, filtering, and related-thesis matching. Research area values should be curated. Tags remain flexible.

MVP canonical taxonomy:

| Stored ID | Display label |
| --- | --- |
| `ai_engineering` | AI Engineering |
| `machine_learning` | Machine Learning |
| `web_development` | Web Development |
| `mobile_development` | Mobile Development |
| `cybersecurity` | Cybersecurity |
| `iot` | IoT |
| `data_science` | Data Science |
| `networking` | Networking |
| `algorithms` | Algorithms |
| `mathematics` | Mathematics |

Storage and UI rule:

- A study may have more than one research area.
- `theses.research_area` remains a nullable text column for MVP and stores canonical IDs joined by commas, for example `web_development,algorithms`.
- Never store display labels, free text, or numeric array indices. The client parses this deterministic value into an array and displays labels.
- Upload, member correction, and admin correction surfaces must use the shared controlled multi-select.
- The `theses_research_area_ids_check` constraint rejects unrecognized IDs. New areas require a deliberate code and database migration.

Legacy cleanup performed by the normalization migration:

| Existing value | Canonical stored value |
| --- | --- |
| `Artificial Intelligence` | `ai_engineering` |
| `Web Development, Algorithms` | `web_development,algorithms` |
| `IoT` | `iot` |
| `Networking` | `networking` |
| `Web Development, Algorithms, hello, i just chaged it` | `web_development,algorithms` |

Tags remain flexible contributor keywords. They are not a staff-dashboard search scope in the current UI; the retained backend tag-search RPC is future capability, not a current product control.

### Study Type

Meaning: what kind of academic work the record represents.

| Stored value | Display label |
| --- | --- |
| `thesis` | Thesis |
| `capstone` | Capstone |

Rule: do not use "research", "paper", or "project" as stored study type values unless a future product decision expands the enum.

### Project Progress, Approval, and Publication Metadata

Project progress is not a tag and is not the review status. It applies to both
theses and capstones.

| Field | Meaning | Rule |
| --- | --- | --- |
| `project_progress` | Academic progress of the thesis or capstone | `in_progress` or `completed`. The UI label is **Progress**. |
| `proposal_approved_on` | Date on which the Thesis 1 proposal/document was approved | Required for both progress values. It is the single required academic milestone date. |
| `publication_date` | Date the completed work was presented or formally published | Required only when `project_progress = completed`. |
| `publication_link` | Public URL to proceedings, journal, repository, or official publication | Required only when `project_progress = completed`. |
| `conference` | Conference, symposium, event, or venue where the completed work was presented | Required only when `project_progress = completed`. |

An `in_progress` record represents work from a student who has passed Thesis 1:
the proposal and methodology document may be shared, while results, analysis,
and conclusion are still being completed. A `completed` record must have its
final PDF plus the verified conference/venue and publication link.

Publication date display rule:

| Surface | Expected treatment |
| --- | --- |
| Upload form | Ask for a proposal approval date for every record. Ask for the publication/presentation date only when Progress is Completed. |
| Upload review step | Show the proposal approval date for every record and publication metadata only for completed records. |
| Public thesis detail page | Show month and year with publication metadata. |
| Moderator review/approval detail page | Show month and year as the reviewable publication date. |
| Homepage/repository cards | Show year only, e.g. `2026`, when compact metadata is preferred. |
| Backend/service contract | Preserve month/year meaning even if the storage layer later uses a date-shaped column internally. |

Conference display rule:

If `conference` exists or is required, it should be visible anywhere full thesis metadata is reviewed:

| Surface | Expected treatment |
| --- | --- |
| Upload publication step | Input field. Already present. |
| Upload review step | Summary row. Already present. |
| Public thesis detail page | Display with publication metadata. Currently missing in the mock-driven detail page. |
| Moderator review/approval detail page | Display as a reviewable metadata field. Currently missing from review field keys and review detail metadata. |
| Admin all-studies/published detail pages | Display with other metadata if available. |
| API/service DTOs | Include in thesis detail and review-submission shapes if moderators need to approve it. |

Completed-record rule: `conference`, `publication_link`, and `publication_date`
are prerequisites for marking a record Completed. Moderators and administrators
verify these values during review. They remain optional while Progress is Work in
progress.

### Review Status

Stored values and labels are already mostly consistent:

| Stored value | Display label |
| --- | --- |
| `for_review` | Pending |
| `flagged` | Flagged |
| `accepted` | Approved |
| `trashed` | Trashed |

Rule: store status keys, not labels. Labels can change without data migration.

Review status must never be used as the academic-progress field. A work in
progress record can be visible to approved DCISM community accounts while still
using the normal review workflow.

### User Role and Affiliation

These are not the main inconsistency reported here, but they are existing presets and should remain centralized with the same pattern.

Roles:

| Stored value | Display label |
| --- | --- |
| `admin` | Admin |
| `moderator` | Moderator |
| `member` | Member |

Affiliations:

| Stored value | Display label |
| --- | --- |
| `student` | Student |
| `alumni` | Alumni |
| `professor` | Professor |

## Implementation Guidance For Later

Do not implement this yet unless the human review gate is cleared.

When implementation begins, prefer this order:

1. Approve this document and answer the open decisions below.
2. Update product/backend docs so they no longer contradict the approved preset rules.
3. Create or choose one code source for presets.
   - Candidate: move shared constants into `Alexandria/lib/constants/presets.ts`.
   - Keep validation schemas importing from that source instead of defining separate lists.
4. Replace hardcoded department/research-area arrays in browse filters, detail pages, upload pages, admin pages, mock data, and seed data.
5. Add `conference` to review/detail surfaces if approved as part of required metadata.
6. Only after human review approval, run the appropriate verification requested by the user.

## Open Questions

1. What are the official stored codes and display names for the future departments: CpE, CE, Biology, and Psychology?
2. Should BSCS, BSIT, and BSIS become a separate `program` or `course` field later, or should Alexandria avoid storing them entirely for the MVP?
3. Confirm the final date display format for `proposal_approved_on` and `publication_date`.
4. Confirm the implementation path for the approved DCISM roster and later alumni access.
