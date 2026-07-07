"use client";

import { useParams } from "next/navigation";
import { PublishedStudiesDetailPage } from "@/components/admin/published-studies-detail-page";

export default function PublishedStudiesDetailRoutePage() {
  const params = useParams<{ id: string }>();
  const submissionId = Number(params?.id ?? 0);

  return <PublishedStudiesDetailPage submissionId={submissionId} />;
}
