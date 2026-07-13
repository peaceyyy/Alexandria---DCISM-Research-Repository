import { getAdminThesisById } from "@/lib/services/admin-thesis-service";
import { getCurrentUser } from "@/lib/services/auth-service";
import { ReviewDetailClient } from "./_components/review-detail-client";

export default async function ReviewDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [thesisResult, userResult] = await Promise.all([
    getAdminThesisById(Number(id)),
    getCurrentUser(),
  ]);

  const role = userResult.data?.role ?? "moderator";

  if (thesisResult.error || !thesisResult.data) {
    return (
      <div style={{ padding: "32px" }}>
        <div style={{ borderRadius: 10, border: "1px dashed rgba(255,255,255,0.1)", background: "#1a1e23", padding: "32px 24px", textAlign: "center", fontSize: 14, color: "#5a6070" }}>
          Submission not found.
        </div>
      </div>
    );
  }

  return (
    <ReviewDetailClient
      initialSubmission={thesisResult.data}
      role={role as "admin" | "moderator" | "member"}
    />
  );
}
