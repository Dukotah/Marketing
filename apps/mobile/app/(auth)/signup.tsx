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

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSignup() {
    if (!formData.email || !formData.password || !formData.fullName) {
      setError("Please fill in all required fields");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/auth/v1/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            data: {
              full_name: formData.fullName,
              business_name: formData.businessName,
            },
          }),
        }
      );

      const data = await res.json();

      if (data.error) {
        setError(data.msg || data.error);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <View className="flex-1 bg-surface-0 justify-center px-6 items-center">
        <View className="w-16 h-16 bg-green-500/10 rounded-full items-center justify-center mb-5">
          <Text className="text-3xl">✓</Text>
        </View>
        <Text className="text-white text-xl font-bold mb-2">Check your email</Text>
        <Text className="text-white/50 text-sm text-center mb-6 leading-6">
          We&apos;ve sent a confirmation link to {formData.email}. Click it to activate your account.
        </Text>
        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <Text className="text-brand-blue-light">Back to sign in</Text>
        </TouchableOpacity>
      </View>
    );
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
          <View className="items-center mb-10">
            <View className="w-14 h-14 bg-brand-blue rounded-2xl items-center justify-center mb-4">
              <Text className="text-white text-2xl font-bold">✦</Text>
            </View>
            <Text className="text-white text-2xl font-bold">Get started</Text>
            <Text className="text-white/40 text-sm mt-1">
              No credit card required
            </Text>
          </View>

          <View className="bg-surface-1 rounded-3xl p-6 border border-white/5">
            {error && (
              <View className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 mb-4">
                <Text className="text-red-400 text-sm">{error}</Text>
              </View>
            )}

            <View className="space-y-3 mb-5">
              {[
                {
                  key: "fullName",
                  label: "Full name",
                  placeholder: "Jane Smith",
                  type: "default",
                },
                {
                  key: "businessName",
                  label: "Business name",
                  placeholder: "Acme Inc.",
                  type: "default",
                },
                {
                  key: "email",
                  label: "Email",
                  placeholder: "you@example.com",
                  type: "email-address",
                },
                {
                  key: "password",
                  label: "Password",
                  placeholder: "Min. 8 characters",
                  type: "default",
                  secure: true,
                },
              ].map((field) => (
                <View key={field.key}>
                  <Text className="text-white/60 text-sm mb-1.5">
                    {field.label}
                  </Text>
                  <TextInput
                    value={formData[field.key as keyof typeof formData]}
                    onChangeText={(v) =>
                      setFormData({ ...formData, [field.key]: v })
                    }
                    placeholder={field.placeholder}
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    keyboardType={field.type as "default" | "email-address"}
                    autoCapitalize={
                      field.type === "email-address" ? "none" : "words"
                    }
                    secureTextEntry={field.secure}
                    className="bg-surface-2 border border-white/10 rounded-xl px-4 py-3 text-white text-sm"
                  />
                </View>
              ))}
            </View>

            <TouchableOpacity
              onPress={handleSignup}
              disabled={loading}
              className="bg-brand-blue rounded-xl py-3.5 items-center"
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text className="text-white font-semibold">
                  Create free account
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mt-6">
            <Text className="text-white/40 text-sm">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-brand-blue-light text-sm font-medium">
                Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
