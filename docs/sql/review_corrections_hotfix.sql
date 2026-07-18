-- Alexandria review-corrections hotfix.
--
-- Apply in the Supabase SQL editor after review_corrections_preflight.sql
-- confirms that thesis_review_comments already exists. This changes only the
-- conference-comment and corrected-PDF paths; it does not alter thesis data.

BEGIN;

-- Let the existing comment table accept comments on Conference.
ALTER TABLE public.thesis_review_comments
  DROP CONSTRAINT IF EXISTS thesis_review_comments_field_key_check;

ALTER TABLE public.thesis_review_comments
  ADD CONSTRAINT thesis_review_comments_field_key_check
  CHECK (
    field_key = ANY (
      ARRAY[
        'title'::text,
        'authors'::text,
        'advisers'::text,
        'department'::text,
        'study_type'::text,
        'publication_date'::text,
        'publication_link'::text,
        'conference'::text,
        'research_area'::text,
        'tags'::text,
        'abstract'::text,
        'recommendations'::text,
        'lessons_learned'::text,
        'pdf_general'::text
      ]
    )
  );

-- Keep the audit event constraint compatible with PDF replacement.
ALTER TABLE public.thesis_audits
  ADD COLUMN IF NOT EXISTS event text;

ALTER TABLE public.thesis_audits
  DROP CONSTRAINT IF EXISTS thesis_audits_event_check;

ALTER TABLE public.thesis_audits
  ADD CONSTRAINT thesis_audits_event_check
  CHECK (
    event IS NULL
    OR event = ANY (
      ARRAY[
        'submitted'::text,
        'comment_added'::text,
        'comment_addressed'::text,
        'status_changed'::text,
        'metadata_edited'::text,
        'pdf_replaced'::text,
        'resubmitted'::text
      ]
    )
  );

CREATE OR REPLACE FUNCTION public.add_review_comment(
  target_thesis_id bigint,
  target_field_key text,
  comment_body text
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  new_comment_id bigint;
  normalized_comment text;
  current_status text;
BEGIN
  IF NOT public.current_user_is_active(ARRAY['admin', 'moderator']) THEN
    RAISE EXCEPTION 'An active administrator or moderator account is required'
      USING ERRCODE = '42501';
  END IF;

  normalized_comment := NULLIF(btrim(comment_body), '');
  IF normalized_comment IS NULL THEN
    RAISE EXCEPTION 'A review comment is required' USING ERRCODE = '22023';
  END IF;

  IF target_field_key NOT IN (
    'title', 'authors', 'advisers', 'department', 'study_type',
    'publication_date', 'publication_link', 'conference', 'research_area',
    'tags', 'abstract', 'recommendations', 'lessons_learned', 'pdf_general'
  ) THEN
    RAISE EXCEPTION 'That review field cannot be commented on'
      USING ERRCODE = '22023';
  END IF;

  SELECT review_status
  INTO current_status
  FROM public.theses
  WHERE id = target_thesis_id
  FOR UPDATE;

  IF current_status IS NULL THEN
    RAISE EXCEPTION 'Thesis was not found' USING ERRCODE = 'P0002';
  END IF;

  IF current_status NOT IN ('for_review', 'flagged') THEN
    RAISE EXCEPTION 'Comments can only be added while a submission is under review'
      USING ERRCODE = '42501';
  END IF;

  INSERT INTO public.thesis_review_comments (
    thesis_id, field_key, comment, created_by_user_id
  ) VALUES (
    target_thesis_id, target_field_key, normalized_comment, auth.uid()
  )
  RETURNING id INTO new_comment_id;

  INSERT INTO public.thesis_audits (
    thesis_id, changed_by_user_id, event, change_description
  ) VALUES (
    target_thesis_id,
    auth.uid(),
    'comment_added',
    'Review comment added to ' || target_field_key || '.'
  );

  RETURN new_comment_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.replace_flagged_submission_file(
  target_thesis_id bigint,
  target_storage_path text,
  target_file_type text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  owner_id uuid;
  current_status text;
BEGIN
  IF auth.uid() IS NULL
    OR NOT public.current_user_is_active(ARRAY['member'])
  THEN
    RAISE EXCEPTION 'An active member account is required'
      USING ERRCODE = '42501';
  END IF;

  SELECT submitted_by_user_id, review_status
  INTO owner_id, current_status
  FROM public.theses
  WHERE id = target_thesis_id
  FOR UPDATE;

  IF current_status IS NULL THEN
    RAISE EXCEPTION 'Thesis was not found' USING ERRCODE = 'P0002';
  END IF;

  IF owner_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'You are not the owner of this thesis'
      USING ERRCODE = '42501';
  END IF;

  IF current_status <> 'flagged' THEN
    RAISE EXCEPTION 'Only flagged submissions can replace their PDF'
      USING ERRCODE = '42501';
  END IF;

  IF target_file_type IS DISTINCT FROM 'application/pdf' THEN
    RAISE EXCEPTION 'Thesis file type must be application/pdf'
      USING ERRCODE = '22023';
  END IF;

  IF target_storage_path IS NULL
    OR target_storage_path NOT LIKE ('uploads/' || auth.uid()::text || '/%')
  THEN
    RAISE EXCEPTION 'The uploaded file path must belong to the authenticated user'
      USING ERRCODE = '22023';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM storage.objects
    WHERE bucket_id = 'thesis_files_bucket'
      AND name = target_storage_path
  ) THEN
    RAISE EXCEPTION 'The uploaded thesis PDF was not found in Storage'
      USING ERRCODE = '22023';
  END IF;

  UPDATE public.thesis_files
  SET is_primary = false
  WHERE thesis_id = target_thesis_id
    AND is_primary;

  INSERT INTO public.thesis_files (
    thesis_id, file_url, storage_path, file_type, is_primary
  ) VALUES (
    target_thesis_id,
    NULL,
    target_storage_path,
    target_file_type,
    true
  );

  UPDATE public.thesis_review_comments
  SET member_revised_at = now()
  WHERE thesis_id = target_thesis_id
    AND field_key = 'pdf_general'
    AND created_at <= now();

  INSERT INTO public.thesis_audits (
    thesis_id, changed_by_user_id, event, change_description
  ) VALUES (
    target_thesis_id,
    auth.uid(),
    'pdf_replaced',
    'Submitter reattached the primary PDF while correcting a flagged submission.'
  );
END;
$$;

REVOKE ALL ON FUNCTION public.add_review_comment(bigint, text, text)
  FROM PUBLIC;
REVOKE ALL ON FUNCTION public.add_review_comment(bigint, text, text)
  FROM anon;
GRANT EXECUTE ON FUNCTION public.add_review_comment(bigint, text, text)
  TO authenticated;

REVOKE ALL ON FUNCTION public.replace_flagged_submission_file(bigint, text, text)
  FROM PUBLIC;
REVOKE ALL ON FUNCTION public.replace_flagged_submission_file(bigint, text, text)
  FROM anon;
GRANT EXECUTE ON FUNCTION public.replace_flagged_submission_file(bigint, text, text)
  TO authenticated;

COMMIT;
