import { createClient } from "@/lib/supabase/server";
import { CampaignList } from "@/components/campaigns/CampaignList";
import { Campaign } from "@launchpad/shared";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campaigns",
};

export default async function CampaignsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let campaigns: Campaign[] = [];

  if (user) {
    const { data } = await supabase
      .from("campaigns")
      .select("*")
      .order("created_at", { ascending: false });

    campaigns = (data as Campaign[]) || [];
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Campaigns</h1>
        <p className="text-white/40 text-sm mt-1">
          {campaigns.length === 0
            ? "Create your first campaign with AI assistance"
            : `${campaigns.length} campaign${campaigns.length === 1 ? "" : "s"} total`}
        </p>
      </div>
      <CampaignList campaigns={campaigns} />
    </div>
  );
}
