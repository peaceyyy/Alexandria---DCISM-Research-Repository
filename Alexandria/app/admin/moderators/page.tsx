import { redirect } from "next/navigation";

export default function ModeratorsPage() {
  redirect("/admin/users?role=moderator");
}
