CREATE OR REPLACE FUNCTION public.search_public_theses(
  search_query text DEFAULT NULL,
  year_from integer DEFAULT NULL,
  year_to integer DEFAULT NULL,
  departments text[] DEFAULT NULL,
  research_areas text[] DEFAULT NULL,
  study_types text[] DEFAULT NULL,
  tags text[] DEFAULT NULL,
  page_number integer DEFAULT 1,
  page_size integer DEFAULT 20
)
RETURNS TABLE (
  thesis_id bigint,
  total_count bigint
) AS $$
DECLARE
  offset_val integer := (page_number - 1) * page_size;
BEGIN
  RETURN QUERY
  WITH matching_theses AS (
    SELECT t.id, t.year
    FROM public.theses t
    WHERE t.review_status = 'accepted'
      AND (year_from IS NULL OR t.year >= year_from)
      AND (year_to IS NULL OR t.year <= year_to)
      AND (departments IS NULL OR coalesce(array_length(departments, 1), 0) = 0 OR t.department = ANY(departments))
      AND (study_types IS NULL OR coalesce(array_length(study_types, 1), 0) = 0 OR t.study_type = ANY(study_types))
      AND (research_areas IS NULL OR coalesce(array_length(research_areas, 1), 0) = 0 OR 
           (
             EXISTS (
               SELECT 1 FROM unnest(string_to_array(t.research_area, ',')) AS ra(val)
               WHERE trim(ra.val) = ANY(research_areas)
             )
           )
      )
      AND (
        search_query IS NULL OR trim(search_query) = '' OR
        t.title ILIKE '%' || search_query || '%' OR
        t.abstract ILIKE '%' || search_query || '%' OR
        EXISTS (
          SELECT 1 FROM public.thesis_authors a
          WHERE a.thesis_id = t.id AND a.display_name ILIKE '%' || search_query || '%'
        )
      )
      AND (
        tags IS NULL OR coalesce(array_length(tags, 1), 0) = 0 OR
        (
          SELECT count(*) FROM (
            SELECT unnest(tags) AS tag_req
            INTERSECT
            SELECT tg.tag FROM public.thesis_tags tg WHERE tg.thesis_id = t.id
          ) sub
        ) = array_length(tags, 1)
      )
  )
  SELECT 
    m.id AS thesis_id,
    (SELECT count(*) FROM matching_theses)::bigint AS total_count
  FROM matching_theses m
  ORDER BY m.year DESC, m.id DESC
  LIMIT page_size
  OFFSET offset_val;
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION public.get_tag_suggestions(
  partial_tag text,
  max_results integer DEFAULT 10
)
RETURNS TABLE (
  tag text
) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT tt.tag
  FROM public.thesis_tags tt
  JOIN public.theses t ON t.id = tt.thesis_id
  WHERE t.review_status = 'accepted'
    AND (partial_tag IS NULL OR trim(partial_tag) = '' OR tt.tag ILIKE '%' || partial_tag || '%')
  ORDER BY tt.tag ASC
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql STABLE;
