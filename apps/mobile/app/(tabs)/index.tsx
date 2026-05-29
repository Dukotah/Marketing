import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useState, useCallback, useEffect } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import * as SecureStore from "expo-secure-store";
import { getCampaigns } from "@/lib/api";

interface MetricCard {
  label: string;
  value: string | number;
}

interface Campaign {
  id: string;
  name: string;
  status: string;
}

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("there");
  const [metrics, setMetrics] = useState<MetricCard[]>([
    { label: "Total Campaigns", value: "—" },
    { label: "Active Campaigns", value: "—" },
    { label: "AI Prompts Used", value: "—" },
    { label: "Channels Connected", value: "—" },
  ]);
  const [recentCampaigns, setRecentCampaigns] = useState<Campaign[]>([]);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  async function loadData() {
    try {
      // Get user info from Supabase token
      const token = await SecureStore.getItemAsync("auth_token");
      if (token) {
        try {
          const userRes = await fetch(
            `${process.env.EXPO_PUBLIC_SUPABASE_URL}/auth/v1/user`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
              },
            }
          );
          if (userRes.ok) {
            const userData = await userRes.json();
            const name =
              userData.user_metadata?.full_name ||
              userData.user_metadata?.name ||
              userData.email?.split("@")[0] ||
              "there";
            setUserName(name);
          }
        } catch {
          // ignore, use default
        }
      }

      // Fetch campaigns
      const campaignsData = await getCampaigns();
      const campaigns: Campaign[] = Array.isArray(campaignsData)
        ? campaignsData
        : campaignsData.campaigns || [];

      const activeCampaigns = campaigns.filter(
        (c) => c.status?.toLowerCase() === "active"
      );

      // Get unique channels
      const channelSet = new Set<string>();
      campaigns.forEach((c: any) => {
        if (Array.isArray(c.channels)) {
          c.channels.forEach((ch: string) => channelSet.add(ch));
        }
      });

      setMetrics([
        { label: "Total Campaigns", value: campaigns.length },
        { label: "Active Campaigns", value: activeCampaigns.length },
        { label: "AI Prompts Used", value: "—" },
        { label: "Channels Connected", value: channelSet.size || "—" },
      ]);

      setRecentCampaigns(campaigns.slice(0, 3));
    } catch {
      // Keep defaults on error
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  function getStatusColor(status: string) {
    switch (status?.toLowerCase()) {
      case "active":
        return "text-green-400";
      case "paused":
        return "text-yellow-400";
      case "draft":
        return "text-white/40";
      default:
        return "text-white/40";
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-surface-0">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3b82f6"
          />
        }
      >
        {/* Header */}
        <View className="mb-6">
          <Text className="text-white/50 text-sm">
            {greeting}, {userName} 👋
          </Text>
          <Text className="text-white text-2xl font-bold mt-0.5">
            Your Dashboard
          </Text>
        </View>

        {/* Metrics grid */}
        {loading ? (
          <View className="items-center py-8 mb-6">
            <ActivityIndicator color="#3b82f6" />
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-3 mb-6">
            {metrics.map((metric) => (
              <View
                key={metric.label}
                className="flex-1 min-w-[45%] bg-surface-1 rounded-2xl p-4 border border-white/5"
              >
                <Text className="text-white/40 text-xs mb-2">
                  {metric.label}
                </Text>
                <Text className="text-white text-xl font-bold">
                  {metric.value}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Ask Max CTA */}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/assistant")}
          className="bg-brand-blue/10 border border-brand-blue/20 rounded-2xl p-5 mb-5"
          activeOpacity={0.7}
        >
          <View className="flex-row items-center gap-3 mb-3">
            <View className="w-10 h-10 bg-brand-blue/20 rounded-xl items-center justify-center">
              <Text className="text-xl">✨</Text>
            </View>
            <View>
              <Text className="text-white font-semibold">Ask Max</Text>
              <Text className="text-white/40 text-xs">
                AI Marketing Strategist
              </Text>
            </View>
          </View>
          <Text className="text-white/50 text-sm leading-5 mb-3">
            Get campaign ideas, generate copy, and optimize your marketing
            strategy — instantly.
          </Text>
          <Text className="text-brand-blue-light text-sm font-medium">
            Start a conversation →
          </Text>
        </TouchableOpacity>

        {/* Recent Campaigns */}
        <View className="bg-surface-1 rounded-2xl p-5 border border-white/5">
          <Text className="text-white font-semibold mb-4">
            Recent Campaigns
          </Text>
          {recentCampaigns.length === 0 ? (
            <Text className="text-white/30 text-sm text-center py-4">
              No campaigns yet
            </Text>
          ) : (
            recentCampaigns.map((c, idx) => (
              <TouchableOpacity
                key={c.id}
                onPress={() => router.push("/(tabs)/campaigns")}
                className={`flex-row items-center justify-between py-3 ${
                  idx < recentCampaigns.length - 1 ? "border-b border-white/5" : ""
                }`}
                activeOpacity={0.7}
              >
                <View className="flex-1 mr-3">
                  <Text className="text-white text-sm font-medium" numberOfLines={1}>
                    {c.name}
                  </Text>
                  <Text className={`text-xs mt-0.5 capitalize ${getStatusColor(c.status)}`}>
                    {c.status || "Draft"}
                  </Text>
                </View>
                <Text className="text-white/20">›</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
