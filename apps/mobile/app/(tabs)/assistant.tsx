import { View, SafeAreaView } from "react-native";
import { MobileChatWindow } from "@/components/ai/MobileChatWindow";

export default function AssistantScreen() {
  return (
    <SafeAreaView className="flex-1 bg-surface-0" edges={["top"]}>
      <View className="flex-1">
        <MobileChatWindow />
      </View>
    </SafeAreaView>
  );
}
