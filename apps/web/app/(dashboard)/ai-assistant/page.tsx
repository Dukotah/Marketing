import { ChatWindow } from "@/components/ai/ChatWindow";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Assistant",
};

interface PageProps {
  searchParams: Promise<{ prompt?: string }>;
}

export default async function AIAssistantPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const initialPrompt = params.prompt;

  return (
    <div className="h-[calc(100vh-8rem)] max-w-4xl mx-auto">
      <ChatWindow initialPrompt={initialPrompt} />
    </div>
  );
}
