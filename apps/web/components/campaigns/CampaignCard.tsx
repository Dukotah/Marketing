import Link from "next/link";
import { Campaign, CampaignStatus } from "@launchpad/shared";
import { ChannelBadge } from "./ChannelBadge";
import { cn, formatCurrency, relativeTime } from "@/lib/utils";
import { BarChart3, ArrowUpRight } from "lucide-react";

const STATUS_CONFIG: Record<
  CampaignStatus,
  { label: string; color: string; dot: string }
> = {
  [CampaignStatus.DRAFT]: {
    label: "Draft",
    color: "text-white/40",
    dot: "bg-white/30",
  },
  [CampaignStatus.SCHEDULED]: {
    label: "Scheduled",
    color: "text-yellow-400",
    dot: "bg-yellow-400",
  },
  [CampaignStatus.ACTIVE]: {
    label: "Active",
    color: "text-green-400",
    dot: "bg-green-400",
  },
  [CampaignStatus.PAUSED]: {
    label: "Paused",
    color: "text-orange-400",
    dot: "bg-orange-400",
  },
  [CampaignStatus.COMPLETED]: {
    label: "Completed",
    color: "text-blue-400",
    dot: "bg-blue-400",
  },
  [CampaignStatus.ARCHIVED]: {
    label: "Archived",
    color: "text-white/20",
    dot: "bg-white/20",
  },
};

interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const status = STATUS_CONFIG[campaign.status];

  return (
    <Link
      href={`/dashboard/campaigns/${campaign.id}`}
      className="group block bg-[#111111] hover:bg-[#141414] border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className={cn("w-2 h-2 rounded-full flex-shrink-0", status.dot)} />
            <span className={cn("text-xs font-medium", status.color)}>
              {status.label}
            </span>
          </div>
          <h3 className="font-semibold truncate group-hover:text-blue-400 transition-colors">
            {campaign.name}
          </h3>
          {campaign.description && (
            <p className="text-sm text-white/40 truncate mt-0.5">
              {campaign.description}
            </p>
          )}
        </div>
        <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white/50 flex-shrink-0 ml-3 transition-colors" />
      </div>

      {/* Channels */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {campaign.channels.map((channel) => (
          <ChannelBadge key={channel} channel={channel} size="sm" />
        ))}
      </div>

      {/* Metrics */}
      {campaign.metrics && (
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/5">
          <div>
            <p className="text-xs text-white/30 mb-0.5">Reach</p>
            <p className="text-sm font-semibold">
              {(campaign.metrics.impressions / 1000).toFixed(1)}K
            </p>
          </div>
          <div>
            <p className="text-xs text-white/30 mb-0.5">CTR</p>
            <p className="text-sm font-semibold">
              {campaign.metrics.ctr.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-white/30 mb-0.5">Revenue</p>
            <p className="text-sm font-semibold">
              {formatCurrency(campaign.metrics.revenue)}
            </p>
          </div>
        </div>
      )}

      {!campaign.metrics && (
        <div className="flex items-center gap-2 text-xs text-white/25 pt-3 border-t border-white/5">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>No data yet</span>
          <span className="text-white/15 ml-auto">
            {relativeTime(campaign.created_at)}
          </span>
        </div>
      )}
    </Link>
  );
}
