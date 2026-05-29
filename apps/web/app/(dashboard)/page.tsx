import { createClient } from "@/lib/supabase/server";
import { MetricsCards } from "@/components/dashboard/MetricsCards";
import { Bot, Megaphone, ArrowRight, Plus, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

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
            {[
              {
                name: "Summer Email Blast",
                status: "ACTIVE",
                channels: ["Email"],
                reach: "12.4K",
                ctr: "3.2%",
              },
              {
                name: "Facebook Brand Awareness",
                status: "ACTIVE",
                channels: ["Facebook"],
                reach: "28.1K",
                ctr: "1.8%",
              },
              {
                name: "Google Search — Local",
                status: "PAUSED",
                channels: ["Google Ads"],
                reach: "8.7K",
                ctr: "4.1%",
              },
            ].map((campaign) => (
              <div
                key={campaign.name}
                className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-xl border border-white/5 hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      campaign.status === "ACTIVE"
                        ? "bg-green-400"
                        : "bg-yellow-400"
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium">{campaign.name}</p>
                    <p className="text-xs text-white/30">
                      {campaign.channels.join(", ")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{campaign.reach}</p>
                  <p className="text-xs text-white/30">{campaign.ctr} CTR</p>
                </div>
              </div>
            ))}
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
        <div className="h-40 flex items-end gap-1.5">
          {/* Simple bar chart visualization */}
          {[40, 55, 45, 65, 70, 58, 72, 68, 80, 75, 85, 78, 90, 82, 88, 76, 92, 85, 95, 88, 100, 92, 98, 85, 90, 95, 88, 92, 96, 100].map(
            (height, i) => (
              <div
                key={i}
                className="flex-1 bg-blue-500/30 hover:bg-blue-500/50 rounded-t transition-colors"
                style={{ height: `${height}%` }}
              />
            )
          )}
        </div>
        <div className="flex justify-between text-xs text-white/20 mt-2">
          <span>Jun 1</span>
          <span>Jun 15</span>
          <span>Jun 30</span>
        </div>
      </div>
    </div>
  );
}
