# Repository Access and Progress Policy

**Status:** Approved product direction; implementation and live schema changes are deferred.

## Purpose

This decision separates academic progress, staff review, and repository access.
They are different facts and must not be represented by one overloaded status or
by topic tags.

## Record classification

| Concept | Stored purpose | Values or rule |
| --- | --- | --- |
| Study type | Academic work category | `thesis` or `capstone` |
| Project progress | Academic completion | `in_progress` or `completed` |
| Review status | Staff workflow | `for_review`, `flagged`, `accepted`, or `trashed` |

The user-facing label for `project_progress` is **Progress**. Do not call it
paper status: a capstone is not necessarily a paper, and status is already used
for the review workflow.

## Academic requirements

### Work in progress

A Work in progress record represents a Thesis 1-passed project. Its proposal
and methodology document may be available; results, analysis, and conclusion
are still in progress.

- `proposal_approved_on` is required.
- A WIP PDF is allowed and expected when a document is available.
- Publication link, publication date, and conference are not required.
- One optional uploaded cover image is supported by the current media model.

### Completed

A Completed record represents work that has been publicly presented or formally
published.

- Final PDF is required.
- `proposal_approved_on`, `publication_date`, `publication_link`, and
  `conference` are required.
- A moderator or administrator verifies the publication venue and link before
  confirming completion.

## Access policy

| Viewer | Work in progress | Completed and accepted |
| --- | --- | --- |
| Guest | No access | Public record page and public PDF |
| Approved DCISM community account | Browse and open available WIP documents | Public-record access plus community features |
| Submitter and staff | Own/review material allowed by role | Review and administration actions allowed by role |

The department's approved community roster decides who may receive an active
account. The first roster may be based on current USC student accounts. Alumni
access is an explicit future account-administration process; it must not rely
solely on a current `usc.edu.ph` email address.

Before a completed record is made public, the submitter and staff must address
any journal, conference, co-author, adviser, or other publication-rights concern.
Alexandria records that the link and venue were reviewed; it cannot itself
determine third-party copyright rights.

## Media and future hosting

The current media contract supports one optional uploaded cover image. A future
MP4 teaser is a separate media asset, not a replacement for the image contract
and not a new thesis-status field. Video playback, hover behavior, and video
frame extraction are deferred.

For a school-server migration, transfer media as files plus a manifest rather
than treating Supabase bucket paths as permanent public identifiers. The manifest
must carry each asset's thesis ID, logical kind, MIME type, byte size, checksum,
and storage key; the target storage provider receives copied bytes and a verified
mapping before traffic is switched.

## Explicit non-decisions

- The staff-only onboarding/template experience is designed in its own task.
- The method for issuing alumni accounts is a separate account-administration
  decision.
- No schema, RLS, Storage, or application-code change is authorized by this
  document alone.
