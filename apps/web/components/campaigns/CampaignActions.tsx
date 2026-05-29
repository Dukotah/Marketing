"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CampaignStatus } from "@launchpad/shared";

interface CampaignActionsProps {
  campaignId: string;
  status: CampaignStatus;
}

export function CampaignActions({ campaignId, status }: CampaignActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(newStatus: CampaignStatus) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/campaigns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: campaignId, status: newStatus }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Failed to update campaign");
      } else {
        router.refresh();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      {error && (
        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
      {status === CampaignStatus.DRAFT && (
        <button
          onClick={() => updateStatus(CampaignStatus.ACTIVE)}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
        >
          {loading ? "Launching…" : "Launch Campaign"}
        </button>
      )}
      {status === CampaignStatus.ACTIVE && (
        <button
          onClick={() => updateStatus(CampaignStatus.PAUSED)}
          disabled={loading}
          className="w-full bg-orange-500/10 hover:bg-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed text-orange-400 border border-orange-500/20 text-sm font-medium py-2.5 rounded-xl transition-colors"
        >
          {loading ? "Pausing…" : "Pause Campaign"}
        </button>
      )}
      {status === CampaignStatus.PAUSED && (
        <button
          onClick={() => updateStatus(CampaignStatus.ACTIVE)}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
        >
          {loading ? "Resuming…" : "Resume Campaign"}
        </button>
      )}
    </div>
  );
}
