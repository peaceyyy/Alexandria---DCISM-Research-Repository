import { redirect } from "next/navigation";

export default function MembersPage() {
  redirect("/admin/users?role=member");
}
