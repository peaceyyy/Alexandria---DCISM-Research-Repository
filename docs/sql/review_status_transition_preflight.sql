-- Read-only preflight for the review-status transition update.
-- Run this first in the Supabase SQL editor. It does not modify any data.

WITH function_source AS (
  SELECT pg_get_functiondef(
    'public.set_review_status(bigint,text)'::regprocedure
  ) AS definition
),
status_counts AS (
  SELECT review_status, count(*)::integer AS count
  FROM public.theses
  GROUP BY review_status
)
SELECT jsonb_build_object(
  'function_definition', (SELECT definition FROM function_source),
  'allows_flagged_to_review', position(
    'current_status = ''flagged''' in (SELECT definition FROM function_source)
  ) > 0,
  'allows_trash_restore', position(
    'current_status = ''trashed''' in (SELECT definition FROM function_source)
  ) > 0,
  'status_counts', COALESCE(
    (SELECT jsonb_agg(jsonb_build_object('review_status', review_status, 'count', count)) FROM status_counts),
    '[]'::jsonb
  )
) AS review_status_transition_preflight;
