import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Campaign, CampaignStatus } from "@launchpad/shared";
import { ChannelBadge } from "@/components/campaigns/ChannelBadge";
import { CampaignActions } from "@/components/campaigns/CampaignActions";
import { formatCurrency, relativeTime } from "@/lib/utils";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  DollarSign,
  Users,
  MousePointer,
  TrendingUp,
  Edit,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: `Campaign ${id}` };
}

export default async function CampaignDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .single();

  if (!campaign) {
    notFound();
  }

  const c = campaign as Campaign;

  const statusColors: Record<CampaignStatus, string> = {
    [CampaignStatus.DRAFT]: "text-white/40 bg-white/5",
    [CampaignStatus.SCHEDULED]: "text-yellow-400 bg-yellow-500/10",
    [CampaignStatus.ACTIVE]: "text-green-400 bg-green-500/10",
    [CampaignStatus.PAUSED]: "text-orange-400 bg-orange-500/10",
    [CampaignStatus.COMPLETED]: "text-blue-400 bg-blue-500/10",
    [CampaignStatus.ARCHIVED]: "text-white/20 bg-white/5",
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/dashboard/campaigns"
          className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{c.name}</h1>
            <span
              className={`text-xs font-medium px-2.5 py-1 rounded-lg ${statusColors[c.status]}`}
            >
              {c.status}
            </span>
          </div>
          {c.description && (
            <p className="text-white/40 text-sm mt-0.5">{c.description}</p>
          )}
        </div>
        <button className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#242424] border border-white/10 text-white/60 hover:text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
          <Edit className="w-4 h-4" />
          Edit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-5">
          {/* Channels */}
          <div className="bg-[#111111] border border-white/5 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white/60 mb-3">Channels</h2>
            <div className="flex flex-wrap gap-2">
              {c.channels.map((ch) => (
                <ChannelBadge key={ch} channel={ch} />
              ))}
            </div>
          </div>

          {/* Content */}
          {c.content && (
            <div className="bg-[#111111] border border-white/5 rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-white/60 mb-4">
                Campaign Content
              </h2>
              <div className="space-y-4">
                {c.content.subject && (
                  <div>
                    <p className="text-xs text-white/30 mb-1">Subject Line</p>
                    <p className="text-sm font-medium bg-[#1a1a1a] rounded-lg px-3 py-2">
                      {c.content.subject}
                    </p>
                  </div>
                )}
                {c.content.headline && (
                  <div>
                    <p className="text-xs text-white/30 mb-1">Headline</p>
                    <p className="text-sm font-medium bg-[#1a1a1a] rounded-lg px-3 py-2">
                      {c.content.headline}
                    </p>
                  </div>
                )}
                {c.content.body && (
                  <div>
                    <p className="text-xs text-white/30 mb-1">Body Copy</p>
                    <p className="text-sm text-white/70 bg-[#1a1a1a] rounded-lg px-3 py-3 leading-relaxed whitespace-pre-wrap">
                      {c.content.body}
                    </p>
                  </div>
                )}
                {c.content.cta_text && (
                  <div>
                    <p className="text-xs text-white/30 mb-1">Call to Action</p>
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm px-4 py-2 rounded-lg">
                      {c.content.cta_text}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metrics */}
          {c.metrics && (
            <div className="bg-[#111111] border border-white/5 rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-white/60 mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Performance
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: Users,
                    label: "Impressions",
                    value: c.metrics.impressions.toLocaleString(),
                    color: "text-blue-400",
                    bg: "bg-blue-500/10",
                  },
                  {
                    icon: MousePointer,
                    label: "Clicks",
                    value: c.metrics.clicks.toLocaleString(),
                    color: "text-purple-400",
                    bg: "bg-purple-500/10",
                  },
                  {
                    icon: TrendingUp,
                    label: "Conversions",
                    value: c.metrics.conversions.toLocaleString(),
                    color: "text-green-400",
                    bg: "bg-green-500/10",
                  },
                  {
                    icon: DollarSign,
                    label: "Spend",
                    value: formatCurrency(c.metrics.spend),
                    color: "text-red-400",
                    bg: "bg-red-500/10",
                  },
                  {
                    icon: DollarSign,
                    label: "Revenue",
                    value: formatCurrency(c.metrics.revenue),
                    color: "text-yellow-400",
                    bg: "bg-yellow-500/10",
                  },
                  {
                    icon: BarChart3,
                    label: "ROAS",
                    value: `${c.metrics.roas.toFixed(1)}x`,
                    color: "text-cyan-400",
                    bg: "bg-cyan-500/10",
                  },
                ].map((metric) => {
                  const Icon = metric.icon;
                  return (
                    <div
                      key={metric.label}
                      className="bg-[#1a1a1a] rounded-xl p-3"
                    >
                      <div
                        className={`w-7 h-7 ${metric.bg} rounded-lg flex items-center justify-center mb-2`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${metric.color}`} />
                      </div>
                      <p className="text-xs text-white/30 mb-0.5">
                        {metric.label}
                      </p>
                      <p className="text-sm font-bold">{metric.value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Details */}
          <div className="bg-[#111111] border border-white/5 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white/60 mb-4">Details</h2>
            <div className="space-y-3">
              {c.target_audience && (
                <div>
                  <p className="text-xs text-white/30 mb-1">Target Audience</p>
                  <p className="text-sm text-white/70">{c.target_audience}</p>
                </div>
              )}
              {c.goals && (
                <div>
                  <p className="text-xs text-white/30 mb-1">Goals</p>
                  <p className="text-sm text-white/70">{c.goals}</p>
                </div>
              )}
              {c.budget && (
                <div>
                  <p className="text-xs text-white/30 mb-1 flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    Budget
                  </p>
                  <p className="text-sm font-medium">{formatCurrency(c.budget)}</p>
                </div>
              )}
              {c.schedule && (
                <div>
                  <p className="text-xs text-white/30 mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Schedule
                  </p>
                  <p className="text-sm text-white/70">
                    {new Date(c.schedule.start_date).toLocaleDateString()}
                    {c.schedule.end_date &&
                      ` → ${new Date(c.schedule.end_date).toLocaleDateString()}`}
                  </p>
                </div>
              )}
              <div>
                <p className="text-xs text-white/30 mb-1">Created</p>
                <p className="text-sm text-white/50">{relativeTime(c.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-[#111111] border border-white/5 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white/60 mb-3">Actions</h2>
            <div className="space-y-2">
              <CampaignActions campaignId={c.id} status={c.status} />
              <Link
                href={`/dashboard/ai-assistant?prompt=Help+me+optimize+my+campaign+${encodeURIComponent(c.name)}`}
                className="block w-full text-center bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 text-sm font-medium py-2.5 rounded-xl transition-colors"
              >
                Ask Max to optimize
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
