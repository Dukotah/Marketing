import { Tabs } from "expo-router";
import { View, Text } from "react-native";

interface TabIconProps {
  focused: boolean;
  emoji: string;
  label: string;
}

function TabIcon({ focused, emoji, label }: TabIconProps) {
  return (
    <View className="items-center gap-0.5">
      <Text className={focused ? "text-xl" : "text-xl opacity-40"}>{emoji}</Text>
      <Text
        className={`text-[10px] font-medium ${focused ? "text-brand-blue" : "text-white/40"}`}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#111111",
          borderTopColor: "rgba(255,255,255,0.05)",
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} emoji="📊" label="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="campaigns"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} emoji="📣" label="Campaigns" />
          ),
        }}
      />
      <Tabs.Screen
        name="assistant"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} emoji="🤖" label="Max" />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} emoji="⚙️" label="Settings" />
          ),
        }}
      />
    </Tabs>
  );
}
