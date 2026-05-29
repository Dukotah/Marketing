"use client";

import { Campaign, CampaignStatus, MarketingChannel } from "@launchpad/shared";
import { CampaignCard } from "./CampaignCard";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Search, Filter, Plus, MoreHorizontal, Edit, Archive, Trash2, Loader2, AlertTriangle } from "lucide-react";
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

function ConfirmDeleteDialog({
  campaignName,
  onConfirm,
  onCancel,
  loading,
}: {
  campaignName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-[#111111] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="font-semibold">Delete Campaign</h3>
            <p className="text-xs text-white/40 mt-0.5">This cannot be undone</p>
          </div>
        </div>
        <p className="text-sm text-white/60 mb-6">
          Are you sure you want to delete <span className="text-white font-medium">&ldquo;{campaignName}&rdquo;</span>? All campaign data will be permanently removed.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 bg-[#1a1a1a] hover:bg-[#242424] border border-white/10 text-white/70 hover:text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CampaignCardWithMenu({
  campaign,
  onDelete,
}: {
  campaign: Campaign;
  onDelete: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="relative group/wrapper">
      <CampaignCard campaign={campaign} />
      {/* Menu button overlaid on top-right of card */}
      <div ref={menuRef} className="absolute top-3 right-3">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMenuOpen((o) => !o);
          }}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-[#111111] border border-white/10 text-white/30 hover:text-white hover:border-white/20 transition-all opacity-0 group-hover/wrapper:opacity-100 focus:opacity-100"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {menuOpen && (
          <div className="absolute top-full right-0 mt-1 w-44 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-20">
            <Link
              href={`/dashboard/campaigns/${campaign.id}`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit
            </Link>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMenuOpen(false);
                // Archive: PATCH status to archived
                fetch("/api/campaigns", {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ id: campaign.id, status: "archived" }),
                });
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Archive className="w-3.5 h-3.5" />
              Archive
            </button>
            <div className="border-t border-white/5 my-0.5" />
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setMenuOpen(false);
                onDelete(campaign.id);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export function CampaignList({ campaigns: initialCampaigns }: CampaignListProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "ALL">("ALL");
  const [channelFilter, setChannelFilter] = useState<MarketingChannel | "ALL">("ALL");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const filtered = campaigns.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (statusFilter !== "ALL" && c.status !== statusFilter) return false;
    if (channelFilter !== "ALL" && !c.channels.includes(channelFilter)) return false;
    return true;
  });

  async function handleDeleteConfirm() {
    if (!deletingId) return;
    setDeleteLoading(true);
    const res = await fetch(`/api/campaigns?id=${deletingId}`, { method: "DELETE" });
    if (res.ok) {
      setCampaigns((prev) => prev.filter((c) => c.id !== deletingId));
    }
    setDeleteLoading(false);
    setDeletingId(null);
  }

  const deletingCampaign = campaigns.find((c) => c.id === deletingId);

  return (
    <div>
      {deletingId && deletingCampaign && (
        <ConfirmDeleteDialog
          campaignName={deletingCampaign.name}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingId(null)}
          loading={deleteLoading}
        />
      )}

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
            <CampaignCardWithMenu
              key={campaign.id}
              campaign={campaign}
              onDelete={setDeletingId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
