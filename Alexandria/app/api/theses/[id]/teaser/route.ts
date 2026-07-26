import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/services/auth-service";
import type { ReviewStatus } from "@/lib/services/types";
import { createAdminClient } from "@/lib/supabase/admin";
import { TEASER_PUBLIC_BUCKET, TEASER_STAGING_BUCKET } from "@/lib/upload/storage-helper";

type ThesisAccessRow = {
  review_status: ReviewStatus;
  submitted_by_user_id: string | null;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const thesisId = Number((await params).id);
  if (!Number.isSafeInteger(thesisId) || thesisId < 1) {
    return NextResponse.json({ error: "Invalid thesis identifier." }, { status: 400 });
  }

  let admin: ReturnType<typeof createAdminClient>;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json({ error: "Media access is not configured." }, { status: 500 });
  }

  const [principalResult, thesisResult, mediaResult] = await Promise.all([
    getCurrentUser(),
    admin.from("theses").select("review_status, submitted_by_user_id").eq("id", thesisId).maybeSingle(),
    admin
      .from("thesis_media")
      .select("staging_storage_path, published_storage_path")
      .eq("thesis_id", thesisId)
      .eq("asset_kind", "teaser_thumbnail")
      .maybeSingle(),
  ]);

  if (thesisResult.error || !thesisResult.data || mediaResult.error || !mediaResult.data?.staging_storage_path) {
    return NextResponse.json({ error: "A teaser thumbnail is not available." }, { status: 404 });
  }

  const thesis = thesisResult.data as ThesisAccessRow;
  const user = principalResult.data;
  const isReviewer = user?.role === "admin" || user?.role === "moderator";
  const isAdmin = user?.role === "admin";
  const isOwner = user?.id === thesis.submitted_by_user_id;
  const isAccepted = thesis.review_status === "accepted";
  const isTrashed = thesis.review_status === "trashed";
  const mayPreview = isAccepted || (isReviewer && (!isTrashed || isAdmin)) || (isOwner && !isTrashed);

  if (!mayPreview) {
    return NextResponse.json({ error: "You do not have access to this teaser thumbnail." }, { status: 403 });
  }

  if (isAccepted && mediaResult.data.published_storage_path) {
    const { data } = admin.storage
      .from(TEASER_PUBLIC_BUCKET)
      .getPublicUrl(mediaResult.data.published_storage_path);
    return NextResponse.redirect(data.publicUrl);
  }

  const { data: signed, error: signingError } = await admin.storage
    .from(TEASER_STAGING_BUCKET)
    .createSignedUrl(mediaResult.data.staging_storage_path, 60);
  if (signingError || !signed?.signedUrl) {
    return NextResponse.json({ error: "The teaser thumbnail could not be opened." }, { status: 502 });
  }

  const response = NextResponse.redirect(signed.signedUrl);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
