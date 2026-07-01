"use server";

import { createClient } from "../supabase/server";
import { err, makeError, ok } from "./result";
import { requireSession, requireOwnership } from "./_guards";
import type {
  SubmitThesisPayload,
  updateThesisStatusPayload,
  RegisterFilePayload,
  ServiceResult,
  ThesisDetail,
} from "./types";

/**
 * GET /upload/theses/me
 * Returns a list of all theses submitted by the current user.
 * This allows members to see their own pending (`for_review`), `flagged`, or `accepted` submissions,
 * which do not appear in the public catalog until accepted.
 * Used by: "My Submissions" page or dashboard.
 */
export async function getOwnSubmissions(): Promise<ServiceResult<ThesisDetail[]>> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return err(makeError("UNAUTHENTICATED", "No active session"));
  }

  const { data: theses, error } = await supabase
    .from("theses")
    .select(`
      id,
      title,
      year,
      abstract,
      department,
      research_area,
      publication_date,
      publication_link,
      conference,
      recommendations,
      lessons_learned,
      review_status,
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
    `)
    .eq("submitted_by_user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    return err(makeError("SUPABASE_ERROR", error.message));
  }

  const thesisDetails: ThesisDetail[] = (theses || []).map((thesis: any) => ({
    id: thesis.id,
    title: thesis.title,
    year: thesis.year,
    abstract: thesis.abstract,
    abstract_preview: thesis.abstract?.substring(0, 200) || "",
    department: thesis.department,
    research_area: thesis.research_area,
    publication_date: thesis.publication_date,
    publication_link: thesis.publication_link,
    conference: thesis.conference,
    recommendations: thesis.recommendations,
    lessons_learned: thesis.lessons_learned,
    authors: thesis.thesis_authors.map((a: any) => ({
      id: a.id,
      user_id: a.user_id,
      display_name: a.display_name,
      contribution_role: a.contribution_role,
      sort_order: a.sort_order,
    })),
    tags: thesis.thesis_tags.map((t: any) => t.tag),
    file_access: {
      has_primary_file: thesis.thesis_files?.some((f: any) => f.is_primary) || false,
      requires_auth: false,
      download_path: `/theses/${thesis.id}/file`,
    },
    related_theses: [], // Empty for own submissions list
  }));

  return ok(thesisDetails);
}

/**
 * POST /upload/theses
 * Creates a new thesis record with review_status = 'for_review'.
 * Stores submitted_by_user_id from the current session.
 * Inserts authors and advisers into thesis_authors.
 * Used by: Submit Thesis page.
 */
export async function submitThesis(
  payload: SubmitThesisPayload,
): Promise<ServiceResult<{ id: number }>> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return err(makeError("UNAUTHENTICATED", "No active session"));
  }

  // Validate payload before any insertion
  if (!payload.authors || payload.authors.length === 0) {
    return err(makeError("VALIDATION_FAILED", "At least one author is required"));
  }

  if (!payload.tags || payload.tags.length === 0) {
    return err(makeError("VALIDATION_FAILED", "At least one tag is required"));
  }

  // Insert thesis
  const { data: thesis, error: thesisError } = await supabase
    .from("theses")
    .insert({
      title: payload.title,
      abstract: payload.abstract,
      year: payload.year,
      department: payload.department,
      research_area: payload.research_area,
      publication_date: payload.publication_date || null,
      publication_link: payload.publication_link || null,
      conference: payload.conference || null,
      recommendations: payload.recommendations || null,
      lessons_learned: payload.lessons_learned || null,
      submitted_by_user_id: user.id,
      review_status: "for_review",
    })
    .select()
    .single();

  if (thesisError || !thesis) {
    return err(makeError("SUPABASE_ERROR", thesisError?.message || "Failed to create thesis"));
  }

  // Insert authors (includes both authors and advisers with contribution_role)
  const authors = payload.authors.map((author) => ({
    thesis_id: thesis.id,
    user_id: author.user_id,
    display_name: author.display_name,
    contribution_role: author.contribution_role,
    sort_order: author.sort_order,
  }));

  const { error: authorsError } = await supabase
    .from("thesis_authors")
    .insert(authors);

  if (authorsError) {
    return err(makeError("SUPABASE_ERROR", authorsError.message));
  }

  // Insert tags
  const tags = payload.tags.map((tag) => ({
    thesis_id: thesis.id,
    tag,
  }));

  const { error: tagsError } = await supabase
    .from("thesis_tags")
    .insert(tags);

  if (tagsError) {
    return err(makeError("SUPABASE_ERROR", tagsError.message));
  }

  return ok({ id: thesis.id });
}

/**
 * POST /upload/theses/:id/files
 * Registers a PDF file URL for a thesis the member owns.
 * If is_primary = true, clears the primary flag on any existing primary file.
 * Used by: File attachment step of Submit Thesis page.
 */
export async function registerThesisFile(
  thesisId: number,
  payload: RegisterFilePayload,
): Promise<ServiceResult<null>> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return err(makeError("UNAUTHENTICATED", "No active session"));
  }

  // Check ownership
  const { data: thesis, error: fetchError } = await supabase
    .from("theses")
    .select("id, submitted_by_user_id")
    .eq("id", thesisId)
    .single();

  if (fetchError || !thesis) {
    return err(makeError("NOT_FOUND", "Thesis not found"));
  }

  // Allow admin/moderator to register files for any thesis
  const { data: profile } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdminOrModerator = profile?.role === "admin" || profile?.role === "moderator";

  if (!isAdminOrModerator && thesis.submitted_by_user_id !== user.id) {
    return err(makeError("FORBIDDEN", "You can only register files for your own submissions"));
  }

  // If setting as primary, clear existing primary
  if (payload.is_primary) {
    const { error: clearError } = await supabase
      .from("thesis_files")
      .update({ is_primary: false })
      .eq("thesis_id", thesisId);

    if (clearError) {
      return err(makeError("SUPABASE_ERROR", clearError.message));
    }
  }

  // Insert new file
  const { error: insertError } = await supabase
    .from("thesis_files")
    .insert({
      thesis_id: thesisId,
      file_url: payload.file_url,
      file_type: payload.file_type || "application/pdf",
      is_primary: payload.is_primary,
    });

  if (insertError) {
    return err(makeError("SUPABASE_ERROR", insertError.message));
  }

  return ok(null);
}

/**
 * PATCH /upload/theses/:id
 * Updates an existing thesis owned by the current user.
 * Members may only update their own submission when review_status = 'flagged'.
 * Ownership is checked against theses.submitted_by_user_id.
 * Accepts partial payloads.
 * Used by: Member edit-after-flag flow.
 */
export async function updateOwnSubmission(
  id: number,
  payload: updateThesisStatusPayload,
): Promise<ServiceResult<null>> {
  try {
    const user = await requireSession();
    await requireOwnership(id, user.id);

    const supabase = await createClient();
    const { data: thesis, error: fetchError } = await supabase
      .from("theses")
      .select("review_status")
      .eq("id", id)
      .single();

    if (fetchError || !thesis) {
      return err(makeError("NOT_FOUND", "Thesis not found"));
    }

    if (thesis.review_status !== "flagged") {
      return err(makeError("FORBIDDEN", "Only flagged submissions can be edited by members"));
    }

    // Update thesis basic fields
    const { error: updateError } = await supabase
      .from("theses")
      .update({
        title: payload.title,
        abstract: payload.abstract,
        year: payload.year,
        department: payload.department,
        research_area: payload.research_area,
        publication_date: payload.publication_date,
        publication_link: payload.publication_link,
        conference: payload.conference,
        recommendations: payload.recommendations,
        lessons_learned: payload.lessons_learned,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      return err(makeError("SUPABASE_ERROR", updateError.message));
    }

    // Handle authors/tags update if present
    if (payload.authors) {
      await supabase.from("thesis_authors").delete().eq("thesis_id", id);
      const { error: authorsError } = await supabase
        .from("thesis_authors")
        .insert(payload.authors.map((a) => ({ thesis_id: id, ...a })));
      if (authorsError) return err(makeError("SUPABASE_ERROR", authorsError.message));
    }

    if (payload.tags) {
      await supabase.from("thesis_tags").delete().eq("thesis_id", id);
      const { error: tagsError } = await supabase
        .from("thesis_tags")
        .insert(payload.tags.map((t) => ({ thesis_id: id, tag: t })));
      if (tagsError) return err(makeError("SUPABASE_ERROR", tagsError.message));
    }

    return ok(null);
  } catch (e: any) {
    return err(e);
  }
}
