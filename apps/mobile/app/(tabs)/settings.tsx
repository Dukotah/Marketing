import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { clearAuthToken } from "@/lib/api";

const SETTINGS_SECTIONS = [
  {
    title: "Account",
    items: [
      { icon: "👤", label: "Profile", action: "profile" },
      { icon: "🏢", label: "Organization", action: "organization" },
      { icon: "🔔", label: "Notifications", action: "notifications" },
    ],
  },
  {
    title: "Billing",
    items: [
      { icon: "💳", label: "Subscription", badge: "Free", action: "billing" },
      { icon: "⬆️", label: "Upgrade Plan", action: "upgrade", highlight: true },
    ],
  },
  {
    title: "App",
    items: [
      { icon: "🔒", label: "Security", action: "security" },
      { icon: "❓", label: "Help & Support", action: "support" },
      { icon: "⭐", label: "Rate Launchpad", action: "rate" },
    ],
  },
];

export default function SettingsScreen() {
  async function handleSignOut() {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await clearAuthToken();
          router.replace("/(auth)/login");
        },
      },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-surface-0">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20 }}
      >
        <Text className="text-white text-xl font-bold mb-6">Settings</Text>

        {/* Profile card */}
        <View className="bg-surface-1 rounded-2xl p-5 border border-white/5 mb-6 flex-row items-center gap-4">
          <View className="w-14 h-14 rounded-full bg-brand-blue/30 items-center justify-center">
            <Text className="text-white text-xl font-bold">JD</Text>
          </View>
          <View className="flex-1">
            <Text className="text-white font-semibold">Jane Doe</Text>
            <Text className="text-white/40 text-sm">jane@example.com</Text>
            <View className="flex-row items-center gap-1 mt-1">
              <View className="w-2 h-2 rounded-full bg-green-400" />
              <Text className="text-green-400 text-xs">Free plan</Text>
            </View>
          </View>
          <TouchableOpacity className="bg-white/5 border border-white/10 rounded-xl px-3 py-2">
            <Text className="text-white/60 text-sm">Edit</Text>
          </TouchableOpacity>
        </View>

        {SETTINGS_SECTIONS.map((section) => (
          <View key={section.title} className="mb-5">
            <Text className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2 px-1">
              {section.title}
            </Text>
            <View className="bg-surface-1 rounded-2xl border border-white/5 overflow-hidden">
              {section.items.map((item, idx) => (
                <TouchableOpacity
                  key={item.action}
                  activeOpacity={0.7}
                  className={`flex-row items-center px-5 py-4 ${
                    idx < section.items.length - 1 ? "border-b border-white/5" : ""
                  } ${item.highlight ? "bg-brand-blue/5" : ""}`}
                >
                  <Text className="text-xl mr-3">{item.icon}</Text>
                  <Text
                    className={`flex-1 text-sm font-medium ${
                      item.highlight ? "text-brand-blue-light" : "text-white"
                    }`}
                  >
                    {item.label}
                  </Text>
                  {item.badge && (
                    <View className="bg-white/10 rounded-lg px-2 py-0.5 mr-2">
                      <Text className="text-white/50 text-xs">{item.badge}</Text>
                    </View>
                  )}
                  <Text className="text-white/20">›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Sign out */}
        <TouchableOpacity
          onPress={handleSignOut}
          className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 items-center mt-2"
          activeOpacity={0.7}
        >
          <Text className="text-red-400 font-medium">Sign Out</Text>
        </TouchableOpacity>

        <Text className="text-white/20 text-xs text-center mt-6">
          Launchpad v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
