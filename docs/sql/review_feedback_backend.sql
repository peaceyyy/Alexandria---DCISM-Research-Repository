-- Alexandria review-feedback backend migration.
-- Target: field-level moderator feedback plus member correction loop.
-- Apply only after human review. This script is additive and keeps PDF
-- annotation/email automation out of the MVP path.

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. Audit event typing
-- ---------------------------------------------------------------------------

ALTER TABLE public.thesis_audits
  ADD COLUMN IF NOT EXISTS event text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'thesis_audits_event_check'
      AND conrelid = 'public.thesis_audits'::regclass
  ) THEN
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
  END IF;
END;
$$;

CREATE INDEX IF NOT EXISTS thesis_audits_thesis_updated_at_idx
  ON public.thesis_audits (thesis_id, updated_at DESC, id DESC);

-- ---------------------------------------------------------------------------
-- 2. Field-level review comments
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.thesis_review_comments (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  thesis_id bigint NOT NULL,
  field_key text NOT NULL,
  comment text NOT NULL,
  created_by_user_id uuid NOT NULL,
  addressed_at timestamp with time zone,
  addressed_by_user_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT thesis_review_comments_pkey PRIMARY KEY (id),
  CONSTRAINT thesis_review_comments_thesis_id_fkey
    FOREIGN KEY (thesis_id) REFERENCES public.theses(id) ON DELETE CASCADE,
  CONSTRAINT thesis_review_comments_created_by_user_id_fkey
    FOREIGN KEY (created_by_user_id) REFERENCES public.users(id),
  CONSTRAINT thesis_review_comments_addressed_by_user_id_fkey
    FOREIGN KEY (addressed_by_user_id) REFERENCES public.users(id),
  CONSTRAINT thesis_review_comments_field_key_check
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
          'research_area'::text,
          'tags'::text,
          'abstract'::text,
          'recommendations'::text,
          'lessons_learned'::text,
          'pdf_general'::text
        ]
      )
    )
);

CREATE INDEX IF NOT EXISTS thesis_review_comments_thesis_created_at_idx
  ON public.thesis_review_comments (thesis_id, created_at, id);

CREATE INDEX IF NOT EXISTS thesis_review_comments_thesis_field_idx
  ON public.thesis_review_comments (thesis_id, field_key);

CREATE INDEX IF NOT EXISTS thesis_review_comments_open_idx
  ON public.thesis_review_comments (thesis_id)
  WHERE addressed_at IS NULL;

-- ---------------------------------------------------------------------------
-- 3. Transactional review RPCs
-- ---------------------------------------------------------------------------

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
    RAISE EXCEPTION 'A review comment is required'
      USING ERRCODE = '22023';
  END IF;

  IF target_field_key NOT IN (
    'title',
    'authors',
    'advisers',
    'department',
    'study_type',
    'publication_date',
    'publication_link',
    'research_area',
    'tags',
    'abstract',
    'recommendations',
    'lessons_learned',
    'pdf_general'
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
    RAISE EXCEPTION 'Thesis was not found'
      USING ERRCODE = 'P0002';
  END IF;

  IF current_status NOT IN ('for_review', 'flagged') THEN
    RAISE EXCEPTION 'Comments can only be added while a submission is under review'
      USING ERRCODE = '42501';
  END IF;

  INSERT INTO public.thesis_review_comments (
    thesis_id,
    field_key,
    comment,
    created_by_user_id
  )
  VALUES (
    target_thesis_id,
    target_field_key,
    normalized_comment,
    auth.uid()
  )
  RETURNING id INTO new_comment_id;

  INSERT INTO public.thesis_audits (
    thesis_id,
    changed_by_user_id,
    event,
    change_description
  )
  VALUES (
    target_thesis_id,
    auth.uid(),
    'comment_added',
    'Review comment added to ' || target_field_key || '.'
  );

  RETURN new_comment_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_review_status(
  target_thesis_id bigint,
  next_status text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  current_status text;
BEGIN
  IF NOT public.current_user_is_active(ARRAY['admin', 'moderator']) THEN
    RAISE EXCEPTION 'An active administrator or moderator account is required'
      USING ERRCODE = '42501';
  END IF;

  IF next_status NOT IN ('flagged', 'accepted', 'trashed') THEN
    RAISE EXCEPTION 'That review status transition is not allowed'
      USING ERRCODE = '22023';
  END IF;

  SELECT review_status
  INTO current_status
  FROM public.theses
  WHERE id = target_thesis_id
  FOR UPDATE;

  IF current_status IS NULL THEN
    RAISE EXCEPTION 'Thesis was not found'
      USING ERRCODE = 'P0002';
  END IF;

  IF NOT (
    current_status = 'for_review'
    AND next_status IN ('flagged', 'accepted', 'trashed')
  ) AND NOT (
    current_status = 'flagged'
    AND next_status = 'trashed'
  ) THEN
    RAISE EXCEPTION 'That review status transition is not allowed'
      USING ERRCODE = '22023';
  END IF;

  IF current_status = next_status THEN
    RETURN;
  END IF;

  UPDATE public.theses
  SET
    review_status = next_status,
    updated_at = now()
  WHERE id = target_thesis_id;

  INSERT INTO public.thesis_audits (
    thesis_id,
    changed_by_user_id,
    event,
    change_description
  )
  VALUES (
    target_thesis_id,
    auth.uid(),
    'status_changed',
    'Review status changed from ' || current_status || ' to ' || next_status || '.'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.update_flagged_submission(
  target_thesis_id bigint,
  payload jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  owner_id uuid;
  current_status text;
  current_calendar_date date;
  next_publication_date date;
  next_study_type text;
  author jsonb;
  tag text;
BEGIN
  IF auth.uid() IS NULL OR NOT public.current_user_is_active() THEN
    RAISE EXCEPTION 'An active authenticated user profile is required'
      USING ERRCODE = '42501';
  END IF;

  IF jsonb_typeof(payload) IS DISTINCT FROM 'object' THEN
    RAISE EXCEPTION 'Submission changes must be an object'
      USING ERRCODE = '22023';
  END IF;

  SELECT submitted_by_user_id, review_status
  INTO owner_id, current_status
  FROM public.theses
  WHERE id = target_thesis_id
  FOR UPDATE;

  IF current_status IS NULL THEN
    RAISE EXCEPTION 'Thesis was not found'
      USING ERRCODE = 'P0002';
  END IF;

  IF owner_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'You are not the owner of this thesis'
      USING ERRCODE = '42501';
  END IF;

  IF current_status <> 'flagged' THEN
    RAISE EXCEPTION 'Only flagged submissions can be edited by members'
      USING ERRCODE = '42501';
  END IF;

  current_calendar_date := (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila')::date;

  IF payload ? 'publication_date' THEN
    next_publication_date := NULLIF(payload->>'publication_date', '')::date;

    IF next_publication_date IS NULL THEN
      RAISE EXCEPTION 'Publication date is required'
        USING ERRCODE = '22023';
    END IF;

    IF next_publication_date > current_calendar_date THEN
      RAISE EXCEPTION 'Publication date cannot be later than today'
        USING ERRCODE = '22023';
    END IF;
  END IF;

  IF payload ? 'study_type' THEN
    next_study_type := payload->>'study_type';
    IF next_study_type NOT IN ('thesis', 'capstone') THEN
      RAISE EXCEPTION 'Study type must be thesis or capstone'
        USING ERRCODE = '22023';
    END IF;
  END IF;

  UPDATE public.theses
  SET
    title = CASE WHEN payload ? 'title' THEN payload->>'title' ELSE title END,
    abstract = CASE WHEN payload ? 'abstract' THEN payload->>'abstract' ELSE abstract END,
    department = CASE WHEN payload ? 'department' THEN payload->>'department' ELSE department END,
    research_area = CASE WHEN payload ? 'research_area' THEN NULLIF(payload->>'research_area', '') ELSE research_area END,
    publication_date = CASE WHEN payload ? 'publication_date' THEN next_publication_date ELSE publication_date END,
    year = CASE
      WHEN payload ? 'publication_date'
        THEN EXTRACT(YEAR FROM next_publication_date)::integer
      ELSE year
    END,
    publication_link = CASE WHEN payload ? 'publication_link' THEN NULLIF(payload->>'publication_link', '') ELSE publication_link END,
    conference = CASE WHEN payload ? 'conference' THEN NULLIF(payload->>'conference', '') ELSE conference END,
    recommendations = CASE WHEN payload ? 'recommendations' THEN NULLIF(payload->>'recommendations', '') ELSE recommendations END,
    lessons_learned = CASE WHEN payload ? 'lessons_learned' THEN NULLIF(payload->>'lessons_learned', '') ELSE lessons_learned END,
    study_type = CASE WHEN payload ? 'study_type' THEN next_study_type ELSE study_type END,
    updated_at = now()
  WHERE id = target_thesis_id;

  IF payload ? 'authors' THEN
    IF jsonb_typeof(payload->'authors') IS DISTINCT FROM 'array'
      OR jsonb_array_length(payload->'authors') = 0
    THEN
      RAISE EXCEPTION 'At least one thesis author is required'
        USING ERRCODE = '22023';
    END IF;

    DELETE FROM public.thesis_authors
    WHERE thesis_id = target_thesis_id;

    FOR author IN
      SELECT *
      FROM jsonb_array_elements(payload->'authors')
    LOOP
      IF NULLIF(btrim(author->>'display_name'), '') IS NULL THEN
        RAISE EXCEPTION 'Every thesis author requires a display name'
          USING ERRCODE = '22023';
      END IF;

      IF author->>'contribution_role' NOT IN ('author', 'adviser') THEN
        RAISE EXCEPTION 'Contribution role must be author or adviser'
          USING ERRCODE = '22023';
      END IF;

      INSERT INTO public.thesis_authors (
        thesis_id,
        user_id,
        display_name,
        contribution_role,
        sort_order
      )
      VALUES (
        target_thesis_id,
        NULLIF(author->>'user_id', '')::uuid,
        btrim(author->>'display_name'),
        author->>'contribution_role',
        NULLIF(author->>'sort_order', '')::integer
      );
    END LOOP;
  END IF;

  IF payload ? 'tags' THEN
    IF jsonb_typeof(payload->'tags') IS DISTINCT FROM 'array'
      OR jsonb_array_length(payload->'tags') = 0
    THEN
      RAISE EXCEPTION 'At least one tag is required'
        USING ERRCODE = '22023';
    END IF;

    DELETE FROM public.thesis_tags
    WHERE thesis_id = target_thesis_id;

    FOR tag IN
      SELECT *
      FROM jsonb_array_elements_text(payload->'tags')
    LOOP
      IF NULLIF(btrim(tag), '') IS NOT NULL THEN
        INSERT INTO public.thesis_tags (thesis_id, tag)
        VALUES (target_thesis_id, btrim(tag));
      END IF;
    END LOOP;
  END IF;

  INSERT INTO public.thesis_audits (
    thesis_id,
    changed_by_user_id,
    event,
    change_description
  )
  VALUES (
    target_thesis_id,
    auth.uid(),
    'metadata_edited',
    'Submitter updated flagged submission fields.'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.mark_review_comment_addressed(
  target_thesis_id bigint,
  target_comment_id bigint
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  owner_id uuid;
  current_status text;
  changed_count integer;
BEGIN
  IF auth.uid() IS NULL OR NOT public.current_user_is_active() THEN
    RAISE EXCEPTION 'An active authenticated user profile is required'
      USING ERRCODE = '42501';
  END IF;

  SELECT submitted_by_user_id, review_status
  INTO owner_id, current_status
  FROM public.theses
  WHERE id = target_thesis_id
  FOR UPDATE;

  IF current_status IS NULL THEN
    RAISE EXCEPTION 'Thesis was not found'
      USING ERRCODE = 'P0002';
  END IF;

  IF owner_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'You are not the owner of this thesis'
      USING ERRCODE = '42501';
  END IF;

  IF current_status <> 'flagged' THEN
    RAISE EXCEPTION 'Only flagged submissions can have addressed comments'
      USING ERRCODE = '42501';
  END IF;

  UPDATE public.thesis_review_comments
  SET
    addressed_at = now(),
    addressed_by_user_id = auth.uid()
  WHERE id = target_comment_id
    AND thesis_id = target_thesis_id
    AND addressed_at IS NULL;

  GET DIAGNOSTICS changed_count = ROW_COUNT;

  IF changed_count = 0 AND NOT EXISTS (
    SELECT 1
    FROM public.thesis_review_comments
    WHERE id = target_comment_id
      AND thesis_id = target_thesis_id
  ) THEN
    RAISE EXCEPTION 'Review comment was not found'
      USING ERRCODE = 'P0002';
  END IF;

  IF changed_count > 0 THEN
    INSERT INTO public.thesis_audits (
      thesis_id,
      changed_by_user_id,
      event,
      change_description
    )
    VALUES (
      target_thesis_id,
      auth.uid(),
      'comment_addressed',
      'Submitter marked a review comment as addressed.'
    );
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.resubmit_flagged_submission(
  target_thesis_id bigint
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
  IF auth.uid() IS NULL OR NOT public.current_user_is_active() THEN
    RAISE EXCEPTION 'An active authenticated user profile is required'
      USING ERRCODE = '42501';
  END IF;

  SELECT submitted_by_user_id, review_status
  INTO owner_id, current_status
  FROM public.theses
  WHERE id = target_thesis_id
  FOR UPDATE;

  IF current_status IS NULL THEN
    RAISE EXCEPTION 'Thesis was not found'
      USING ERRCODE = 'P0002';
  END IF;

  IF owner_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'You are not the owner of this thesis'
      USING ERRCODE = '42501';
  END IF;

  IF current_status <> 'flagged' THEN
    RAISE EXCEPTION 'Only flagged submissions can be resubmitted'
      USING ERRCODE = '42501';
  END IF;

  UPDATE public.theses
  SET
    review_status = 'for_review',
    updated_at = now()
  WHERE id = target_thesis_id;

  INSERT INTO public.thesis_audits (
    thesis_id,
    changed_by_user_id,
    event,
    change_description
  )
  VALUES (
    target_thesis_id,
    auth.uid(),
    'resubmitted',
    'Submitter resubmitted the thesis for review.'
  );
END;
$$;

-- ---------------------------------------------------------------------------
-- 4. Grants and row-level security
-- ---------------------------------------------------------------------------

ALTER TABLE public.thesis_review_comments ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.thesis_review_comments FROM anon;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER
  ON TABLE public.thesis_review_comments
  FROM authenticated;

GRANT SELECT ON TABLE public.thesis_review_comments TO authenticated;

DROP POLICY IF EXISTS active_users_read_visible_review_comments
  ON public.thesis_review_comments;
CREATE POLICY active_users_read_visible_review_comments
  ON public.thesis_review_comments
  FOR SELECT
  TO authenticated
  USING (
    public.current_user_is_active()
    AND EXISTS (
      SELECT 1
      FROM public.theses AS thesis
      WHERE thesis.id = thesis_review_comments.thesis_id
        AND (
          thesis.submitted_by_user_id = auth.uid()
          OR public.current_user_is_active(ARRAY['admin', 'moderator'])
        )
    )
  );

DROP POLICY IF EXISTS active_account_required
  ON public.thesis_review_comments;
CREATE POLICY active_account_required
  ON public.thesis_review_comments
  AS RESTRICTIVE
  FOR ALL
  TO authenticated
  USING (public.current_user_is_active())
  WITH CHECK (public.current_user_is_active());

DROP POLICY IF EXISTS active_users_read_own_audits
  ON public.thesis_audits;
CREATE POLICY active_users_read_own_audits
  ON public.thesis_audits
  FOR SELECT
  TO authenticated
  USING (
    public.current_user_is_active()
    AND EXISTS (
      SELECT 1
      FROM public.theses AS thesis
      WHERE thesis.id = thesis_audits.thesis_id
        AND thesis.submitted_by_user_id = auth.uid()
    )
  );

REVOKE ALL ON FUNCTION public.add_review_comment(bigint, text, text)
  FROM PUBLIC;
REVOKE ALL ON FUNCTION public.add_review_comment(bigint, text, text)
  FROM anon;
GRANT EXECUTE ON FUNCTION public.add_review_comment(bigint, text, text)
  TO authenticated;

REVOKE ALL ON FUNCTION public.set_review_status(bigint, text)
  FROM PUBLIC;
REVOKE ALL ON FUNCTION public.set_review_status(bigint, text)
  FROM anon;
GRANT EXECUTE ON FUNCTION public.set_review_status(bigint, text)
  TO authenticated;

REVOKE ALL ON FUNCTION public.update_flagged_submission(bigint, jsonb)
  FROM PUBLIC;
REVOKE ALL ON FUNCTION public.update_flagged_submission(bigint, jsonb)
  FROM anon;
GRANT EXECUTE ON FUNCTION public.update_flagged_submission(bigint, jsonb)
  TO authenticated;

REVOKE ALL ON FUNCTION public.mark_review_comment_addressed(bigint, bigint)
  FROM PUBLIC;
REVOKE ALL ON FUNCTION public.mark_review_comment_addressed(bigint, bigint)
  FROM anon;
GRANT EXECUTE ON FUNCTION public.mark_review_comment_addressed(bigint, bigint)
  TO authenticated;

REVOKE ALL ON FUNCTION public.resubmit_flagged_submission(bigint)
  FROM PUBLIC;
REVOKE ALL ON FUNCTION public.resubmit_flagged_submission(bigint)
  FROM anon;
GRANT EXECUTE ON FUNCTION public.resubmit_flagged_submission(bigint)
  TO authenticated;

COMMIT;
