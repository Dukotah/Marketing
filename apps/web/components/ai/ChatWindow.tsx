"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Send, Sparkles, RotateCcw, Bot } from "lucide-react";
import { ChatMessage, ThinkingIndicator } from "./ChatMessage";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const STARTER_PROMPTS = [
  "Build me an email campaign for my new product launch",
  "What marketing channel should I focus on first?",
  "Write 5 Facebook ad headlines for my local business",
  "Create a 30-day social media content plan",
  "How do I improve my email open rates?",
  "Help me define my target audience",
];

interface ChatWindowProps {
  initialPrompt?: string;
}

export function ChatWindow({ initialPrompt }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(initialPrompt || "");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  }, [input]);

  async function sendMessage(content?: string) {
    const messageContent = content || input.trim();
    if (!messageContent || isLoading) return;

    setInput("");
    setIsLoading(true);
    setStreamingContent("");

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.type === "content_block_delta" && parsed.delta?.text) {
                  fullContent += parsed.delta.text;
                  setStreamingContent(fullContent);
                }
              } catch {
                // SSE parse error — skip
              }
            }
          }
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: fullContent,
        },
      ]);
      setStreamingContent("");
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== "AbortError") {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content:
              "I apologize, but I encountered an error. Please try again.",
          },
        ]);
      }
      setStreamingContent("");
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function clearConversation() {
    if (isLoading && abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setStreamingContent("");
    setIsLoading(false);
  }

  const isEmpty = messages.length === 0 && !isLoading;

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] rounded-2xl border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-[#111111]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-semibold">Max</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              <p className="text-xs text-white/40">AI Marketing Strategist</p>
            </div>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearConversation}
            className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            New chat
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-center pb-8">
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-5">
              <Sparkles className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Hey, I&apos;m Max!</h3>
            <p className="text-white/40 text-sm max-w-sm leading-relaxed mb-8">
              Your AI marketing strategist. I can help you build campaigns,
              write copy, analyze your performance, and grow your business.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="text-left text-sm bg-[#111111] hover:bg-[#1a1a1a] border border-white/5 hover:border-white/10 text-white/60 hover:text-white/80 px-4 py-3 rounded-xl transition-all"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
              />
            ))}
            {isLoading && streamingContent ? (
              <ChatMessage
                role="assistant"
                content={streamingContent}
                isStreaming
              />
            ) : isLoading ? (
              <ThinkingIndicator />
            ) : null}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-white/5 p-4 bg-[#111111]">
        <div className="flex items-end gap-3 bg-[#1a1a1a] border border-white/10 focus-within:border-blue-500/40 rounded-2xl px-4 py-3 transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Max anything about your marketing..."
            disabled={isLoading}
            rows={1}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none resize-none leading-relaxed max-h-40"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
              input.trim() && !isLoading
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-white/5 text-white/20 cursor-not-allowed"
            )}
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-xs text-white/20 text-center mt-2">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
