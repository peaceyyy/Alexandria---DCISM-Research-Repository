import { createAdminClient } from "../supabase/admin";
import { DEPARTMENTS } from "../domain/departments";
import { RESEARCH_AREA_IDS } from "../domain/research-areas";
import { err, makeError, ok } from "./result";
import type {
  FilterOptions,
  ServiceResult,
  ThesisAuthor,
  ThesisCard,
  ThesisDetail,
  ThesisListParams,
} from "./types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mapAuthor(a: {
  id: number;
  user_id: string | null;
  display_name: string;
  contribution_role: string;
  sort_order: number | null;
}): ThesisAuthor {
  return {
    id: a.id,
    user_id: a.user_id,
    display_name: a.display_name,
    contribution_role: a.contribution_role as ThesisAuthor["contribution_role"],
    sort_order: a.sort_order,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToThesisCard(row: any): ThesisCard {
  return {
    id: row.id,
    title: row.title,
    year: row.year,
    abstract_preview: row.abstract?.substring(0, 400) ?? "",
    research_area: row.research_area ?? null,
    department: row.department,
    study_type: row.study_type,
    authors: (row.thesis_authors ?? []).map(mapAuthor),
    tags: (row.thesis_tags ?? []).map((t: { tag: string }) => t.tag),
  };
}

// ─── Public Browsing & Search ─────────────────────────────────────────────────

/**
 * Future HTTP equivalent: GET /api/theses
 * Returns a paginated, filtered list of accepted thesis cards.
 * Default sort: year DESC.
 * Used by: Browse/Search page.
 */
export async function getTheses(
  params?: ThesisListParams,
): Promise<ServiceResult<ThesisCard[]>> {
  try {
    const page = Math.max(1, params?.page ?? 1);
    const limit = Math.max(1, params?.limit ?? 20);

    const supabase = createAdminClient();

    const { data: searchResults, error: searchError } = await supabase.rpc("search_public_theses", {
      search_query: params?.q || null,
      year_from: params?.year_from || null,
      year_to: params?.year_to || null,
      departments: params?.department && params.department.length > 0 ? params.department : null,
      research_areas: params?.research_area && params.research_area.length > 0 ? params.research_area : null,
      study_types: params?.study_type && params.study_type.length > 0 ? params.study_type : null,
      tags: params?.tag && params.tag.length > 0 ? params.tag : null,
      page_number: page,
      page_size: limit,
    });

    if (searchError) {
      return err(makeError("SUPABASE_ERROR", searchError.message));
    }

    if (!searchResults || searchResults.length === 0) {
      return ok([], { total_count: 0, page, limit });
    }

    const thesisIds = searchResults.map((r: any) => r.thesis_id);
    const totalCount = Number(searchResults[0].total_count);

    const { data, error } = await supabase
      .from("theses")
      .select(`
        id,
        title,
        year,
        abstract,
        department,
        research_area,
        study_type,
        thesis_authors (
          id,
          user_id,
          display_name,
          contribution_role,
          sort_order
        ),
        thesis_tags (
          tag
        )
      `)
      .in("id", thesisIds);

    if (error) {
      return err(makeError("SUPABASE_ERROR", error.message));
    }

    const cardsMap = new Map((data ?? []).map(row => [row.id, mapToThesisCard(row)]));
    const cards: ThesisCard[] = thesisIds.map((id: any) => cardsMap.get(id)).filter(Boolean) as ThesisCard[];

    return ok(cards, { total_count: totalCount, page, limit });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to load theses.";
    return err(makeError("SUPABASE_ERROR", message));
  }
}

export async function getTagSuggestions(partialTag: string, limit: number = 10): Promise<ServiceResult<string[]>> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc("get_tag_suggestions", {
      partial_tag: partialTag,
      max_results: limit,
    });

    if (error) {
      return err(makeError("SUPABASE_ERROR", error.message));
    }

    const tags = (data ?? []).map((r: any) => r.tag);
    return ok(tags);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to load tag suggestions.";
    return err(makeError("SUPABASE_ERROR", message));
  }
}

/**
 * Future HTTP equivalent: GET /api/theses/:id
 * Returns the full detail payload for an accepted thesis, or a non-accepted
 * thesis when the signed-in viewer is its submitter.
 * Includes authors, tags, file_access, and related_theses.
 * Used by: Thesis Detail page.
 */
export async function getThesisById(
  id: number,
  viewerId?: string,
): Promise<ServiceResult<ThesisDetail>> {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("theses")
      .select(
        `
        id,
        title,
        review_status,
        submitted_by_user_id,
        year,
        abstract,
        department,
        research_area,
        publication_date,
        publication_link,
        conference,
        recommendations,
        lessons_learned,
        thesis_authors (
          id,
          user_id,
          display_name,
          contribution_role,
          sort_order
        ),
        thesis_tags (
          tag
        ),
        thesis_files (
          id,
          is_primary
        )
      `,
      )
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return err(makeError("NOT_FOUND", "Thesis not found."));
      }
      return err(makeError("SUPABASE_ERROR", error.message));
    }

    if (!data) {
      return err(makeError("NOT_FOUND", "Thesis not found."));
    }

    if (
      data.review_status !== "accepted"
      && data.submitted_by_user_id !== viewerId
    ) {
      return err(makeError("NOT_FOUND", "Thesis not found."));
    }

    const tags: string[] = (data.thesis_tags ?? []).map(
      (t: { tag: string }) => t.tag,
    );
    const hasPrimaryFile = (data.thesis_files ?? []).some(
      (f: { is_primary: boolean }) => f.is_primary,
    );

    // Related theses: fetch thesis_ids that share tags, ranked by overlap count
    let relatedTheses: ThesisCard[] = [];
    if (tags.length > 0) {
      const { data: tagRows } = await supabase
        .from("thesis_tags")
        .select("thesis_id")
        .in("tag", tags)
        .neq("thesis_id", id)
        .limit(50);

      if (tagRows && tagRows.length > 0) {
        const frequency: Record<number, number> = {};
        for (const row of tagRows) {
          frequency[row.thesis_id] = (frequency[row.thesis_id] ?? 0) + 1;
        }

        const relatedIds = Object.entries(frequency)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([tid]) => Number(tid));

        if (relatedIds.length > 0) {
          const { data: relatedData } = await supabase
            .from("theses")
            .select(
              `
              id,
              title,
              year,
              abstract,
              department,
              research_area,
              thesis_authors (
                id,
                user_id,
                display_name,
                contribution_role,
                sort_order
              ),
              thesis_tags (
                tag
              )
            `,
            )
            .eq("review_status", "accepted")
            .in("id", relatedIds)
            .limit(5);

          relatedTheses = (relatedData ?? []).map(mapToThesisCard);
        }
      }
    }

    const detail: ThesisDetail = {
      id: data.id,
      title: data.title,
      year: data.year,
      abstract: data.abstract ?? "",
      abstract_preview: data.abstract?.substring(0, 400) ?? "",
      department: data.department,
      research_area: data.research_area ?? null,
      publication_date: data.publication_date ?? null,
      publication_link: data.publication_link ?? null,
      conference: data.conference ?? null,
      recommendations: data.recommendations ?? null,
      lessons_learned: data.lessons_learned ?? null,
      reviewStatus: data.review_status as ThesisDetail["reviewStatus"],
      submittedByUserId: data.submitted_by_user_id,
      authors: (data.thesis_authors ?? []).map(mapAuthor),
      tags,
      file_access: {
        has_primary_file: hasPrimaryFile,
        preview_path: hasPrimaryFile ? `/api/theses/${id}/file` : null,
        download_path: hasPrimaryFile ? `/api/theses/${id}/file?download=1` : null,
        download_requires_auth: true,
      },
      related_theses: relatedTheses,
    };

    return ok(detail);
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to load thesis detail.";
    return err(makeError("SUPABASE_ERROR", message));
  }
}

/**
 * Future HTTP equivalent: GET /api/filters
 * Returns controlled department and research-area values plus distinct accepted years.
 * Used by: Browse page filter dropdowns.
 */
export async function getFilterOptions(): Promise<ServiceResult<FilterOptions>> {
  try {
    const supabase = createAdminClient();

    const [yearsResult] = await Promise.all([
      supabase
        .from("theses")
        .select("year")
        .eq("review_status", "accepted")
        .order("year", { ascending: false }),
    ]);

    if (yearsResult.error) {
      return err(makeError("SUPABASE_ERROR", yearsResult.error.message));
    }

    const research_areas = [...RESEARCH_AREA_IDS];

    const departments = [...DEPARTMENTS];

    const years: number[] = [
      ...new Set(
        (yearsResult.data ?? []).map((r) => r.year as number),
      ),
    ];

    return ok({ research_areas, departments, years });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to load filter options.";
    return err(makeError("SUPABASE_ERROR", message));
  }
}
