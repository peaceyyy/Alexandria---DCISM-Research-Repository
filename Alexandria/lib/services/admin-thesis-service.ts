"use server";

import { createClient } from "../supabase/server";
import { createAdminClient } from "../supabase/admin";
import { err, makeError, normalizeServiceError, ok } from "./result";
import { requireRole } from "./_guards";
import type {
  AdminThesisListParams,
  AdminThesisRow,
  ServiceResult,
} from "./types";
import type { ReviewSubmission } from "@/components/review/types";

// ─── List ─────────────────────────────────────────────────────────────────────

/**
 * Future HTTP equivalent: GET /api/admin/theses
 * Returns paginated thesis rows for the review dashboard.
 * Excludes trashed unless review_status = 'trashed' is explicitly requested.
 * Used by: Admin Review Queue page.
 */
export async function getAdminTheses(
  params?: AdminThesisListParams,
): Promise<ServiceResult<AdminThesisRow[]>> {
  try {
    await requireRole(["admin", "moderator"]);
    // Use admin client so RLS doesn't filter out for_review/flagged rows
    const supabase = createAdminClient();

    const page = Math.max(1, params?.page ?? 1);
    const limit = Math.max(1, params?.limit ?? 50);
    const offset = (page - 1) * limit;

    let query = supabase
      .from("theses")
      .select(
        "id, title, review_status, year, updated_at, submitted_by_user_id, study_type",
        { count: "exact" },
      )
      .order("updated_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (params?.review_status) {
      query = query.eq("review_status", params.review_status);
    } else {
      query = query.neq("review_status", "trashed");
    }

    const { data, error, count } = await query;

    if (error) {
      return err(makeError("SUPABASE_ERROR", error.message));
    }

    const rows: AdminThesisRow[] = (data ?? []).map((row) => ({
      id: row.id,
      title: row.title,
      review_status: row.review_status,
      year: row.year,
      updated_at: row.updated_at,
      submitted_by_user_id: row.submitted_by_user_id ?? null,
      study_type: row.study_type,
    }));

    return ok(rows, { total_count: count ?? 0, page, limit });
  } catch (e) {
    return err(normalizeServiceError(e, "Could not load the review queue."));
  }
}

// ─── Detail ───────────────────────────────────────────────────────────────────

/**
 * Returns the full ReviewSubmission shape for a single thesis.
 * Joins authors, tags, the primary file, and audit events.
 * Used by: Admin Review Detail page.
 */
export async function getAdminThesisById(
  id: number,
): Promise<ServiceResult<ReviewSubmission>> {
  try {
    await requireRole(["admin", "moderator"]);
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("theses")
      .select(
        `
        id,
        title,
        abstract,
        department,
        study_type,
        publication_date,
        publication_link,
        research_area,
        recommendations,
        lessons_learned,
        review_status,
        created_at,
        thesis_authors (
          display_name,
          contribution_role
        ),
        thesis_tags (
          tag
        ),
        thesis_files (
          storage_path,
          file_type,
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

    const { data: auditRows } = await supabase
      .from("thesis_audits")
      .select("id, thesis_id, change_description, changed_by_user_id, updated_at")
      .eq("thesis_id", id)
      .order("updated_at", { ascending: false });

    const authors: string[] = (data.thesis_authors ?? [])
      .filter((a: { contribution_role: string }) => a.contribution_role === "author")
      .map((a: { display_name: string }) => a.display_name);

    const advisers: string[] = (data.thesis_authors ?? [])
      .filter((a: { contribution_role: string }) => a.contribution_role === "adviser")
      .map((a: { display_name: string }) => a.display_name);

    const tags: string[] = (data.thesis_tags ?? []).map(
      (t: { tag: string }) => t.tag,
    );

    const primaryFileRow =
      (data.thesis_files ?? []).find((f: { is_primary: boolean }) => f.is_primary) ?? null;

    const primaryFile = primaryFileRow
      ? {
          fileName: primaryFileRow.storage_path.split("/").pop() ?? "thesis.pdf",
          fileSize: "",
          pdfUrl: `/api/theses/${id}/file`,
        }
      : null;

    const auditEvents = (auditRows ?? []).map(
      (row: {
        id: number;
        thesis_id: number;
        change_description: string | null;
        changed_by_user_id: string;
        updated_at: string;
      }) => ({
        id: row.id,
        thesisId: row.thesis_id,
        event: "status_changed" as const,
        description: row.change_description ?? "Status updated.",
        createdByName: row.changed_by_user_id,
        createdAt: row.updated_at,
      }),
    );

    const submission: ReviewSubmission = {
      id: data.id,
      title: data.title,
      authors,
      advisers,
      department: data.department,
      studyType: data.study_type,
      publicationDate: data.publication_date ?? "",
      publicationLink: data.publication_link ?? null,
      researchArea: data.research_area ?? null,
      tags,
      abstract: data.abstract ?? "",
      recommendations: data.recommendations ?? null,
      lessonsLearned: data.lessons_learned ?? null,
      submittedAt: data.created_at,
      reviewStatus: data.review_status,
      primaryFile,
      fieldComments: [],
      auditEvents,
    };

    return ok(submission);
  } catch (e) {
    return err(normalizeServiceError(e, "Could not load the thesis for review."));
  }
}

// ─── Decision Actions ─────────────────────────────────────────────────────────

export async function acceptThesis(id: number): Promise<ServiceResult<null>> {
  try {
    const actor = await requireRole(["admin", "moderator"]);
    const db = createAdminClient();

    const { error } = await db
      .from("theses")
      .update({ review_status: "accepted", updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) return err(makeError("SUPABASE_ERROR", error.message));

    await db.from("thesis_audits").insert({
      thesis_id: id,
      changed_by_user_id: actor.id,
      change_description: "Submission approved for publication.",
    });

    return ok(null);
  } catch (e) {
    return err(normalizeServiceError(e, "Could not approve the thesis."));
  }
}

export async function flagThesis(
  id: number,
  reason?: string,
): Promise<ServiceResult<null>> {
  try {
    const actor = await requireRole(["admin", "moderator"]);
    const db = createAdminClient();

    const { error } = await db
      .from("theses")
      .update({ review_status: "flagged", updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) return err(makeError("SUPABASE_ERROR", error.message));

    await db.from("thesis_audits").insert({
      thesis_id: id,
      changed_by_user_id: actor.id,
      change_description: reason ?? "Submission flagged for member revision.",
    });

    return ok(null);
  } catch (e) {
    return err(normalizeServiceError(e, "Could not flag the thesis."));
  }
}

export async function trashThesis(id: number): Promise<ServiceResult<null>> {
  try {
    const actor = await requireRole(["admin", "moderator"]);
    const db = createAdminClient();

    const { error } = await db
      .from("theses")
      .update({ review_status: "trashed", updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) return err(makeError("SUPABASE_ERROR", error.message));

    await db.from("thesis_audits").insert({
      thesis_id: id,
      changed_by_user_id: actor.id,
      change_description: "Submission moved to trash.",
    });

    return ok(null);
  } catch (e) {
    return err(normalizeServiceError(e, "Could not trash the thesis."));
  }
}

export async function unflagThesis(id: number): Promise<ServiceResult<null>> {
  try {
    const actor = await requireRole(["admin", "moderator"]);
    const db = createAdminClient();

    const { error } = await db
      .from("theses")
      .update({ review_status: "for_review", updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) return err(makeError("SUPABASE_ERROR", error.message));

    await db.from("thesis_audits").insert({
      thesis_id: id,
      changed_by_user_id: actor.id,
      change_description: "Flag removed — submission returned to pending review.",
    });

    return ok(null);
  } catch (e) {
    return err(normalizeServiceError(e, "Could not remove the flag."));
  }
}
