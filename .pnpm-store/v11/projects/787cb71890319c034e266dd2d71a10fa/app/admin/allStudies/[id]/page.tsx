import { redirect } from "next/navigation";

export default async function LegacyAllStudiesDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  redirect(`/admin/all-studies/${id}`);
}
