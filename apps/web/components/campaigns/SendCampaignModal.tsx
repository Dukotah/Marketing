"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Send, Mail, Users, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface SendCampaignModalProps {
  campaignId: string;
  campaignName: string;
  subject: string;
  fromAddress: string;
  onClose: () => void;
}

export function SendCampaignModal({
  campaignId,
  campaignName,
  subject,
  fromAddress,
  onClose,
}: SendCampaignModalProps) {
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [loadingCount, setLoadingCount] = useState(true);

  const [testEmail, setTestEmail] = useState("");
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<number | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch("/api/subscribers");
      const json = await res.json();
      if (json.success) {
        const active = (json.data || []).filter((s: { is_active: boolean }) => s.is_active);
        setSubscriberCount(active.length);
      }
    } catch {
      setSubscriberCount(0);
    } finally {
      setLoadingCount(false);
    }
  }, []);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  async function handleSendTest(e: React.FormEvent) {
    e.preventDefault();
    if (!testEmail.trim()) return;
    setSendingTest(true);
    setTestResult(null);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/send-test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testEmail: testEmail.trim() }),
      });
      const json = await res.json();
      if (res.ok) {
        setTestResult({ ok: true, message: `Test email sent to ${testEmail}` });
      } else {
        setTestResult({ ok: false, message: json.error || "Failed to send test email." });
      }
    } finally {
      setSendingTest(false);
    }
  }

  async function handleSend() {
    setSending(true);
    setSendError(null);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/send`, {
        method: "POST",
      });
      const json = await res.json();
      if (res.ok) {
        setSent(json.sent);
      } else {
        setSendError(json.error || "Failed to send campaign.");
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#111111] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500/15 rounded-lg flex items-center justify-center">
              <Send className="w-4 h-4 text-blue-400" />
            </div>
            <h2 className="text-sm font-semibold">Send Email Campaign</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Success state */}
          {sent !== null ? (
            <div className="flex flex-col items-center text-center py-4 gap-3">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
              <div>
                <p className="text-base font-semibold">Campaign Sent!</p>
                <p className="text-white/50 text-sm mt-1">
                  Sent to {sent} subscriber{sent !== 1 ? "s" : ""}
                </p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 bg-[#1a1a1a] hover:bg-[#242424] border border-white/10 text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Campaign info */}
              <div className="space-y-3">
                <div className="bg-[#1a1a1a] rounded-xl px-4 py-3 space-y-2">
                  <div className="flex items-start gap-2">
                    <Mail className="w-3.5 h-3.5 text-white/30 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-white/30 mb-0.5">Campaign</p>
                      <p className="text-sm font-medium truncate">{campaignName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="w-3.5 h-3.5 text-white/30 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-white/30 mb-0.5">Subject</p>
                      <p className="text-sm text-white/80 truncate">{subject || "(no subject)"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Mail className="w-3.5 h-3.5 text-white/30 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-white/30 mb-0.5">From</p>
                      <p className="text-sm text-white/80 truncate">{fromAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="w-3.5 h-3.5 text-white/30 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-white/30 mb-0.5">Recipients</p>
                      <p className="text-sm font-medium">
                        {loadingCount ? (
                          <span className="text-white/30">Loading...</span>
                        ) : (
                          <span>
                            {subscriberCount ?? 0} active subscriber{subscriberCount !== 1 ? "s" : ""}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Test email */}
              <div>
                <p className="text-xs text-white/40 font-medium mb-2">Send Test Email</p>
                <form onSubmit={handleSendTest} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="test@example.com"
                    value={testEmail}
                    onChange={(e) => setTestEmail(e.target.value)}
                    className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50"
                  />
                  <button
                    type="submit"
                    disabled={sendingTest || !testEmail.trim()}
                    className="flex items-center gap-1.5 bg-[#1a1a1a] hover:bg-[#242424] border border-white/10 disabled:opacity-40 text-white/70 hover:text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
                  >
                    {sendingTest && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Send Test
                  </button>
                </form>
                {testResult && (
                  <p
                    className={`mt-2 text-xs flex items-center gap-1.5 ${
                      testResult.ok ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {testResult.ok ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5" />
                    )}
                    {testResult.message}
                  </p>
                )}
              </div>

              {/* Send error */}
              {sendError && (
                <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-400">{sendError}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={onClose}
                  className="flex-1 bg-[#1a1a1a] hover:bg-[#242424] border border-white/10 text-white/60 hover:text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  disabled={sending || subscriberCount === 0 || loadingCount}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      Send Campaign
                    </>
                  )}
                </button>
              </div>

              {!loadingCount && subscriberCount === 0 && (
                <p className="text-xs text-amber-400 text-center -mt-2">
                  No active subscribers. Add subscribers first.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
