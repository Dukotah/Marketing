"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";

interface DeleteCampaignButtonProps {
  campaignId: string;
  campaignName: string;
}

export function DeleteCampaignButton({ campaignId, campaignName }: DeleteCampaignButtonProps) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setLoading(true);
    setError(null);
    const res = await fetch(`/api/campaigns?id=${campaignId}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Failed to delete campaign");
      setLoading(false);
      return;
    }
    router.push("/dashboard/campaigns");
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="w-full flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors justify-center"
      >
        <Trash2 className="w-4 h-4" />
        Delete Campaign
      </button>

      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !loading && setShowDialog(false)}
          />
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
            <p className="text-sm text-white/60 mb-4">
              Are you sure you want to delete{" "}
              <span className="text-white font-medium">&ldquo;{campaignName}&rdquo;</span>?
              All campaign data will be permanently removed.
            </p>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-lg px-3 py-2 mb-4">
                {error}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowDialog(false)}
                disabled={loading}
                className="flex-1 bg-[#1a1a1a] hover:bg-[#242424] border border-white/10 text-white/70 hover:text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
