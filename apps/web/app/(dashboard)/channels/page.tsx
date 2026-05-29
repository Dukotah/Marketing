"use client";

import { useState } from "react";
import { MarketingChannel } from "@launchpad/shared";
import { CheckCircle2, ExternalLink, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const CHANNELS = [
  {
    id: MarketingChannel.EMAIL,
    name: "Email (Resend)",
    description: "Send transactional and marketing emails",
    icon: "📧",
    color: "bg-blue-500/10 border-blue-500/20",
    buttonColor: "bg-blue-500 hover:bg-blue-600",
    connected: true,
    accountName: "hello@yourbusiness.com",
  },
  {
    id: MarketingChannel.SOCIAL_FACEBOOK,
    name: "Facebook Pages",
    description: "Manage Facebook page posts and ads",
    icon: "👥",
    color: "bg-indigo-500/10 border-indigo-500/20",
    buttonColor: "bg-indigo-500 hover:bg-indigo-600",
    connected: false,
    accountName: null,
  },
  {
    id: MarketingChannel.SOCIAL_INSTAGRAM,
    name: "Instagram Business",
    description: "Post content and run Instagram ads",
    icon: "📸",
    color: "bg-pink-500/10 border-pink-500/20",
    buttonColor: "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600",
    connected: false,
    accountName: null,
  },
  {
    id: MarketingChannel.GOOGLE_ADS,
    name: "Google Ads",
    description: "Run search, display, and local ads",
    icon: "🔍",
    color: "bg-yellow-500/10 border-yellow-500/20",
    buttonColor: "bg-yellow-500 hover:bg-yellow-600",
    connected: false,
    accountName: null,
  },
  {
    id: MarketingChannel.SMS,
    name: "SMS / Text",
    description: "Send promotional and transactional SMS",
    icon: "💬",
    color: "bg-green-500/10 border-green-500/20",
    buttonColor: "bg-green-500 hover:bg-green-600",
    connected: false,
    accountName: null,
  },
  {
    id: MarketingChannel.SEO,
    name: "SEO Tools",
    description: "Track rankings and optimize content",
    icon: "📈",
    color: "bg-purple-500/10 border-purple-500/20",
    buttonColor: "bg-purple-500 hover:bg-purple-600",
    connected: false,
    accountName: null,
  },
  {
    id: MarketingChannel.LOCAL_LISTINGS,
    name: "Google Business Profile",
    description: "Manage your local business listing",
    icon: "📍",
    color: "bg-cyan-500/10 border-cyan-500/20",
    buttonColor: "bg-cyan-500 hover:bg-cyan-600",
    connected: false,
    accountName: null,
  },
];

export default function ChannelsPage() {
  const [connecting, setConnecting] = useState<MarketingChannel | null>(null);
  const [channels, setChannels] = useState(CHANNELS);

  async function handleConnect(channelId: MarketingChannel) {
    setConnecting(channelId);
    // Simulate OAuth flow
    await new Promise((res) => setTimeout(res, 1500));
    setChannels((prev) =>
      prev.map((c) =>
        c.id === channelId
          ? { ...c, connected: true, accountName: "Connected Account" }
          : c
      )
    );
    setConnecting(null);
  }

  function handleDisconnect(channelId: MarketingChannel) {
    setChannels((prev) =>
      prev.map((c) =>
        c.id === channelId ? { ...c, connected: false, accountName: null } : c
      )
    );
  }

  const connected = channels.filter((c) => c.connected);
  const notConnected = channels.filter((c) => !c.connected);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Marketing Channels</h1>
        <p className="text-white/40 text-sm mt-1">
          Connect your marketing platforms to Launchpad
        </p>
      </div>

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
                    {channel.accountName && (
                      <p className="text-sm text-white/50">{channel.accountName}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDisconnect(channel.id)}
                    className="text-sm text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Disconnect
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
                <p className="text-sm text-white/40 mb-4">
                  {channel.description}
                </p>
                <button
                  onClick={() => handleConnect(channel.id)}
                  disabled={connecting === channel.id}
                  className={cn(
                    "w-full text-white text-sm font-medium py-2 rounded-xl transition-all flex items-center justify-center gap-2",
                    channel.buttonColor,
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  {connecting === channel.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Connect"
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
