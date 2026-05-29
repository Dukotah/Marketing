import { createClient } from "@/lib/supabase/server";
import { MetricsCards } from "@/components/dashboard/MetricsCards";
import { Bot, Megaphone, ArrowRight, Plus, TrendingUp } from "lucide-react";
import Link from "next/link";
import { CampaignStatus } from "@launchpad/shared";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // Fetch real data
  const { data: org } = await supabase
    .from("organizations")
    .select("id")
    .eq("owner_id", user?.id ?? "")
    .single();

  const orgId = org?.id ?? null;

  const [{ data: recentCampaigns }, { data: activeCampaigns }] = await Promise.all([
    orgId
      ? supabase
          .from("campaigns")
          .select("id, name, status, channels, budget")
          .eq("organization_id", orgId)
          .order("created_at", { ascending: false })
          .limit(5)
      : Promise.resolve({ data: [] }),
    orgId
      ? supabase
          .from("campaigns")
          .select("id, budget")
          .eq("organization_id", orgId)
          .eq("status", CampaignStatus.ACTIVE)
      : Promise.resolve({ data: [] }),
  ]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {greeting}, {firstName} 👋
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Here&apos;s what&apos;s happening with your marketing today.
          </p>
        </div>
        <Link
          href="/dashboard/campaigns/new"
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Campaign
        </Link>
      </div>

      {/* Metrics */}
      <MetricsCards />

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Campaigns */}
        <div className="lg:col-span-2 bg-[#111111] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-white/50" />
              Recent Campaigns
            </h2>
            <Link
              href="/dashboard/campaigns"
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentCampaigns && recentCampaigns.length > 0 ? (
              recentCampaigns.map((campaign) => (
                <Link
                  key={campaign.id}
                  href={`/dashboard/campaigns/${campaign.id}`}
                  className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-xl border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        campaign.status === CampaignStatus.ACTIVE
                          ? "bg-green-400"
                          : campaign.status === CampaignStatus.PAUSED
                          ? "bg-yellow-400"
                          : campaign.status === CampaignStatus.DRAFT
                          ? "bg-white/30"
                          : "bg-blue-400"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium">{campaign.name}</p>
                      <p className="text-xs text-white/30">
                        {campaign.channels.join(", ") || "No channels"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium px-2 py-0.5 rounded-md bg-white/5 text-white/50">
                      {campaign.status}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-white/30 text-center py-6">
                No campaigns yet. Create your first one!
              </p>
            )}
          </div>

          <Link
            href="/dashboard/campaigns"
            className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 border border-white/5 hover:border-white/10 rounded-xl text-sm text-white/40 hover:text-white/60 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create new campaign
          </Link>
        </div>

        {/* AI Assistant CTA */}
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6 flex flex-col">
          <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4">
            <Bot className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Ask Max</h3>
          <p className="text-sm text-white/50 flex-1 leading-relaxed">
            Your AI marketing strategist is ready. Get campaign ideas, copy
            generation, or strategic advice — instantly.
          </p>
          <Link
            href="/dashboard/ai-assistant"
            className="mt-6 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2.5 rounded-xl text-sm transition-colors"
          >
            Start a conversation
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Quick prompts */}
          <div className="mt-4 space-y-2">
            {[
              "Build me an email campaign",
              "Analyze my top channel",
              "Write 5 ad headlines",
            ].map((prompt) => (
              <Link
                key={prompt}
                href={`/dashboard/ai-assistant?prompt=${encodeURIComponent(prompt)}`}
                className="block text-xs text-white/40 hover:text-white/60 bg-white/5 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
              >
                &ldquo;{prompt}&rdquo;
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Performance trend */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-white/50" />
            Performance This Month
          </h2>
          <Link
            href="/dashboard/analytics"
            className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            Full analytics <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <p className="text-sm text-white/40 mb-6">
          Revenue and conversions over the last 30 days
        </p>
        {/* Performance chart coming soon — requires channel API integrations */}
        <div className="h-40 flex flex-col items-center justify-center gap-2 border border-dashed border-white/10 rounded-xl">
          <TrendingUp className="w-8 h-8 text-white/20" />
          <p className="text-sm text-white/30">Performance chart coming soon</p>
          <p className="text-xs text-white/20">Connect your channels to see real data</p>
        </div>
      </div>
    </div>
  );
}
