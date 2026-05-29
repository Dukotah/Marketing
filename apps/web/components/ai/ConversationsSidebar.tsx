"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, MessageSquare } from "lucide-react";
import { ChatWindow } from "./ChatWindow";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  title: string;
  updated_at: string;
}

interface ConversationsSidebarProps {
  activeConversationId?: string;
  initialPrompt?: string;
}

export function ConversationsSidebar({
  activeConversationId,
  initialPrompt,
}: ConversationsSidebarProps) {
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | undefined>(activeConversationId);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/conversations");
      const data = await res.json();
      if (data.conversations) {
        setConversations(data.conversations);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  function handleSelectConversation(id: string) {
    setActiveId(id);
    router.push(`/ai-assistant?conversation=${id}`, { scroll: false });
  }

  function handleNewChat() {
    setActiveId(undefined);
    router.push("/ai-assistant", { scroll: false });
  }

  function handleConversationCreated(id: string, title: string) {
    setActiveId(id);
    setConversations((prev) => [
      { id, title, updated_at: new Date().toISOString() },
      ...prev.filter((c) => c.id !== id),
    ]);
    router.replace(`/ai-assistant?conversation=${id}`, { scroll: false });
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  }

  return (
    <>
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 flex flex-col bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden">
        <div className="px-4 py-3.5 border-b border-white/5 bg-[#111111]">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {conversations.length === 0 ? (
            <p className="text-center text-white/20 text-xs px-4 py-6">
              No past conversations
            </p>
          ) : (
            <ul className="space-y-0.5 px-2">
              {conversations.map((conv) => (
                <li key={conv.id}>
                  <button
                    onClick={() => handleSelectConversation(conv.id)}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-xl transition-colors group",
                      activeId === conv.id
                        ? "bg-blue-500/15 text-white"
                        : "hover:bg-white/5 text-white/60 hover:text-white/80"
                    )}
                  >
                    <div className="flex items-start gap-2.5">
                      <MessageSquare className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 opacity-60" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate leading-relaxed">
                          {conv.title || "Untitled"}
                        </p>
                        <p className="text-[10px] text-white/30 mt-0.5">
                          {formatDate(conv.updated_at)}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 min-w-0">
        <ChatWindow
          key={activeId ?? "new"}
          initialPrompt={!activeId ? initialPrompt : undefined}
          conversationId={activeId}
          onConversationCreated={handleConversationCreated}
        />
      </div>
    </>
  );
}
