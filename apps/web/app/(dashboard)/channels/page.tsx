"use client";

import { useState, useEffect } from "react";
import { MarketingChannel } from "@launchpad/shared";
import { CheckCircle2, ExternalLink, AlertCircle, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

const CHANNELS = [
  {
    id: MarketingChannel.EMAIL,
    name: "Email (Resend)",
    description: "Send transactional and marketing emails",
    icon: "📧",
    color: "bg-blue-500/10 border-blue-500/20",
    buttonColor: "bg-blue-500 hover:bg-blue-600",
    isEmailChannel: true,
  },
  {
    id: MarketingChannel.SOCIAL_FACEBOOK,
    name: "Facebook Pages",
    description: "Manage Facebook page posts and ads",
    icon: "👥",
    color: "bg-indigo-500/10 border-indigo-500/20",
    buttonColor: "bg-indigo-500 hover:bg-indigo-600",
    isEmailChannel: false,
  },
  {
    id: MarketingChannel.SOCIAL_INSTAGRAM,
    name: "Instagram Business",
    description: "Post content and run Instagram ads",
    icon: "📸",
    color: "bg-pink-500/10 border-pink-500/20",
    buttonColor:
      "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600",
    isEmailChannel: false,
  },
  {
    id: MarketingChannel.GOOGLE_ADS,
    name: "Google Ads",
    description: "Run search, display, and local ads",
    icon: "🔍",
    color: "bg-yellow-500/10 border-yellow-500/20",
    buttonColor: "bg-yellow-500 hover:bg-yellow-600",
    isEmailChannel: false,
  },
  {
    id: MarketingChannel.SMS,
    name: "SMS / Text",
    description: "Send promotional and transactional SMS",
    icon: "💬",
    color: "bg-green-500/10 border-green-500/20",
    buttonColor: "bg-green-500 hover:bg-green-600",
    isEmailChannel: false,
  },
  {
    id: MarketingChannel.SEO,
    name: "SEO Tools",
    description: "Track rankings and optimize content",
    icon: "📈",
    color: "bg-purple-500/10 border-purple-500/20",
    buttonColor: "bg-purple-500 hover:bg-purple-600",
    isEmailChannel: false,
  },
  {
    id: MarketingChannel.LOCAL_LISTINGS,
    name: "Google Business Profile",
    description: "Manage your local business listing",
    icon: "📍",
    color: "bg-cyan-500/10 border-cyan-500/20",
    buttonColor: "bg-cyan-500 hover:bg-cyan-600",
    isEmailChannel: false,
  },
];

interface ChannelState {
  isConnected: boolean;
  accountName: string | null;
}

type ChannelStateMap = Record<string, ChannelState>;

interface EmailModalState {
  open: boolean;
  fromName: string;
  replyToEmail: string;
  saving: boolean;
}

interface WaitlistModalState {
  open: boolean;
  channelId: string;
  channelName: string;
  email: string;
  saving: boolean;
  success: boolean;
}

export default function ChannelsPage() {
  const [channelStates, setChannelStates] = useState<ChannelStateMap>({});
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  const [emailModal, setEmailModal] = useState<EmailModalState>({
    open: false,
    fromName: "",
    replyToEmail: "",
    saving: false,
  });

  const [waitlistModal, setWaitlistModal] = useState<WaitlistModalState>({
    open: false,
    channelId: "",
    channelName: "",
    email: "",
    saving: false,
    success: false,
  });

  useEffect(() => {
    fetchConnections();
  }, []);

  async function fetchConnections() {
    setLoading(true);
    try {
      const res = await fetch("/api/channels");
      if (!res.ok) throw new Error("Failed to fetch");
      const { data } = await res.json();
      const map: ChannelStateMap = {};
      for (const conn of data ?? []) {
        map[conn.channel] = {
          isConnected: conn.is_connected,
          accountName: conn.account_name ?? null,
        };
      }
      setChannelStates(map);
    } catch {
      // silently fail — channels will show as disconnected
    } finally {
      setLoading(false);
    }
  }

  function openConnectModal(channel: (typeof CHANNELS)[number]) {
    if (channel.isEmailChannel) {
      setEmailModal({ open: true, fromName: "", replyToEmail: "", saving: false });
    } else {
      setWaitlistModal({
        open: true,
        channelId: channel.id,
        channelName: channel.name,
        email: "",
        saving: false,
        success: false,
      });
    }
  }

  async function handleEmailConnect() {
    if (!emailModal.fromName.trim() || !emailModal.replyToEmail.trim()) return;
    setEmailModal((m) => ({ ...m, saving: true }));
    try {
      const res = await fetch("/api/channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: MarketingChannel.EMAIL,
          metadata: {
            fromName: emailModal.fromName.trim(),
            replyToEmail: emailModal.replyToEmail.trim(),
          },
        }),
      });
      if (!res.ok) throw new Error("Failed to connect");
      setChannelStates((prev) => ({
        ...prev,
        [MarketingChannel.EMAIL]: {
          isConnected: true,
          accountName: emailModal.replyToEmail.trim(),
        },
      }));
      setEmailModal({ open: false, fromName: "", replyToEmail: "", saving: false });
    } catch {
      setEmailModal((m) => ({ ...m, saving: false }));
    }
  }

  async function handleWaitlistJoin() {
    if (!waitlistModal.email.trim()) return;
    setWaitlistModal((m) => ({ ...m, saving: true }));
    try {
      const res = await fetch("/api/channels/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: waitlistModal.channelId,
          email: waitlistModal.email.trim(),
        }),
      });
      if (!res.ok) throw new Error("Failed to join waitlist");
      setWaitlistModal((m) => ({ ...m, saving: false, success: true }));
    } catch {
      setWaitlistModal((m) => ({ ...m, saving: false }));
    }
  }

  async function handleDisconnect(channelId: string) {
    setDisconnecting(channelId);
    try {
      await fetch("/api/channels", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel: channelId }),
      });
      setChannelStates((prev) => ({
        ...prev,
        [channelId]: { isConnected: false, accountName: null },
      }));
    } finally {
      setDisconnecting(null);
    }
  }

  const connected = CHANNELS.filter((c) => channelStates[c.id]?.isConnected);
  const notConnected = CHANNELS.filter((c) => !channelStates[c.id]?.isConnected);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Marketing Channels</h1>
        <p className="text-white/40 text-sm mt-1">
          Connect your marketing platforms to Launchpad
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-white/30">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading channels...
        </div>
      ) : (
        <>
          {/* Connected */}
          {connected.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-white/60 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                Connected ({connected.length})
              </h2>
              <div className="space-y-3">
                {connected.map((channel) => (
                  <div
                    key={channel.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border",
                      channel.color
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{channel.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{channel.name}</p>
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        </div>
                        {channelStates[channel.id]?.accountName && (
                          <p className="text-sm text-white/50">
                            {channelStates[channel.id].accountName}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDisconnect(channel.id)}
                        disabled={disconnecting === channel.id}
                        className="text-sm text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {disconnecting === channel.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Disconnect"
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Not connected */}
          {notConnected.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-white/60 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-white/30" />
                Available to Connect ({notConnected.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {notConnected.map((channel) => (
                  <div
                    key={channel.id}
                    className="bg-[#111111] border border-white/5 hover:border-white/10 rounded-2xl p-5 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-2xl">{channel.icon}</span>
                    </div>
                    <h3 className="font-medium mb-1">{channel.name}</h3>
                    <p className="text-sm text-white/40 mb-4">{channel.description}</p>
                    <button
                      onClick={() => openConnectModal(channel)}
                      className={cn(
                        "w-full text-white text-sm font-medium py-2 rounded-xl transition-all flex items-center justify-center gap-2",
                        channel.buttonColor
                      )}
                    >
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Email Connect Modal */}
      {emailModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Connect Email</h2>
              <button
                onClick={() =>
                  setEmailModal({ open: false, fromName: "", replyToEmail: "", saving: false })
                }
                className="text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-white/50 mb-5">
              Configure your email sender details. These will appear as the sender on all
              outgoing emails.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  From Name
                </label>
                <input
                  type="text"
                  placeholder="Your Business Name"
                  value={emailModal.fromName}
                  onChange={(e) =>
                    setEmailModal((m) => ({ ...m, fromName: e.target.value }))
                  }
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  Reply-To Email
                </label>
                <input
                  type="email"
                  placeholder="hello@yourbusiness.com"
                  value={emailModal.replyToEmail}
                  onChange={(e) =>
                    setEmailModal((m) => ({ ...m, replyToEmail: e.target.value }))
                  }
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() =>
                  setEmailModal({ open: false, fromName: "", replyToEmail: "", saving: false })
                }
                className="flex-1 py-2 rounded-xl border border-white/10 text-sm text-white/60 hover:text-white hover:border-white/20 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEmailConnect}
                disabled={
                  emailModal.saving ||
                  !emailModal.fromName.trim() ||
                  !emailModal.replyToEmail.trim()
                }
                className="flex-1 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {emailModal.saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect Email"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Waitlist Modal */}
      {waitlistModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {waitlistModal.channelName} — Coming Soon
              </h2>
              <button
                onClick={() =>
                  setWaitlistModal((m) => ({ ...m, open: false, success: false }))
                }
                className="text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {waitlistModal.success ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6 text-green-400" />
                </div>
                <p className="font-medium mb-1">You're on the list!</p>
                <p className="text-sm text-white/50">
                  We'll email you when {waitlistModal.channelName} is ready.
                </p>
                <button
                  onClick={() =>
                    setWaitlistModal((m) => ({ ...m, open: false, success: false }))
                  }
                  className="mt-5 px-5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm transition-colors"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-white/50 mb-5">
                  We're building this integration now. Join the waitlist and we'll notify
                  you the moment it's ready.
                </p>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={waitlistModal.email}
                    onChange={(e) =>
                      setWaitlistModal((m) => ({ ...m, email: e.target.value }))
                    }
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() =>
                      setWaitlistModal((m) => ({ ...m, open: false }))
                    }
                    className="flex-1 py-2 rounded-xl border border-white/10 text-sm text-white/60 hover:text-white hover:border-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleWaitlistJoin}
                    disabled={waitlistModal.saving || !waitlistModal.email.trim()}
                    className="flex-1 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {waitlistModal.saving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Joining...
                      </>
                    ) : (
                      "Join Waitlist"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
