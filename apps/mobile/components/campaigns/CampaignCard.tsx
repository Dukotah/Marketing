import { View, Text, TouchableOpacity } from "react-native";
import { Campaign, CampaignStatus, MarketingChannel } from "@launchpad/shared";

const STATUS_CONFIG: Record<
  CampaignStatus,
  { label: string; color: string; dot: string }
> = {
  [CampaignStatus.DRAFT]: { label: "Draft", color: "text-white/40", dot: "bg-white/30" },
  [CampaignStatus.SCHEDULED]: { label: "Scheduled", color: "text-yellow-400", dot: "bg-yellow-400" },
  [CampaignStatus.ACTIVE]: { label: "Active", color: "text-green-400", dot: "bg-green-400" },
  [CampaignStatus.PAUSED]: { label: "Paused", color: "text-orange-400", dot: "bg-orange-400" },
  [CampaignStatus.COMPLETED]: { label: "Completed", color: "text-blue-400", dot: "bg-blue-400" },
  [CampaignStatus.ARCHIVED]: { label: "Archived", color: "text-white/20", dot: "bg-white/20" },
};

const CHANNEL_LABELS: Partial<Record<MarketingChannel, string>> = {
  [MarketingChannel.EMAIL]: "Email",
  [MarketingChannel.SMS]: "SMS",
  [MarketingChannel.SOCIAL_FACEBOOK]: "Facebook",
  [MarketingChannel.SOCIAL_INSTAGRAM]: "Instagram",
  [MarketingChannel.GOOGLE_ADS]: "Google Ads",
  [MarketingChannel.SEO]: "SEO",
  [MarketingChannel.LOCAL_LISTINGS]: "Local",
};

interface MobileCampaignCardProps {
  campaign: Campaign;
  onPress?: () => void;
}

export function MobileCampaignCard({ campaign, onPress }: MobileCampaignCardProps) {
  const status = STATUS_CONFIG[campaign.status];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-surface-1 border border-white/5 rounded-2xl p-5"
    >
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <View className={`w-2 h-2 rounded-full ${status.dot}`} />
            <Text className={`text-xs font-medium ${status.color}`}>
              {status.label}
            </Text>
          </View>
          <Text className="text-white font-semibold text-base">
            {campaign.name}
          </Text>
          {campaign.description && (
            <Text className="text-white/40 text-sm mt-0.5" numberOfLines={1}>
              {campaign.description}
            </Text>
          )}
        </View>
        <Text className="text-white/20 text-lg ml-3">›</Text>
      </View>

      {/* Channels */}
      <View className="flex-row flex-wrap gap-1.5 mb-4">
        {campaign.channels.map((ch) => (
          <View
            key={ch}
            className="bg-brand-blue/10 border border-brand-blue/20 rounded-lg px-2 py-0.5"
          >
            <Text className="text-brand-blue-light text-xs">
              {CHANNEL_LABELS[ch] || ch}
            </Text>
          </View>
        ))}
      </View>

      {/* Metrics */}
      {campaign.metrics ? (
        <View className="flex-row border-t border-white/5 pt-3 gap-4">
          <View>
            <Text className="text-white/30 text-xs">Reach</Text>
            <Text className="text-white text-sm font-semibold">
              {(campaign.metrics.impressions / 1000).toFixed(1)}K
            </Text>
          </View>
          <View>
            <Text className="text-white/30 text-xs">CTR</Text>
            <Text className="text-white text-sm font-semibold">
              {campaign.metrics.ctr.toFixed(1)}%
            </Text>
          </View>
          <View>
            <Text className="text-white/30 text-xs">ROAS</Text>
            <Text className="text-white text-sm font-semibold">
              {campaign.metrics.roas.toFixed(1)}x
            </Text>
          </View>
        </View>
      ) : (
        <View className="border-t border-white/5 pt-3">
          <Text className="text-white/25 text-xs">No performance data yet</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
