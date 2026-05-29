import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { saveAuthToken } from "@/lib/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    if (!email || !password) {
      setError("Please enter your email and password");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/auth/v1/token?grant_type=password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (data.error || !data.access_token) {
        setError(data.error_description || "Invalid credentials");
        return;
      }

      await saveAuthToken(data.access_token);
      router.replace("/(tabs)");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-surface-0"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6">
          {/* Logo */}
          <View className="items-center mb-10">
            <View className="w-14 h-14 bg-brand-blue rounded-2xl items-center justify-center mb-4">
              <Text className="text-white text-2xl font-bold">✦</Text>
            </View>
            <Text className="text-white text-2xl font-bold">Launchpad</Text>
            <Text className="text-white/40 text-sm mt-1">
              Your AI Marketing Team
            </Text>
          </View>

          {/* Card */}
          <View className="bg-surface-1 rounded-3xl p-6 border border-white/5">
            <Text className="text-white text-xl font-bold text-center mb-1">
              Welcome back
            </Text>
            <Text className="text-white/40 text-sm text-center mb-6">
              Sign in to your account
            </Text>

            {error && (
              <View className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
                <Text className="text-red-400 text-sm">{error}</Text>
              </View>
            )}

            <View className="space-y-3 mb-5">
              <View>
                <Text className="text-white/60 text-sm mb-1.5">Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  className="bg-surface-2 border border-white/10 rounded-xl px-4 py-3 text-white text-sm"
                />
              </View>
              <View>
                <Text className="text-white/60 text-sm mb-1.5">Password</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  secureTextEntry
                  className="bg-surface-2 border border-white/10 rounded-xl px-4 py-3 text-white text-sm"
                />
              </View>
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              className="bg-brand-blue rounded-xl py-3.5 items-center"
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-semibold">Sign in</Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mt-6">
            <Text className="text-white/40 text-sm">
              Don&apos;t have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
              <Text className="text-brand-blue-light text-sm font-medium">
                Sign up free
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
