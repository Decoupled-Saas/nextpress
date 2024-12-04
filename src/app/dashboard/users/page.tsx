import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import UserManagement from "@/app/dashboard/users/user-management";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    redirect("/unauthorized");
  }

  const allUsers = await db.select().from(users);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <UserManagement initialUsers={allUsers} />
    </div>
  );
}
