-- Run only after the matching read-only preflight. This is an incremental
-- contract layer on top of the already-applied teaser/media foundation.
-- It intentionally leaves historical review comments intact.

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
DECLARE new_comment_id bigint; normalized_comment text; current_status text; current_study_type text;
BEGIN
  IF NOT public.current_user_is_active(ARRAY['admin', 'moderator']) THEN
    RAISE EXCEPTION 'An active administrator or moderator account is required' USING ERRCODE = '42501';
  END IF;
  IF target_field_key NOT IN ('title','authors','advisers','department','study_type','publication_date','publication_link','deployment_link','conference','research_area','tags','abstract','recommendations','lessons_learned','pdf_general','teaser_thumbnail') THEN
    RAISE EXCEPTION 'That review field cannot be commented on' USING ERRCODE = '22023';
  END IF;
  normalized_comment := NULLIF(btrim(comment_body), '');
  IF normalized_comment IS NULL THEN RAISE EXCEPTION 'A review comment is required' USING ERRCODE = '22023'; END IF;
  SELECT review_status, study_type INTO current_status, current_study_type FROM public.theses WHERE id = target_thesis_id FOR UPDATE;
  IF current_status IS NULL THEN RAISE EXCEPTION 'Thesis was not found' USING ERRCODE = 'P0002'; END IF;
  IF current_status NOT IN ('for_review','flagged') THEN RAISE EXCEPTION 'Comments can only be added while a submission is under review' USING ERRCODE = '42501'; END IF;
  IF target_field_key = 'deployment_link' AND current_study_type <> 'capstone' THEN
    RAISE EXCEPTION 'Deployment links can only be reviewed for capstones' USING ERRCODE = '22023';
  END IF;
  INSERT INTO public.thesis_review_comments (thesis_id, field_key, comment, created_by_user_id)
  VALUES (target_thesis_id, target_field_key, normalized_comment, auth.uid()) RETURNING id INTO new_comment_id;
  INSERT INTO public.thesis_audits (thesis_id, changed_by_user_id, event, change_description)
  VALUES (target_thesis_id, auth.uid(), 'comment_added', 'Review comment added to ' || target_field_key || '.');
  RETURN new_comment_id;
END;
$$;

-- These wrappers preserve the deployed, full metadata functions while adding
-- capstone-only deployment handling and keeping old comments readable.
CREATE OR REPLACE FUNCTION public.update_flagged_submission_with_deployment(
  target_thesis_id bigint, payload jsonb
)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public
AS $$
DECLARE before_link text; after_link text; next_study_type text; owner_id uuid; current_status text;
BEGIN
  IF auth.uid() IS NULL OR NOT public.current_user_is_active(ARRAY['member']) THEN RAISE EXCEPTION 'An active member account is required' USING ERRCODE = '42501'; END IF;
  SELECT deployment_link, study_type, submitted_by_user_id, review_status INTO before_link, next_study_type, owner_id, current_status FROM public.theses WHERE id = target_thesis_id FOR UPDATE;
  IF current_status IS NULL THEN RAISE EXCEPTION 'Thesis was not found' USING ERRCODE = 'P0002'; END IF;
  IF owner_id IS DISTINCT FROM auth.uid() OR current_status <> 'flagged' THEN RAISE EXCEPTION 'Only the flagged submission owner may edit this thesis' USING ERRCODE = '42501'; END IF;
  next_study_type := COALESCE(NULLIF(payload->>'study_type',''), next_study_type);
  IF next_study_type NOT IN ('thesis','capstone') THEN RAISE EXCEPTION 'Study type must be thesis or capstone' USING ERRCODE = '22023'; END IF;
  after_link := CASE WHEN next_study_type = 'thesis' THEN NULL ELSE NULLIF(btrim(payload->>'deployment_link'), '') END;
  IF after_link IS NOT NULL AND after_link !~* '^https?://' THEN RAISE EXCEPTION 'Deployment links must use http:// or https://' USING ERRCODE = '22023'; END IF;
  PERFORM public.update_flagged_submission(target_thesis_id, payload - 'deployment_link');
  UPDATE public.theses SET deployment_link = after_link, updated_at = now() WHERE id = target_thesis_id;
  IF before_link IS DISTINCT FROM after_link THEN
    UPDATE public.thesis_review_comments SET member_revised_at = now()
    WHERE thesis_id = target_thesis_id AND field_key = 'deployment_link' AND member_revised_at IS NULL;
    INSERT INTO public.thesis_audits (thesis_id, changed_by_user_id, event, change_description, change_details)
    VALUES (target_thesis_id, auth.uid(), 'metadata_edited', 'Submitter updated deployment link.', jsonb_build_object('before', before_link, 'after', after_link));
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.replace_teaser_thumbnail(
  target_thesis_id bigint, target_storage_path text, target_mime_type text, target_byte_size bigint, target_published_storage_path text
)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public
AS $$
DECLARE current_status text; owner_id uuid; prior_path text;
BEGIN
  SELECT review_status, submitted_by_user_id INTO current_status, owner_id FROM public.theses WHERE id = target_thesis_id FOR UPDATE;
  IF current_status IS NULL THEN RAISE EXCEPTION 'Thesis was not found' USING ERRCODE = 'P0002'; END IF;
  IF public.current_user_is_active(ARRAY['admin']) THEN NULL;
  ELSIF public.current_user_is_active(ARRAY['member']) AND owner_id = auth.uid() AND current_status = 'flagged' THEN NULL;
  ELSE RAISE EXCEPTION 'Only an administrator or flagged submission owner may replace a teaser thumbnail' USING ERRCODE = '42501'; END IF;
  IF target_storage_path IS NOT NULL AND (target_mime_type NOT IN ('image/jpeg','image/png','image/webp') OR target_byte_size IS NULL OR target_byte_size < 1 OR target_byte_size > 5242880) THEN
    RAISE EXCEPTION 'Invalid teaser thumbnail metadata' USING ERRCODE = '22023';
  END IF;
  IF target_storage_path IS NOT NULL AND NOT EXISTS (
    SELECT 1
    FROM storage.objects
    WHERE bucket_id = 'thesis_teaser_staging'
      AND name = target_storage_path
      AND (metadata->>'mimetype') = target_mime_type
      AND NULLIF(metadata->>'size', '')::bigint = target_byte_size
      AND (public.current_user_is_active(ARRAY['admin']) OR owner = auth.uid())
  ) THEN
    RAISE EXCEPTION 'The staged teaser thumbnail could not be verified' USING ERRCODE = '42501';
  END IF;
  IF target_published_storage_path IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM storage.objects WHERE bucket_id = 'thesis_teasers_public' AND name = target_published_storage_path
  ) THEN RAISE EXCEPTION 'The promoted teaser thumbnail could not be verified' USING ERRCODE = '22023'; END IF;
  SELECT staging_storage_path INTO prior_path FROM public.thesis_media WHERE thesis_id = target_thesis_id AND asset_kind = 'teaser_thumbnail' FOR UPDATE;
  IF target_storage_path IS NULL THEN
    DELETE FROM public.thesis_media WHERE thesis_id = target_thesis_id AND asset_kind = 'teaser_thumbnail';
  ELSE
    INSERT INTO public.thesis_media (thesis_id, asset_kind, staging_storage_path, published_storage_path, mime_type, byte_size, uploaded_by_user_id)
    VALUES (target_thesis_id, 'teaser_thumbnail', target_storage_path, target_published_storage_path, target_mime_type, target_byte_size, auth.uid())
    ON CONFLICT (thesis_id, asset_kind) DO UPDATE SET staging_storage_path = EXCLUDED.staging_storage_path, mime_type = EXCLUDED.mime_type, byte_size = EXCLUDED.byte_size, published_storage_path = EXCLUDED.published_storage_path, uploaded_by_user_id = EXCLUDED.uploaded_by_user_id, updated_at = now();
  END IF;
  IF public.current_user_is_active(ARRAY['member']) THEN
    UPDATE public.thesis_review_comments SET member_revised_at = now()
    WHERE thesis_id = target_thesis_id AND field_key = 'teaser_thumbnail' AND member_revised_at IS NULL;
  END IF;
  INSERT INTO public.thesis_audits (thesis_id, changed_by_user_id, event, change_description, change_details)
  VALUES (target_thesis_id, auth.uid(), 'metadata_edited', 'Teaser thumbnail updated.', jsonb_build_object('previous_staging_storage_path', prior_path, 'staging_storage_path', target_storage_path));
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_submission_metadata_with_deployment(
  target_thesis_id bigint, payload jsonb, correction_reason text
)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public
AS $$
DECLARE before_link text; current_study_type text; next_study_type text; after_link text;
BEGIN
  IF NOT public.current_user_is_active(ARRAY['admin']) THEN RAISE EXCEPTION 'An active administrator account is required' USING ERRCODE = '42501'; END IF;
  SELECT deployment_link, study_type INTO before_link, current_study_type FROM public.theses WHERE id = target_thesis_id FOR UPDATE;
  IF current_study_type IS NULL THEN RAISE EXCEPTION 'Thesis was not found' USING ERRCODE = 'P0002'; END IF;
  next_study_type := COALESCE(NULLIF(payload->>'study_type',''), current_study_type);
  after_link := CASE WHEN next_study_type = 'thesis' THEN NULL ELSE NULLIF(btrim(payload->>'deployment_link'), '') END;
  IF after_link IS NOT NULL AND after_link !~* '^https?://' THEN RAISE EXCEPTION 'Deployment links must use http:// or https://' USING ERRCODE = '22023'; END IF;
  PERFORM public.admin_update_submission_metadata(target_thesis_id, payload - 'deployment_link', correction_reason);
  UPDATE public.theses SET deployment_link = after_link, updated_at = now() WHERE id = target_thesis_id;
  IF before_link IS DISTINCT FROM after_link THEN
    INSERT INTO public.thesis_audits (thesis_id, changed_by_user_id, event, change_description, change_details)
    VALUES (target_thesis_id, auth.uid(), 'metadata_edited', 'Administrator corrected deployment link. Reason: ' || btrim(correction_reason), jsonb_build_object('before', before_link, 'after', after_link));
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.accept_submission_with_teaser(
  target_thesis_id bigint, target_published_storage_path text
)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public
AS $$
BEGIN
  IF NOT public.current_user_is_active(ARRAY['admin']) THEN RAISE EXCEPTION 'An active administrator account is required' USING ERRCODE = '42501'; END IF;
  IF NULLIF(btrim(target_published_storage_path), '') IS NULL THEN RAISE EXCEPTION 'A published teaser path is required' USING ERRCODE = '22023'; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM storage.objects
    WHERE bucket_id = 'thesis_teasers_public' AND name = target_published_storage_path
  ) THEN RAISE EXCEPTION 'The promoted teaser thumbnail could not be verified' USING ERRCODE = '22023'; END IF;
  UPDATE public.thesis_media SET published_storage_path = target_published_storage_path, updated_at = now()
  WHERE thesis_id = target_thesis_id AND asset_kind = 'teaser_thumbnail';
  IF NOT FOUND THEN RAISE EXCEPTION 'Teaser thumbnail was not found' USING ERRCODE = 'P0002'; END IF;
  PERFORM public.set_review_status(target_thesis_id, 'accepted');
END;
$$;

REVOKE ALL ON FUNCTION public.update_flagged_submission_with_deployment(bigint, jsonb) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_update_submission_metadata_with_deployment(bigint, jsonb, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.replace_teaser_thumbnail(bigint, text, text, bigint, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.accept_submission_with_teaser(bigint, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_flagged_submission_with_deployment(bigint, jsonb) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_submission_metadata_with_deployment(bigint, jsonb, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.replace_teaser_thumbnail(bigint, text, text, bigint, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_submission_with_teaser(bigint, text) TO authenticated;
