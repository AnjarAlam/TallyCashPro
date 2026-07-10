"use client";
import UpdateUserForm from "@/components/form/auth/profile-update-form";
import { useAuth } from "@/hooks";
import { DashboardSubLayout } from "@/layout";

export default function Page() {
  const { user } = useAuth();
  if (user)
    return (
      <DashboardSubLayout headerTitle="Profile">
        <UpdateUserForm userData={user} />
      </DashboardSubLayout>
    );
  return null;
}
