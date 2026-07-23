-- Alexandria admin dashboard, account lifecycle, submission, and Storage migration.
-- Target: the inspected Supabase MVP/POC schema on 2026-07-06.
-- Apply only after human review. This script preserves existing rows and objects.

BEGIN;

-- ---------------------------------------------------------------------------
-- 1. Additive schema changes
-- ---------------------------------------------------------------------------

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS deactivated_at timestamp with time zone,
  ADD COLUMN IF NOT EXISTS deactivation_reason text,
  ADD COLUMN IF NOT EXISTS deactivated_by_user_id uuid;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'users_deactivated_by_user_id_fkey'
      AND conrelid = 'public.users'::regclass
  ) THEN
    ALTER TABLE public.users
      ADD CONSTRAINT users_deactivated_by_user_id_fkey
      FOREIGN KEY (deactivated_by_user_id)
      REFERENCES public.users(id);
  END IF;
END;
$$;

ALTER TABLE public.users
  ALTER COLUMN usc_id DROP NOT NULL;

UPDATE public.users
SET usc_id = NULL
WHERE usc_id = 0;

ALTER TABLE public.thesis_files
  ADD COLUMN IF NOT EXISTS storage_path text;

-- Existing MVP rows store a Supabase public-style URL even though the bucket is
-- private. Preserve that field for rollback and extract the object path.
UPDATE public.thesis_files
SET storage_path = split_part(
  split_part(file_url, '/thesis_files_bucket/', 2),
  '?',
  1
)
WHERE storage_path IS NULL
  AND file_url LIKE '%/thesis_files_bucket/%';

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM public.thesis_files
    WHERE storage_path IS NULL OR btrim(storage_path) = ''
  ) THEN
    RAISE EXCEPTION
      'Migration stopped: every thesis_files row must map to a storage_path';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.thesis_files AS thesis_file
    WHERE NOT EXISTS (
      SELECT 1
      FROM storage.objects AS storage_object
      WHERE storage_object.bucket_id = 'thesis_files_bucket'
        AND storage_object.name = thesis_file.storage_path
    )
  ) THEN
    RAISE EXCEPTION
      'Migration stopped: a thesis_files.storage_path does not exist in Storage';
  END IF;

  IF EXISTS (
    SELECT thesis_id
    FROM public.thesis_files
    WHERE is_primary
    GROUP BY thesis_id
    HAVING count(*) > 1
  ) THEN
    RAISE EXCEPTION
      'Migration stopped: a thesis has more than one primary file';
  END IF;
END;
$$;

ALTER TABLE public.thesis_files
  ALTER COLUMN storage_path SET NOT NULL,
  ALTER COLUMN file_url DROP NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS thesis_files_storage_path_key
  ON public.thesis_files (storage_path);

CREATE UNIQUE INDEX IF NOT EXISTS thesis_files_one_primary_per_thesis
  ON public.thesis_files (thesis_id)
  WHERE is_primary;

CREATE INDEX IF NOT EXISTS users_role_deactivated_at_idx
  ON public.users (role, deactivated_at);

CREATE INDEX IF NOT EXISTS theses_review_status_created_at_idx
  ON public.theses (review_status, created_at DESC);

CREATE INDEX IF NOT EXISTS theses_department_review_status_idx
  ON public.theses (department, review_status);

CREATE INDEX IF NOT EXISTS thesis_audits_updated_at_idx
  ON public.thesis_audits (updated_at DESC);

CREATE INDEX IF NOT EXISTS thesis_authors_thesis_role_sort_idx
  ON public.thesis_authors (
    thesis_id,
    contribution_role,
    sort_order,
    id
  );

-- ---------------------------------------------------------------------------
-- 2. Auth profile trigger and active-account helper
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    profile_name,
    usc_id,
    role,
    affiliation
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'profile_name', ''),
    NULLIF(NEW.raw_user_meta_data->>'usc_id', '')::bigint,
    'member',
    COALESCE(NEW.raw_user_meta_data->>'affiliation', 'student')
  );

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.current_user_is_active(
  required_roles text[] DEFAULT NULL
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.users AS user_profile
    WHERE user_profile.id = auth.uid()
      AND user_profile.deactivated_at IS NULL
      AND (
        required_roles IS NULL
        OR user_profile.role = ANY(required_roles)
      )
  );
$$;

REVOKE ALL ON FUNCTION public.current_user_is_active(text[]) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.current_user_is_active(text[]) FROM anon;
GRANT EXECUTE ON FUNCTION public.current_user_is_active(text[])
  TO authenticated;

-- ---------------------------------------------------------------------------
-- 3. Guarded dashboard and account-management RPCs
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.get_admin_dashboard_snapshot()
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  snapshot jsonb;
BEGIN
  IF NOT public.current_user_is_active(ARRAY['admin', 'moderator']) THEN
    RAISE EXCEPTION
      'An active administrator or moderator account is required'
      USING ERRCODE = '42501';
  END IF;

  SELECT jsonb_build_object(
    'viewer',
      jsonb_build_object(
        'profile_name',
        (
          SELECT user_profile.profile_name
          FROM public.users AS user_profile
          WHERE user_profile.id = auth.uid()
        )
      ),
    'metrics',
      jsonb_build_object(
        'total_research',
          (
            SELECT count(*)
            FROM public.theses
            WHERE review_status <> 'trashed'
          ),
        'registered_users',
          (
            SELECT count(*)
            FROM public.users
            WHERE deactivated_at IS NULL
          ),
        'pending_docs',
          (
            SELECT count(*)
            FROM public.theses
            WHERE review_status = 'for_review'
          )
      ),
    'recent_uploads',
      COALESCE(
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'id', recent.id,
              'title', recent.title,
              'author', recent.author,
              'created_at', recent.created_at,
              'review_status', recent.review_status
            )
            ORDER BY recent.created_at DESC, recent.id DESC
          )
          FROM (
            SELECT
              thesis.id,
              thesis.title,
              COALESCE(first_author.display_name, 'Unknown author') AS author,
              thesis.created_at,
              thesis.review_status
            FROM public.theses AS thesis
            LEFT JOIN LATERAL (
              SELECT thesis_author.display_name
              FROM public.thesis_authors AS thesis_author
              WHERE thesis_author.thesis_id = thesis.id
                AND thesis_author.contribution_role = 'author'
              ORDER BY
                thesis_author.sort_order NULLS LAST,
                thesis_author.id
              LIMIT 1
            ) AS first_author ON true
            WHERE thesis.review_status <> 'trashed'
            ORDER BY thesis.created_at DESC, thesis.id DESC
            LIMIT 5
          ) AS recent
        ),
        '[]'::jsonb
      ),
    'recent_activity',
      COALESCE(
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'id', activity.id,
              'thesis_id', activity.thesis_id,
              'text', activity.activity_text,
              'occurred_at', activity.updated_at
            )
            ORDER BY activity.updated_at DESC, activity.id DESC
          )
          FROM (
            SELECT
              thesis_audit.id,
              thesis_audit.thesis_id,
              COALESCE(
                NULLIF(btrim(thesis_audit.change_description), ''),
                'Thesis activity recorded.'
              ) AS activity_text,
              thesis_audit.updated_at
            FROM public.thesis_audits AS thesis_audit
            ORDER BY thesis_audit.updated_at DESC, thesis_audit.id DESC
            LIMIT 5
          ) AS activity
        ),
        '[]'::jsonb
      ),
    'research_by_department',
      COALESCE(
        (
          SELECT jsonb_agg(
            jsonb_build_object(
              'department', department_count.department,
              'count', department_count.research_count
            )
            ORDER BY
              department_count.research_count DESC,
              department_count.department
          )
          FROM (
            SELECT department, count(*) AS research_count
            FROM public.theses
            WHERE review_status <> 'trashed'
            GROUP BY department
          ) AS department_count
        ),
        '[]'::jsonb
      )
  )
  INTO snapshot;

  RETURN snapshot;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_user_role(
  target_user_id uuid,
  new_role text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  target_current_role text;
  target_is_deactivated boolean;
BEGIN
  IF NOT public.current_user_is_active(ARRAY['admin']) THEN
    RAISE EXCEPTION 'An active administrator account is required'
      USING ERRCODE = '42501';
  END IF;

  IF new_role NOT IN ('member', 'moderator') THEN
    RAISE EXCEPTION 'Role must be member or moderator'
      USING ERRCODE = '22023';
  END IF;

  SELECT role, deactivated_at IS NOT NULL
  INTO target_current_role, target_is_deactivated
  FROM public.users
  WHERE id = target_user_id
  FOR UPDATE;

  IF target_current_role IS NULL THEN
    RAISE EXCEPTION 'User was not found'
      USING ERRCODE = 'P0002';
  END IF;

  IF target_current_role = 'admin' THEN
    RAISE EXCEPTION 'Administrator roles are protected'
      USING ERRCODE = '42501';
  END IF;

  IF target_is_deactivated THEN
    RAISE EXCEPTION 'Reactivate the account before changing its role'
      USING ERRCODE = '42501';
  END IF;

  IF target_current_role = new_role THEN
    RETURN;
  END IF;

  IF NOT (
    (target_current_role = 'member' AND new_role = 'moderator')
    OR (target_current_role = 'moderator' AND new_role = 'member')
  ) THEN
    RAISE EXCEPTION 'That role transition is not allowed'
      USING ERRCODE = '22023';
  END IF;

  UPDATE public.users
  SET role = new_role
  WHERE id = target_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_deactivate_user(
  target_user_id uuid,
  reason text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  target_role text;
  normalized_reason text;
BEGIN
  IF NOT public.current_user_is_active(ARRAY['admin']) THEN
    RAISE EXCEPTION 'An active administrator account is required'
      USING ERRCODE = '42501';
  END IF;

  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Administrators cannot deactivate themselves'
      USING ERRCODE = '42501';
  END IF;

  normalized_reason := NULLIF(btrim(reason), '');
  IF normalized_reason IS NULL THEN
    RAISE EXCEPTION 'A deactivation reason is required'
      USING ERRCODE = '22023';
  END IF;

  SELECT role
  INTO target_role
  FROM public.users
  WHERE id = target_user_id
  FOR UPDATE;

  IF target_role IS NULL THEN
    RAISE EXCEPTION 'User was not found'
      USING ERRCODE = 'P0002';
  END IF;

  IF target_role = 'admin' THEN
    RAISE EXCEPTION
      'Administrator accounts cannot be deactivated here'
      USING ERRCODE = '42501';
  END IF;

  UPDATE public.users
  SET
    deactivated_at = now(),
    deactivation_reason = normalized_reason,
    deactivated_by_user_id = auth.uid()
  WHERE id = target_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_reactivate_user(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  target_role text;
BEGIN
  IF NOT public.current_user_is_active(ARRAY['admin']) THEN
    RAISE EXCEPTION 'An active administrator account is required'
      USING ERRCODE = '42501';
  END IF;

  SELECT role
  INTO target_role
  FROM public.users
  WHERE id = target_user_id
  FOR UPDATE;

  IF target_role IS NULL THEN
    RAISE EXCEPTION 'User was not found'
      USING ERRCODE = 'P0002';
  END IF;

  IF target_role = 'admin' THEN
    RAISE EXCEPTION
      'Administrator accounts cannot be changed here'
      USING ERRCODE = '42501';
  END IF;

  UPDATE public.users
  SET
    deactivated_at = NULL,
    deactivation_reason = NULL,
    deactivated_by_user_id = NULL
  WHERE id = target_user_id;
END;
$$;

REVOKE ALL ON FUNCTION public.get_admin_dashboard_snapshot() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.get_admin_dashboard_snapshot() FROM anon;
GRANT EXECUTE ON FUNCTION public.get_admin_dashboard_snapshot()
  TO authenticated;

REVOKE ALL ON FUNCTION public.admin_update_user_role(uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_update_user_role(uuid, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_update_user_role(uuid, text)
  TO authenticated;

REVOKE ALL ON FUNCTION public.admin_deactivate_user(uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_deactivate_user(uuid, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_deactivate_user(uuid, text)
  TO authenticated;

REVOKE ALL ON FUNCTION public.admin_reactivate_user(uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_reactivate_user(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_reactivate_user(uuid)
  TO authenticated;

-- ---------------------------------------------------------------------------
-- 4. Secure transactional submission
-- ---------------------------------------------------------------------------

DROP FUNCTION IF EXISTS public.submit_thesis_transaction(jsonb);

CREATE FUNCTION public.submit_thesis_transaction(payload jsonb)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  new_thesis_id bigint;
  authenticated_user_id uuid;
  current_calendar_date date;
  thesis_year integer;
  thesis_publication_date date;
  thesis_study_type text;
  uploaded_storage_path text;
  author jsonb;
  tag text;
BEGIN
  authenticated_user_id := auth.uid();
  current_calendar_date :=
    (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Manila')::date;

  IF authenticated_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication is required to submit a thesis'
      USING ERRCODE = '42501';
  END IF;

  IF NOT public.current_user_is_active() THEN
    RAISE EXCEPTION 'An active authenticated user profile is required'
      USING ERRCODE = '42501';
  END IF;

  thesis_year := (payload->>'year')::integer;
  thesis_publication_date := NULLIF(payload->>'publication_date', '')::date;
  thesis_study_type := COALESCE(payload->>'study_type', 'thesis');
  uploaded_storage_path := NULLIF(payload->>'storage_path', '');

  IF thesis_year IS NULL
    OR thesis_year < 1
    OR thesis_year > EXTRACT(YEAR FROM current_calendar_date)::integer
  THEN
    RAISE EXCEPTION 'Thesis year must be between 1 and the current year'
      USING ERRCODE = '22023';
  END IF;

  IF thesis_publication_date IS NULL THEN
    RAISE EXCEPTION 'Publication date is required'
      USING ERRCODE = '22023';
  END IF;

  IF thesis_publication_date > current_calendar_date THEN
    RAISE EXCEPTION 'Publication date cannot be later than today'
      USING ERRCODE = '22023';
  END IF;

  IF EXTRACT(YEAR FROM thesis_publication_date)::integer <> thesis_year THEN
    RAISE EXCEPTION 'Thesis year must match the publication date year'
      USING ERRCODE = '22023';
  END IF;

  IF thesis_study_type NOT IN ('thesis', 'capstone') THEN
    RAISE EXCEPTION 'Study type must be thesis or capstone'
      USING ERRCODE = '22023';
  END IF;

  IF payload->>'file_type' IS DISTINCT FROM 'application/pdf' THEN
    RAISE EXCEPTION 'Thesis file type must be application/pdf'
      USING ERRCODE = '22023';
  END IF;

  IF uploaded_storage_path IS NULL
    OR uploaded_storage_path NOT LIKE
      ('uploads/' || authenticated_user_id::text || '/%')
  THEN
    RAISE EXCEPTION
      'The uploaded file path must belong to the authenticated user'
      USING ERRCODE = '22023';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM storage.objects
    WHERE bucket_id = 'thesis_files_bucket'
      AND name = uploaded_storage_path
  ) THEN
    RAISE EXCEPTION 'The uploaded thesis PDF was not found in Storage'
      USING ERRCODE = '22023';
  END IF;

  IF jsonb_typeof(payload->'authors') IS DISTINCT FROM 'array'
    OR jsonb_array_length(payload->'authors') = 0
  THEN
    RAISE EXCEPTION 'At least one thesis author is required'
      USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.theses (
    title,
    abstract,
    year,
    department,
    research_area,
    publication_date,
    publication_link,
    conference,
    recommendations,
    lessons_learned,
    submitted_by_user_id,
    review_status,
    study_type
  )
  VALUES (
    payload->>'title',
    payload->>'abstract',
    thesis_year,
    payload->>'department',
    payload->>'research_area',
    thesis_publication_date,
    NULLIF(payload->>'publication_link', ''),
    NULLIF(payload->>'conference', ''),
    NULLIF(payload->>'recommendations', ''),
    NULLIF(payload->>'lessons_learned', ''),
    authenticated_user_id,
    'for_review',
    thesis_study_type
  )
  RETURNING id INTO new_thesis_id;

  FOR author IN
    SELECT *
    FROM jsonb_array_elements(payload->'authors')
  LOOP
    IF NULLIF(btrim(author->>'display_name'), '') IS NULL THEN
      RAISE EXCEPTION 'Every thesis author requires a display name'
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
      new_thesis_id,
      NULLIF(author->>'user_id', '')::uuid,
      btrim(author->>'display_name'),
      author->>'contribution_role',
      (author->>'sort_order')::integer
    );
  END LOOP;

  IF jsonb_typeof(payload->'tags') = 'array' THEN
    FOR tag IN
      SELECT *
      FROM jsonb_array_elements_text(payload->'tags')
    LOOP
      IF NULLIF(btrim(tag), '') IS NOT NULL THEN
        INSERT INTO public.thesis_tags (thesis_id, tag)
        VALUES (new_thesis_id, btrim(tag));
      END IF;
    END LOOP;
  END IF;

  INSERT INTO public.thesis_files (
    thesis_id,
    file_url,
    storage_path,
    file_type,
    is_primary
  )
  VALUES (
    new_thesis_id,
    NULL,
    uploaded_storage_path,
    'application/pdf',
    true
  );

  RETURN new_thesis_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_thesis_transaction(jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.submit_thesis_transaction(jsonb) FROM anon;
GRANT EXECUTE ON FUNCTION public.submit_thesis_transaction(jsonb)
  TO authenticated;

-- ---------------------------------------------------------------------------
-- 5. Least-privilege table grants and RLS policies
-- ---------------------------------------------------------------------------

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thesis_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thesis_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thesis_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thesis_audits ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE
  public.users,
  public.theses,
  public.thesis_authors,
  public.thesis_tags,
  public.thesis_files,
  public.thesis_audits
FROM anon;

REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON TABLE
  public.users,
  public.theses,
  public.thesis_authors,
  public.thesis_tags,
  public.thesis_files,
  public.thesis_audits
FROM authenticated;

GRANT SELECT ON TABLE
  public.users,
  public.theses,
  public.thesis_authors,
  public.thesis_tags,
  public.thesis_files,
  public.thesis_audits
TO authenticated;

-- Guests can browse accepted metadata, but never receive thesis_files rows
-- containing private Storage paths.
GRANT SELECT ON TABLE
  public.theses,
  public.thesis_authors,
  public.thesis_tags
TO anon;

-- Preserve the existing authenticated self-profile policy and add admin read.
DROP POLICY IF EXISTS active_admin_reads_users ON public.users;
CREATE POLICY active_admin_reads_users
  ON public.users
  FOR SELECT
  TO authenticated
  USING (public.current_user_is_active(ARRAY['admin']));

DROP POLICY IF EXISTS active_account_required ON public.users;
CREATE POLICY active_account_required
  ON public.users
  AS RESTRICTIVE
  FOR ALL
  TO authenticated
  USING (public.current_user_is_active())
  WITH CHECK (public.current_user_is_active());

DROP POLICY IF EXISTS guests_read_accepted_theses ON public.theses;
CREATE POLICY guests_read_accepted_theses
  ON public.theses
  FOR SELECT
  TO anon
  USING (review_status = 'accepted');

DROP POLICY IF EXISTS guests_read_accepted_authors
  ON public.thesis_authors;
CREATE POLICY guests_read_accepted_authors
  ON public.thesis_authors
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1
      FROM public.theses AS thesis
      WHERE thesis.id = thesis_authors.thesis_id
        AND thesis.review_status = 'accepted'
    )
  );

DROP POLICY IF EXISTS guests_read_accepted_tags ON public.thesis_tags;
CREATE POLICY guests_read_accepted_tags
  ON public.thesis_tags
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1
      FROM public.theses AS thesis
      WHERE thesis.id = thesis_tags.thesis_id
        AND thesis.review_status = 'accepted'
    )
  );

DROP POLICY IF EXISTS active_users_read_visible_theses ON public.theses;
CREATE POLICY active_users_read_visible_theses
  ON public.theses
  FOR SELECT
  TO authenticated
  USING (
    public.current_user_is_active()
    AND (
      review_status = 'accepted'
      OR submitted_by_user_id = auth.uid()
      OR public.current_user_is_active(ARRAY['admin', 'moderator'])
    )
  );

DROP POLICY IF EXISTS active_users_read_visible_authors
  ON public.thesis_authors;
CREATE POLICY active_users_read_visible_authors
  ON public.thesis_authors
  FOR SELECT
  TO authenticated
  USING (
    public.current_user_is_active()
    AND EXISTS (
      SELECT 1
      FROM public.theses AS thesis
      WHERE thesis.id = thesis_authors.thesis_id
        AND (
          thesis.review_status = 'accepted'
          OR thesis.submitted_by_user_id = auth.uid()
          OR public.current_user_is_active(ARRAY['admin', 'moderator'])
        )
    )
  );

DROP POLICY IF EXISTS active_users_read_visible_tags ON public.thesis_tags;
CREATE POLICY active_users_read_visible_tags
  ON public.thesis_tags
  FOR SELECT
  TO authenticated
  USING (
    public.current_user_is_active()
    AND EXISTS (
      SELECT 1
      FROM public.theses AS thesis
      WHERE thesis.id = thesis_tags.thesis_id
        AND (
          thesis.review_status = 'accepted'
          OR thesis.submitted_by_user_id = auth.uid()
          OR public.current_user_is_active(ARRAY['admin', 'moderator'])
        )
    )
  );

DROP POLICY IF EXISTS active_users_read_visible_file_metadata
  ON public.thesis_files;
CREATE POLICY active_users_read_visible_file_metadata
  ON public.thesis_files
  FOR SELECT
  TO authenticated
  USING (
    public.current_user_is_active()
    AND EXISTS (
      SELECT 1
      FROM public.theses AS thesis
      WHERE thesis.id = thesis_files.thesis_id
        AND (
          thesis.review_status = 'accepted'
          OR thesis.submitted_by_user_id = auth.uid()
          OR public.current_user_is_active(ARRAY['admin', 'moderator'])
        )
    )
  );

DROP POLICY IF EXISTS active_reviewers_read_audits
  ON public.thesis_audits;
CREATE POLICY active_reviewers_read_audits
  ON public.thesis_audits
  FOR SELECT
  TO authenticated
  USING (
    public.current_user_is_active(ARRAY['admin', 'moderator'])
  );

-- Restrictive policies prevent a future permissive policy from accidentally
-- restoring access to a deactivated authenticated session.
DROP POLICY IF EXISTS active_account_required ON public.theses;
CREATE POLICY active_account_required
  ON public.theses
  AS RESTRICTIVE
  FOR ALL
  TO authenticated
  USING (public.current_user_is_active())
  WITH CHECK (public.current_user_is_active());

DROP POLICY IF EXISTS active_account_required ON public.thesis_authors;
CREATE POLICY active_account_required
  ON public.thesis_authors
  AS RESTRICTIVE
  FOR ALL
  TO authenticated
  USING (public.current_user_is_active())
  WITH CHECK (public.current_user_is_active());

DROP POLICY IF EXISTS active_account_required ON public.thesis_tags;
CREATE POLICY active_account_required
  ON public.thesis_tags
  AS RESTRICTIVE
  FOR ALL
  TO authenticated
  USING (public.current_user_is_active())
  WITH CHECK (public.current_user_is_active());

DROP POLICY IF EXISTS active_account_required ON public.thesis_files;
CREATE POLICY active_account_required
  ON public.thesis_files
  AS RESTRICTIVE
  FOR ALL
  TO authenticated
  USING (public.current_user_is_active())
  WITH CHECK (public.current_user_is_active());

DROP POLICY IF EXISTS active_account_required ON public.thesis_audits;
CREATE POLICY active_account_required
  ON public.thesis_audits
  AS RESTRICTIVE
  FOR ALL
  TO authenticated
  USING (public.current_user_is_active())
  WITH CHECK (public.current_user_is_active());

-- ---------------------------------------------------------------------------
-- 6. Private Storage bucket and owner-scoped mutation policies
-- ---------------------------------------------------------------------------

UPDATE storage.buckets
SET
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['application/pdf']::text[]
WHERE id = 'thesis_files_bucket';

DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads" ON storage.objects;
DROP POLICY IF EXISTS active_account_uploads_thesis_files
  ON storage.objects;
DROP POLICY IF EXISTS active_account_deletes_own_thesis_files
  ON storage.objects;
DROP POLICY IF EXISTS active_users_upload_own_thesis_files
  ON storage.objects;
DROP POLICY IF EXISTS active_users_delete_own_thesis_files
  ON storage.objects;

CREATE POLICY active_users_upload_own_thesis_files
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'thesis_files_bucket'
    AND public.current_user_is_active()
    AND (storage.foldername(name))[1] = 'uploads'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

CREATE POLICY active_users_delete_own_thesis_files
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'thesis_files_bucket'
    AND public.current_user_is_active()
    AND (storage.foldername(name))[1] = 'uploads'
    AND (storage.foldername(name))[2] = auth.uid()::text
  );

COMMIT;
