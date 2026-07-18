-- Alexandria review-corrections preflight (READ ONLY)
--
-- Run this in the target Supabase SQL editor first. It makes no changes.
-- The results show whether the two affected features are ready:
--   1. Moderators can comment on the Conference field.
--   2. Members can replace the primary PDF on a flagged submission.

-- The review-comment table and its allowed field keys.
SELECT
  to_regclass('public.thesis_review_comments') IS NOT NULL
    AS review_comments_table_exists,
  (
    SELECT pg_get_constraintdef(constraint_row.oid)
    FROM pg_constraint AS constraint_row
    WHERE constraint_row.conrelid = to_regclass('public.thesis_review_comments')
      AND constraint_row.conname = 'thesis_review_comments_field_key_check'
  ) AS field_key_constraint;

-- The two RPCs required by the affected flows, including authenticated access.
WITH required_rpc(function_name, signature) AS (
  VALUES
    ('add_review_comment', 'public.add_review_comment(bigint,text,text)'),
    (
      'replace_flagged_submission_file',
      'public.replace_flagged_submission_file(bigint,text,text)'
    )
), resolved_rpc AS (
  SELECT
    function_name,
    to_regprocedure(signature) AS function_oid
  FROM required_rpc
)
SELECT
  function_name,
  function_oid IS NOT NULL AS function_exists,
  CASE
    WHEN function_oid IS NULL THEN false
    ELSE has_function_privilege('authenticated', function_oid, 'EXECUTE')
  END AS authenticated_can_execute
FROM resolved_rpc;

-- The private PDF bucket must accept PDFs up to 10 MiB.
SELECT
  id,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE id = 'thesis_files_bucket';

-- Members need this owner-scoped insert policy for replacement uploads.
SELECT
  policyname,
  cmd,
  roles,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname = 'active_users_upload_own_thesis_files';
