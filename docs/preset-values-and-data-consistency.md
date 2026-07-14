# Preset Values and Data Consistency Guide

Last updated: 2026-07-14

Status: planning source of truth. This document does not implement any app changes yet.

## Purpose

Alexandria currently has several metadata values repeated across upload forms, browse filters, admin mock data, review pages, services, and project documentation. Some of those repeated values disagree with each other.

This guide organizes the agreed preset values so future implementation can remove inconsistencies without guessing at the intended product vocabulary.

## Consistency Rules

1. Store canonical values, display friendly labels.
   - Example: store `DCISM`; display `DCISM` or `Department of Computer Information Science and Mathematics` depending on screen density.

2. Do not use courses or programs as departments.
   - `BSCS`, `BSIT`, `BSIS`, `Computer Science`, `Information Technology`, and `Information Systems` are not department values for Alexandria metadata.

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

Meaning: the academic department or unit responsible for the thesis/capstone record.

MVP decision:

Alexandria is DCISM-only for now. The UI may be designed to look expandable so users understand that other departments could be supported later, but `DCISM` is the only enabled, valid, and submitted department value in the MVP.

MVP canonical value:

| Stored value | Display label | Notes |
| --- | --- | --- |
| `DCISM` | DCISM | Department of Computer Information Science and Mathematics. Current Alexandria MVP owner. |

Department UI rule:

| UI location | Expected treatment |
| --- | --- |
| Upload form | Show a department select/control with `DCISM` selected by default. Do not allow submitting any other value yet. |
| Browse filters | Show `DCISM` as the active department filter option. The control may be styled as if the filter group can grow later. |
| Admin/review/detail pages | Display the stored department as `DCISM`. |
| Future-looking empty/disabled states | If shown, mark other department choices as unavailable or future support, not as selectable values. |

Invalid department values:

| Invalid value | Why invalid | Recommended handling |
| --- | --- | --- |
| `BSCS` | Course/program, not department | Map to `DCISM` if record belongs to DCISM. |
| `BSIT` | Course/program, not department | Map to `DCISM` if record belongs to DCISM. |
| `BSIS` | Course/program, not department | Map to `DCISM` if record belongs to DCISM. |
| `Computer Science` | Course/program area, not department | Map to `DCISM` or move to a future `program` field. |
| `Information Technology` | Course/program area, not department | Map to `DCISM` or move to a future `program` field. |
| `Information Systems` | Course/program area, not department | Map to `DCISM` or move to a future `program` field. |

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
| `Alexandria/lib/upload/schema.ts` | `DCISM`, `CAS`, `TC` | Includes non-confirmed department codes and omits user-mentioned candidates. |
| `Alexandria/components/layout/filter-sidebar.tsx` | `Computer Science`, `Information Technology`, `Information Systems` | Uses program/course-like labels as departments. |
| `Alexandria/lib/mock-data/theses.ts` | `Computer Science`, `Information Technology`, `Information Systems` | Mock records teach the wrong department vocabulary. |
| `Alexandria/components/admin/mock-data.ts` | `BSCS`, `BSIT`, `BSIS` | Admin/review mock records use course codes as departments. |
| `docs/api-contracts.md` | `DCISM`, `CAS`, `TC` | Contract examples do not match the clarified department rule. |

### Research Area

Meaning: a broad research domain used for discovery, filtering, and related-thesis matching. Research area values should be curated. Tags remain flexible.

Current proposed canonical list from the upload schema:

| Stored/display value | Notes |
| --- | --- |
| `AI / Machine Learning` | Prefer this over `AI / ML` for clarity. |
| `Web Development` | Current upload preset. |
| `Mobile Development` | Current upload preset. |
| `Cybersecurity` | Current upload preset. |
| `IoT` | Current upload preset. |
| `Data Science` | Current upload preset. |
| `Networking` | Present in upload schema; needs product confirmation. |
| `Algorithms` | Current upload preset. |
| `Mathematics` | Current upload preset. |

Aliases and cleanup targets:

| Existing value | Recommended action |
| --- | --- |
| `AI / ML` | Replace with `AI / Machine Learning`. |
| `Computer Vision` | Decide whether to add as its own research area or map under `AI / Machine Learning`. |
| `Software Engineering` | Decide whether to add as its own research area or map under `Web Development` or a future `Software Engineering` preset. |
| `Wireless Network` / wireless communication tags | Keep as tags unless the thesis is broadly classified as `Networking`. |

Known current drift:

| Location | Current value shape | Problem |
| --- | --- | --- |
| `docs/Alexandria PRD.md` | Both "free text" and "controlled values" | Product docs contradict themselves. |
| `docs/database-engineer-reference.md` | Free text in DB, frontend-controlled dropdown | This is workable, but must be documented as a deliberate DB-flexible/UI-controlled pattern. |
| `Alexandria/lib/upload/schema.ts` | Controlled list | Good candidate for the initial preset source. |
| `Alexandria/components/layout/filter-sidebar.tsx` | Separate hardcoded list with `AI / ML` | Drift from upload schema. |
| `Alexandria/lib/mock-data/theses.ts` | `AI / ML` and other hardcoded values | Drift from upload schema. |
| `Alexandria/components/admin/mock-data.ts` | `Software Engineering`, `Computer Vision` | Values appear in admin/review data but not upload schema. |

Important modeling decision:

The upload UI currently allows multiple research areas, but the service/database contract stores a singular `research_area` text value. Before implementation, decide whether Alexandria should support:

| Option | Effect |
| --- | --- |
| Single research area per thesis | Keep `research_area` as one text value and make upload single-select. |
| Multiple research areas per thesis | Add a proper multi-value contract instead of joining values into one string. |

### Study Type

Meaning: what kind of academic work the record represents.

| Stored value | Display label |
| --- | --- |
| `thesis` | Thesis |
| `capstone` | Capstone |

Rule: do not use "research", "paper", or "project" as stored study type values unless a future product decision expands the enum.

### Publication and Conference Metadata

Current fields:

| Field | Meaning | Current consistency issue |
| --- | --- | --- |
| `publication_date` | Month and year formally presented or published | Current upload schema uses a full date-shaped field, but the product only needs month/year. |
| `publication_link` | Public URL to proceedings, journal, repository, or official publication | Required in current upload schema, but may not exist for every thesis. |
| `conference` | Conference, symposium, event, or venue where the work was presented | Required in current upload schema, optional in older docs/database notes, and missing from some detail/review surfaces. |

Publication date display rule:

| Surface | Expected treatment |
| --- | --- |
| Upload form | Ask for month and year only. Do not ask users for a day. |
| Upload review step | Show month and year, e.g. `June 2026`. |
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

Open decision:

Decide whether `conference` is required for every submission. If not every thesis has a conference, make it optional in upload validation and display `Not provided` or hide the row when empty.

### Review Status

Stored values and labels are already mostly consistent:

| Stored value | Display label |
| --- | --- |
| `for_review` | Pending |
| `flagged` | Flagged |
| `accepted` | Approved |
| `trashed` | Trashed |

Rule: store status keys, not labels. Labels can change without data migration.

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
3. Should each thesis have one research area or multiple research areas?
4. Should `Networking` remain in the approved research-area list?
5. Should `Software Engineering` and `Computer Vision` be added as approved research areas, or mapped to broader existing areas?
6. Is `conference` required for every accepted thesis/capstone, or should it be optional metadata?
7. Is `publication_link` required for every submission, or should the uploaded PDF be enough when no public URL exists?
8. If the database keeps a date-shaped `publication_date` column, what internal placeholder day should represent month/year-only values?
