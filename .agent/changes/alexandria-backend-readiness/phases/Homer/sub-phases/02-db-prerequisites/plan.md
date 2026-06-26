# Sub-phase 02: Database Prerequisites

Owner: Shane
Fallback owner: Homer
Mode: Planning first, implementation later

## Goal

Close the small schema gaps that would otherwise make frontend/backend wiring awkward or unsafe.

## Shared Task Note

This sub-phase belongs to Shane by default. Include Homer in review because these choices directly affect service-layer permissions. If Shane is unavailable, Homer can do the SQL work in his place after confirming against the live Supabase project.

## Tasks

- Confirm `theses.review_status` includes `for_review`, `flagged`, `accepted`, and `trashed`.
- Add `theses.submitted_by_user_id uuid REFERENCES public.users(id)`.
- Decide whether `submitted_by_user_id` is nullable for old/imported records.
- Consider adding one-primary-file protection:

```sql
CREATE UNIQUE INDEX thesis_files_one_primary_per_thesis
ON public.thesis_files (thesis_id)
WHERE is_primary = true;
```

- Confirm `thesis_authors` has:
  - nullable `user_id`
  - required `display_name`
  - `contribution_role` of `author` or `adviser`
  - optional `sort_order`

## Exit Criteria

- Service layer can tell who owns a submission.
- Member-only edit/file registration rules can be enforced.
- Trashed records can be represented in DB.
- Public detail can safely hide raw `file_url`.

