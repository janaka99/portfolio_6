import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/dashboard";
import { auth } from "@/auth";

export default async function AdminPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return <AdminDashboard user={session.user} />;
}
