import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch organization info
  const { data: profile } = await supabase
    .from("organizations")
    .select("name")
    .eq("owner_id", user.id)
    .single();

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
      <AppSidebar
        userName={user.user_metadata?.full_name}
        orgName={profile?.name}
        userEmail={user.email}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
