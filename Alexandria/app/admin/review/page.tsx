import { getAdminTheses } from "@/lib/services/admin-thesis-service";
import { ReviewQueueClient } from "./_components/review-queue-client";

export default async function ReviewQueuePage() {
  const result = await getAdminTheses({ limit: 200 });
  const submissions = result.data ?? [];

  return <ReviewQueueClient submissions={submissions} />;
}
