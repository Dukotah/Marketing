"use client";

import { useEffect, useState, useCallback } from "react";
import { Users, Plus, Upload, Trash2, X, Loader2 } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  name: string | null;
  tags: string[];
  subscribed_at: string;
  is_active: boolean;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addName, setAddName] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/subscribers");
      const json = await res.json();
      if (json.success) setSubscribers(json.data || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setAddError("");
    if (!addEmail.trim()) {
      setAddError("Email is required.");
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: addEmail.trim(), name: addName.trim() || undefined }),
      });
      const json = await res.json();
      if (!res.ok) {
        setAddError(json.error || "Failed to add subscriber.");
      } else {
        setAddEmail("");
        setAddName("");
        setShowAddForm(false);
        showToast("Subscriber added successfully.");
        fetchSubscribers();
      }
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(email: string) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/subscribers?email=${encodeURIComponent(email)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        showToast("Subscriber removed.");
        setDeleteConfirm(null);
        fetchSubscribers();
      } else {
        const json = await res.json();
        showToast(json.error || "Failed to remove subscriber.", "error");
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-lg transition-all ${
            toast.type === "success"
              ? "bg-green-500/20 border border-green-500/30 text-green-400"
              : "bg-red-500/20 border border-red-500/30 text-red-400"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-500/15 rounded-xl flex items-center justify-center">
            <Users className="w-4.5 h-4.5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Subscribers</h1>
            <p className="text-white/40 text-sm">
              {loading ? "Loading..." : `${subscribers.length} total subscriber${subscribers.length !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast("CSV import coming soon!", "success")}
            className="flex items-center gap-2 bg-[#1a1a1a] hover:bg-[#242424] border border-white/10 text-white/60 hover:text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
          >
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
          <button
            onClick={() => { setShowAddForm(true); setAddError(""); }}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Subscriber
          </button>
        </div>
      </div>

      {/* Add Subscriber Form */}
      {showAddForm && (
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold">Add Subscriber</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-white/30 hover:text-white/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Email address *"
              value={addEmail}
              onChange={(e) => setAddEmail(e.target.value)}
              className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50"
              required
            />
            <input
              type="text"
              placeholder="Name (optional)"
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50"
            />
            <button
              type="submit"
              disabled={adding}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors"
            >
              {adding && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              Add
            </button>
          </form>
          {addError && <p className="mt-2 text-xs text-red-400">{addError}</p>}
        </div>
      )}

      {/* Table */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-white/30" />
          </div>
        ) : subscribers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-white/30">
            <Users className="w-8 h-8 mb-3" />
            <p className="text-sm">No subscribers yet</p>
            <p className="text-xs mt-1">Add your first subscriber to get started.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-white/30 text-xs font-medium px-5 py-3">Email</th>
                <th className="text-left text-white/30 text-xs font-medium px-5 py-3">Name</th>
                <th className="text-left text-white/30 text-xs font-medium px-5 py-3">Tags</th>
                <th className="text-left text-white/30 text-xs font-medium px-5 py-3">Date Added</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 font-medium">{sub.email}</td>
                  <td className="px-5 py-3 text-white/50">{sub.name || <span className="text-white/20">—</span>}</td>
                  <td className="px-5 py-3">
                    {sub.tags && sub.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {sub.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-white/20">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-white/40">
                    {new Date(sub.subscribed_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {deleteConfirm === sub.email ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs text-white/40">Confirm?</span>
                        <button
                          onClick={() => handleDelete(sub.email)}
                          disabled={deleting}
                          className="text-xs text-red-400 hover:text-red-300 font-medium"
                        >
                          {deleting ? "..." : "Yes"}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="text-xs text-white/40 hover:text-white/60"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(sub.email)}
                        className="text-white/20 hover:text-red-400 transition-colors p-1"
                        title="Remove subscriber"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
