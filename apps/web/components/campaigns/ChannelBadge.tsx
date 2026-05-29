import { MarketingChannel } from "@launchpad/shared";
import { cn } from "@/lib/utils";

const CHANNEL_CONFIG: Record<
  MarketingChannel,
  { label: string; color: string; bg: string }
> = {
  [MarketingChannel.EMAIL]: {
    label: "Email",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  [MarketingChannel.SMS]: {
    label: "SMS",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  [MarketingChannel.SOCIAL_FACEBOOK]: {
    label: "Facebook",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
  },
  [MarketingChannel.SOCIAL_INSTAGRAM]: {
    label: "Instagram",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
  [MarketingChannel.GOOGLE_ADS]: {
    label: "Google Ads",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  [MarketingChannel.SEO]: {
    label: "SEO",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  [MarketingChannel.LOCAL_LISTINGS]: {
    label: "Local",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
};

interface ChannelBadgeProps {
  channel: MarketingChannel;
  size?: "sm" | "md";
}

export function ChannelBadge({ channel, size = "md" }: ChannelBadgeProps) {
  const config = CHANNEL_CONFIG[channel];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-lg font-medium",
        config.color,
        config.bg,
        size === "sm" ? "text-xs px-2 py-0.5" : "text-xs px-2.5 py-1"
      )}
    >
      {config.label}
    </span>
  );
}
