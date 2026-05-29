import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useState, useCallback } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const METRICS = [
  { label: "Total Reach", value: "48.3K", change: "+12.3%", positive: true },
  { label: "Clicks", value: "3,847", change: "+8.7%", positive: true },
  { label: "Conversions", value: "284", change: "+22.1%", positive: true },
  { label: "Revenue", value: "$24.2K", change: "+18.4%", positive: true },
];

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

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
          <Text className="text-white/50 text-sm">{greeting} 👋</Text>
          <Text className="text-white text-2xl font-bold mt-0.5">
            Your Dashboard
          </Text>
        </View>

        {/* Metrics grid */}
        <View className="flex-row flex-wrap gap-3 mb-6">
          {METRICS.map((metric) => (
            <View
              key={metric.label}
              className="flex-1 min-w-[45%] bg-surface-1 rounded-2xl p-4 border border-white/5"
            >
              <Text className="text-white/40 text-xs mb-2">{metric.label}</Text>
              <Text className="text-white text-xl font-bold mb-1">
                {metric.value}
              </Text>
              <Text
                className={`text-xs font-medium ${metric.positive ? "text-green-400" : "text-red-400"}`}
              >
                {metric.change}
              </Text>
            </View>
          ))}
        </View>

        {/* AI Shortcut */}
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/assistant")}
          className="bg-brand-blue/10 border border-brand-blue/20 rounded-2xl p-5 mb-5"
          activeOpacity={0.7}
        >
          <View className="flex-row items-center gap-3 mb-3">
            <View className="w-10 h-10 bg-brand-blue/20 rounded-xl items-center justify-center">
              <Text className="text-xl">🤖</Text>
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

        {/* Recent Activity */}
        <View className="bg-surface-1 rounded-2xl p-5 border border-white/5">
          <Text className="text-white font-semibold mb-4">
            Active Campaigns
          </Text>
          {[
            {
              name: "Summer Email Blast",
              status: "Active",
              reach: "12.4K",
              statusColor: "text-green-400",
            },
            {
              name: "Facebook Awareness",
              status: "Active",
              reach: "28.1K",
              statusColor: "text-green-400",
            },
            {
              name: "Google Search — Local",
              status: "Paused",
              reach: "8.7K",
              statusColor: "text-yellow-400",
            },
          ].map((c) => (
            <TouchableOpacity
              key={c.name}
              onPress={() => router.push("/(tabs)/campaigns")}
              className="flex-row items-center justify-between py-3 border-b border-white/5 last:border-0"
              activeOpacity={0.7}
            >
              <View>
                <Text className="text-white text-sm font-medium">{c.name}</Text>
                <Text className={`text-xs mt-0.5 ${c.statusColor}`}>
                  {c.status}
                </Text>
              </View>
              <Text className="text-white/60 text-sm">{c.reach}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
