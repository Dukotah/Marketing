import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useState, useRef, useCallback } from "react";
import { streamAIChat } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

const STARTER_PROMPTS = [
  "Build me an email campaign",
  "Write 5 Facebook ad headlines",
  "What channel should I start with?",
  "Create a social media strategy",
];

export function MobileChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const abortRef = useRef<(() => void) | null>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, []);

  async function sendMessage(content?: string) {
    const text = content || input.trim();
    if (!text || isLoading) return;

    setInput("");
    setIsLoading(true);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    scrollToBottom();

    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "", streaming: true },
    ]);

    let fullContent = "";

    abortRef.current = await streamAIChat(
      newMessages.map((m) => ({ role: m.role, content: m.content })),
      (chunk) => {
        fullContent += chunk;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: fullContent } : m
          )
        );
        scrollToBottom();
      },
      () => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, streaming: false } : m
          )
        );
        setIsLoading(false);
      },
      () => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content: "Sorry, I encountered an error. Please try again.",
                  streaming: false,
                }
              : m
          )
        );
        setIsLoading(false);
      }
    );
  }

  const isEmpty = messages.length === 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View className="flex-row items-center gap-3 px-5 py-4 border-b border-white/5 bg-surface-1">
        <View className="w-9 h-9 bg-brand-blue/20 rounded-xl items-center justify-center">
          <Text className="text-lg">🤖</Text>
        </View>
        <View>
          <Text className="text-white font-semibold text-sm">Max</Text>
          <View className="flex-row items-center gap-1">
            <View className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <Text className="text-white/40 text-xs">AI Marketing Strategist</Text>
          </View>
        </View>
        {messages.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              abortRef.current?.();
              setMessages([]);
              setIsLoading(false);
            }}
            className="ml-auto"
          >
            <Text className="text-white/30 text-xs">Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Messages */}
      {isEmpty ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-4xl mb-4">✦</Text>
          <Text className="text-white text-lg font-bold mb-2 text-center">
            Hey, I&apos;m Max!
          </Text>
          <Text className="text-white/40 text-sm text-center leading-5 mb-8">
            Your AI marketing strategist. I can help you build campaigns, write
            copy, and grow your business.
          </Text>
          <View className="w-full gap-2">
            {STARTER_PROMPTS.map((prompt) => (
              <TouchableOpacity
                key={prompt}
                onPress={() => sendMessage(prompt)}
                className="bg-surface-1 border border-white/5 rounded-xl px-4 py-3"
                activeOpacity={0.7}
              >
                <Text className="text-white/60 text-sm">{prompt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          onContentSizeChange={scrollToBottom}
          renderItem={({ item }) => (
            <View
              className={`rounded-2xl px-4 py-3 ${
                item.role === "assistant"
                  ? "bg-surface-1 border border-white/5"
                  : "bg-brand-blue/10 border border-brand-blue/20"
              }`}
            >
              <Text className={`text-xs font-semibold mb-1.5 ${item.role === "assistant" ? "text-brand-blue-light" : "text-white/50"}`}>
                {item.role === "assistant" ? "Max" : "You"}
              </Text>
              <Text className="text-white/80 text-sm leading-5">
                {item.content}
                {item.streaming && (
                  <Text className="text-brand-blue"> ▋</Text>
                )}
              </Text>
            </View>
          )}
          ListFooterComponent={
            isLoading && messages[messages.length - 1]?.role !== "assistant" ? (
              <View className="bg-surface-1 border border-white/5 rounded-2xl px-4 py-3">
                <Text className="text-brand-blue-light text-xs font-semibold mb-2">
                  Max
                </Text>
                <View className="flex-row gap-1">
                  {[0, 150, 300].map((delay) => (
                    <View
                      key={delay}
                      className="w-2 h-2 bg-brand-blue/60 rounded-full"
                    />
                  ))}
                </View>
              </View>
            ) : null
          }
        />
      )}

      {/* Input */}
      <View className="px-4 py-3 border-t border-white/5 bg-surface-1">
        <View className="flex-row items-end gap-2 bg-surface-2 border border-white/10 rounded-2xl px-4 py-2">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask Max anything..."
            placeholderTextColor="rgba(255,255,255,0.2)"
            multiline
            className="flex-1 text-white text-sm py-1.5 max-h-24"
            style={{ lineHeight: 20 }}
          />
          <TouchableOpacity
            onPress={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className={`w-8 h-8 rounded-xl items-center justify-center ${
              input.trim() && !isLoading
                ? "bg-brand-blue"
                : "bg-white/5"
            }`}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className={`text-sm ${input.trim() ? "text-white" : "text-white/20"}`}>
                ↑
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
