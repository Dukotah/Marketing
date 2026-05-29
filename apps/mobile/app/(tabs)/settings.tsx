import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { clearAuthToken } from "@/lib/api";

interface UserProfile {
  email: string;
  fullName: string;
  plan: string;
  initials: string;
}

export default function SettingsScreen() {
  const [profile, setProfile] = useState<UserProfile>({
    email: "",
    fullName: "",
    plan: "Free",
    initials: "??",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const token = await SecureStore.getItemAsync("auth_token");
      if (!token) return;

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/auth/v1/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        const fullName =
          data.user_metadata?.full_name ||
          data.user_metadata?.name ||
          "";
        const email = data.email || "";
        const nameParts = fullName.trim().split(" ");
        const initials = fullName
          ? nameParts.length >= 2
            ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
            : fullName.slice(0, 2).toUpperCase()
          : email.slice(0, 2).toUpperCase();

        setProfile({
          email,
          fullName: fullName || email.split("@")[0],
          plan: "Free",
          initials,
        });
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleSignOut() {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await SecureStore.getItemAsync("auth_token");
            // Call Supabase sign out
            if (token) {
              await fetch(
                `${process.env.EXPO_PUBLIC_SUPABASE_URL}/auth/v1/logout`,
                {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token}`,
                    apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
                  },
                }
              );
            }
          } catch {
            // Proceed even if signout call fails
          }
          await clearAuthToken();
          router.replace("/(auth)/login");
        },
      },
    ]);
  }

  function handleChangePassword() {
    Alert.alert(
      "Change Password",
      "A password reset link will be sent to your email address.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Send Link",
          onPress: async () => {
            try {
              await fetch(
                `${process.env.EXPO_PUBLIC_SUPABASE_URL}/auth/v1/recover`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
                  },
                  body: JSON.stringify({ email: profile.email }),
                }
              );
              Alert.alert("Email sent", "Check your inbox for a reset link.");
            } catch {
              Alert.alert("Error", "Could not send reset email. Try again.");
            }
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface-0">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20 }}
      >
        <Text className="text-white text-xl font-bold mb-6">Settings</Text>

        {/* Profile card */}
        {loading ? (
          <View className="bg-surface-1 rounded-2xl p-5 border border-white/5 mb-6 items-center">
            <ActivityIndicator color="#3b82f6" />
          </View>
        ) : (
          <View className="bg-surface-1 rounded-2xl p-5 border border-white/5 mb-6">
            <Text className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">
              Profile
            </Text>
            <View className="flex-row items-center gap-4">
              <View className="w-14 h-14 rounded-full bg-brand-blue/30 items-center justify-center">
                <Text className="text-white text-xl font-bold">
                  {profile.initials}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-white font-semibold">{profile.fullName}</Text>
                <Text className="text-white/40 text-sm">{profile.email}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Account section */}
        <View className="mb-5">
          <Text className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2 px-1">
            Account
          </Text>
          <View className="bg-surface-1 rounded-2xl border border-white/5 overflow-hidden">
            <TouchableOpacity
              onPress={handleChangePassword}
              activeOpacity={0.7}
              className="flex-row items-center px-5 py-4 border-b border-white/5"
            >
              <Text className="text-xl mr-3">🔒</Text>
              <Text className="flex-1 text-sm font-medium text-white">
                Change Password
              </Text>
              <Text className="text-white/20">›</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSignOut}
              activeOpacity={0.7}
              className="flex-row items-center px-5 py-4"
            >
              <Text className="text-xl mr-3">🚪</Text>
              <Text className="flex-1 text-sm font-medium text-red-400">
                Sign Out
              </Text>
              <Text className="text-white/20">›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Subscription section */}
        <View className="mb-5">
          <Text className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-2 px-1">
            Subscription
          </Text>
          <View className="bg-surface-1 rounded-2xl border border-white/5 overflow-hidden">
            <View className="flex-row items-center px-5 py-4 border-b border-white/5">
              <Text className="text-xl mr-3">💳</Text>
              <Text className="flex-1 text-sm font-medium text-white">
                Current Plan
              </Text>
              <View className="bg-white/10 rounded-lg px-2 py-0.5">
                <Text className="text-white/50 text-xs">{profile.plan}</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  `${process.env.EXPO_PUBLIC_API_URL || "https://app.launchpad.ai"}/billing`
                )
              }
              activeOpacity={0.7}
              className="flex-row items-center px-5 py-4"
            >
              <Text className="text-xl mr-3">⬆️</Text>
              <Text className="flex-1 text-sm font-medium text-brand-blue-light">
                Manage Billing
              </Text>
              <Text className="text-white/20">›</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text className="text-white/20 text-xs text-center mt-4">
          Launchpad v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
