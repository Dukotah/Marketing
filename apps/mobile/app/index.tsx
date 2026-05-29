import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect, router } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function Index() {
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const token = await SecureStore.getItemAsync("auth_token");
      if (!token) {
        router.replace("/(auth)/login");
        return;
      }

      // Verify session is still valid with Supabase
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
        router.replace("/(tabs)");
      } else {
        // Token invalid — clear and go to login
        await SecureStore.deleteItemAsync("auth_token");
        router.replace("/(auth)/login");
      }
    } catch {
      router.replace("/(auth)/login");
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0a0a0a",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator color="#3b82f6" size="large" />
    </View>
  );
}
