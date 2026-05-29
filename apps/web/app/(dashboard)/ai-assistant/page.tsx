import { ConversationsSidebar } from "@/components/ai/ConversationsSidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Assistant",
};

interface PageProps {
  searchParams: Promise<{ prompt?: string; conversation?: string }>;
}

export default async function AIAssistantPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialPrompt = params.prompt;
  const conversationId = params.conversation;

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      <ConversationsSidebar
        activeConversationId={conversationId}
        initialPrompt={initialPrompt}
      />
    </div>
  );
}
