-- Hotfix: avoid PostgreSQL CURRENT_ROLE keyword ambiguity in role updates.
-- Safe to run after docs/sql/admin_dashboard_backend.sql.

BEGIN;

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

REVOKE ALL ON FUNCTION public.admin_update_user_role(uuid, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_update_user_role(uuid, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_update_user_role(uuid, text)
  TO authenticated;

COMMIT;
