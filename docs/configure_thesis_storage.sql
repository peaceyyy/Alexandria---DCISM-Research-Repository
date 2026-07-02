-- Supabase Storage guardrails for thesis submissions.
-- Apply this after confirming the bucket id is thesis_files_bucket.
UPDATE storage.buckets
SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['application/pdf']::text[]
WHERE id = 'thesis_files_bucket';
