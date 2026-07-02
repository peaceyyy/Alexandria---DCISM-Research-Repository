    -- Function to atomically submit a thesis and all its related records.
    -- Ownership is always derived from the authenticated Supabase session.
    -- Drops the function if it exists to allow easy recreation.
    DROP FUNCTION IF EXISTS public.submit_thesis_transaction(jsonb);

    CREATE OR REPLACE FUNCTION public.submit_thesis_transaction(payload jsonb)
    RETURNS int AS $$
    DECLARE
        new_thesis_id int;
        authenticated_user_id uuid;
        current_calendar_date date;
        thesis_year int;
        thesis_publication_date date;
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

        IF NOT EXISTS (
            SELECT 1
            FROM public.users
            WHERE id = authenticated_user_id
        ) THEN
            RAISE EXCEPTION 'Authenticated user profile was not found'
                USING ERRCODE = '42501';
        END IF;

        thesis_year := (payload->>'year')::int;
        thesis_publication_date :=
            NULLIF(payload->>'publication_date', '')::date;

        IF thesis_year IS NULL
            OR thesis_year < 1
            OR thesis_year > EXTRACT(YEAR FROM current_calendar_date)::int
        THEN
            RAISE EXCEPTION 'Thesis year must be between 1 and the current year'
                USING ERRCODE = '22023';
        END IF;

        IF thesis_publication_date IS NULL
        THEN
            RAISE EXCEPTION 'Publication date is required'
                USING ERRCODE = '22023';
        END IF;

        IF thesis_publication_date > current_calendar_date
        THEN
            RAISE EXCEPTION 'Publication date cannot be later than today'
                USING ERRCODE = '22023';
        END IF;

        IF EXTRACT(YEAR FROM thesis_publication_date)::int <> thesis_year
        THEN
            RAISE EXCEPTION 'Thesis year must match the publication date year'
                USING ERRCODE = '22023';
        END IF;

        IF NULLIF(payload->>'file_url', '') IS NULL
        THEN
            RAISE EXCEPTION 'A thesis PDF is required'
                USING ERRCODE = '22023';
        END IF;

        IF payload->>'file_type' IS DISTINCT FROM 'application/pdf'
        THEN
            RAISE EXCEPTION 'Thesis file type must be application/pdf'
                USING ERRCODE = '22023';
        END IF;

        -- 1. Insert Thesis
        INSERT INTO public.theses (
            title, abstract, year, department, research_area,
            publication_date, publication_link, conference,
            recommendations, lessons_learned, submitted_by_user_id,
            review_status
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
            'for_review'
        )
        RETURNING id INTO new_thesis_id;

        -- 2. Insert Authors
        IF jsonb_typeof(payload->'authors') = 'array' THEN
            FOR author IN SELECT * FROM jsonb_array_elements(payload->'authors')
            LOOP
                INSERT INTO public.thesis_authors (
                    thesis_id, user_id, display_name, contribution_role, sort_order
                )
                VALUES (
                    new_thesis_id,
                    NULLIF(author->>'user_id', '')::uuid,
                    author->>'display_name',
                    author->>'contribution_role',
                    (author->>'sort_order')::int
                );
            END LOOP;
        END IF;

        -- 3. Insert Tags
        IF jsonb_typeof(payload->'tags') = 'array' THEN
            FOR tag IN SELECT * FROM jsonb_array_elements_text(payload->'tags')
            LOOP
                INSERT INTO public.thesis_tags (thesis_id, tag)
                VALUES (new_thesis_id, tag);
            END LOOP;
        END IF;

        -- 4. Insert File Metadata
        IF payload->>'file_url' IS NOT NULL THEN
            INSERT INTO public.thesis_files (
                thesis_id, file_url, file_type, is_primary
            )
            VALUES (
                new_thesis_id,
                payload->>'file_url',
                'application/pdf',
                true
            );
        END IF;

        -- Return the ID of the new thesis
        RETURN new_thesis_id;

    EXCEPTION WHEN OTHERS THEN
        -- If any error occurs, the transaction is automatically rolled back by Postgres
        RAISE;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

    -- Supabase RPC access is limited to authenticated sessions.
    REVOKE ALL ON FUNCTION public.submit_thesis_transaction(jsonb) FROM PUBLIC;
    REVOKE ALL ON FUNCTION public.submit_thesis_transaction(jsonb) FROM anon;
    GRANT EXECUTE ON FUNCTION public.submit_thesis_transaction(jsonb) TO authenticated;
