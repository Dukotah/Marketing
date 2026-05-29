"use client";

import { Campaign, CampaignStatus, MarketingChannel } from "@launchpad/shared";
import { CampaignCard } from "./CampaignCard";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Search, Filter, Plus } from "lucide-react";
import Link from "next/link";

interface CampaignListProps {
  campaigns: Campaign[];
}

const STATUS_FILTERS: { value: CampaignStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: CampaignStatus.ACTIVE, label: "Active" },
  { value: CampaignStatus.DRAFT, label: "Draft" },
  { value: CampaignStatus.SCHEDULED, label: "Scheduled" },
  { value: CampaignStatus.PAUSED, label: "Paused" },
  { value: CampaignStatus.COMPLETED, label: "Completed" },
];

export function CampaignList({ campaigns }: CampaignListProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "ALL">("ALL");
  const [channelFilter, setChannelFilter] = useState<MarketingChannel | "ALL">("ALL");

  const filtered = campaigns.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
    if (channelFilter !== "ALL" && !c.channels.includes(channelFilter)) return false;
    return true;
  });

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-2 bg-[#111111] border border-white/10 rounded-xl px-3 py-2 flex-1 min-w-48">
          <Search className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns..."
            className="bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none flex-1"
          />
        </div>

        <div className="flex items-center gap-1 bg-[#111111] border border-white/10 rounded-xl p-1">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                statusFilter === f.value
                  ? "bg-white/10 text-white"
                  : "text-white/40 hover:text-white"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <Link
          href="/dashboard/ai-assistant?prompt=Build+me+a+new+campaign"
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors ml-auto"
        >
          <Plus className="w-4 h-4" />
          New Campaign
        </Link>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Filter className="w-8 h-8 text-white/20 mb-3" />
          <p className="text-white/40 font-medium mb-1">No campaigns found</p>
          <p className="text-white/25 text-sm">
            {campaigns.length === 0
              ? "Create your first campaign with Max"
              : "Try adjusting your filters"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </div>
  );
}
