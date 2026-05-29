import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useState, useCallback, useEffect } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MobileCampaignCard } from "@/components/campaigns/CampaignCard";
import { Campaign } from "@launchpad/shared";
import { getCampaigns } from "@/lib/api";

export default function CampaignsScreen() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadCampaigns() {
    try {
      setError(null);
      const data = await getCampaigns();
      const list: Campaign[] = Array.isArray(data)
        ? data
        : data.campaigns || [];
      setCampaigns(list);
    } catch {
      setError("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCampaigns();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadCampaigns();
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-surface-0">
      <View className="px-5 pt-4 pb-2 flex-row items-center justify-between">
        <View>
          <Text className="text-white text-xl font-bold">Campaigns</Text>
          <Text className="text-white/40 text-xs mt-0.5">
            {loading ? "Loading…" : `${campaigns.length} campaigns`}
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

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#3b82f6" size="large" />
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-red-400 text-sm text-center mb-4">{error}</Text>
          <TouchableOpacity
            onPress={loadCampaigns}
            className="bg-brand-blue rounded-xl px-5 py-2.5"
            activeOpacity={0.8}
          >
            <Text className="text-white text-sm font-medium">Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
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
      )}
    </SafeAreaView>
  );
}
