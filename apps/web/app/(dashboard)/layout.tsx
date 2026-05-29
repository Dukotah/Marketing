import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

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
    .select("name, industry, website")
    .eq("owner_id", user.id)
    .single();

  // Detect first-time user: org name looks like the auto-generated email-derived default
  // The trigger sets name to full_name or email prefix — no industry set means not yet onboarded
  const isFirstTime = !profile?.industry;

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
      {isFirstTime && <OnboardingWizard />}
    </div>
  );
}
