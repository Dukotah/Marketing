import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useState, useCallback } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MobileCampaignCard } from "@/components/campaigns/CampaignCard";
import { Campaign, CampaignStatus, MarketingChannel } from "@launchpad/shared";

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "1",
    organization_id: "org1",
    name: "Summer Email Blast",
    description: "Promotional email for summer sale",
    status: CampaignStatus.ACTIVE,
    channels: [MarketingChannel.EMAIL],
    target_audience: "Existing customers aged 25-45",
    goals: "Drive 200 conversions",
    budget: 500,
    schedule: null,
    content: {
      subject: "☀️ Summer Sale: 30% off everything",
      body: "Hey there! Summer is here and so are our best deals...",
    },
    metrics: {
      impressions: 12400,
      clicks: 892,
      conversions: 84,
      spend: 150,
      revenue: 4200,
      ctr: 7.2,
      roas: 28,
    },
    ai_conversation_id: null,
    created_by: "user1",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    organization_id: "org1",
    name: "Facebook Brand Awareness",
    description: "Boosting brand visibility on Facebook",
    status: CampaignStatus.ACTIVE,
    channels: [MarketingChannel.SOCIAL_FACEBOOK],
    target_audience: "Local residents 18-55",
    goals: "Increase brand awareness",
    budget: 1000,
    schedule: null,
    content: {
      headline: "Discover What Makes Us Different",
      body: "We've been serving the community for over 10 years...",
    },
    metrics: {
      impressions: 28100,
      clicks: 506,
      conversions: 28,
      spend: 380,
      revenue: 1400,
      ctr: 1.8,
      roas: 3.7,
    },
    ai_conversation_id: null,
    created_by: "user1",
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    organization_id: "org1",
    name: "Google Local Search",
    description: null,
    status: CampaignStatus.PAUSED,
    channels: [MarketingChannel.GOOGLE_ADS],
    target_audience: "People searching locally",
    goals: "Drive foot traffic",
    budget: 800,
    schedule: null,
    content: null,
    metrics: null,
    ai_conversation_id: null,
    created_by: "user1",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function CampaignsScreen() {
  const [campaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-surface-0">
      <View className="px-5 pt-4 pb-2 flex-row items-center justify-between">
        <View>
          <Text className="text-white text-xl font-bold">Campaigns</Text>
          <Text className="text-white/40 text-xs mt-0.5">
            {campaigns.length} campaigns
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/assistant")}
          className="bg-brand-blue rounded-xl px-4 py-2 flex-row items-center gap-1.5"
          activeOpacity={0.8}
        >
          <Text className="text-white text-sm font-medium">+ New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={campaigns}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingTop: 12 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3b82f6"
          />
        }
        renderItem={({ item }) => <MobileCampaignCard campaign={item} />}
        ListEmptyComponent={() => (
          <View className="items-center py-20">
            <Text className="text-4xl mb-3">📣</Text>
            <Text className="text-white/60 font-medium mb-1">
              No campaigns yet
            </Text>
            <Text className="text-white/30 text-sm text-center px-8">
              Ask Max to help you create your first campaign
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
