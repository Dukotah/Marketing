"use client";

import { Bot, User, Copy, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

export function ChatMessage({ role, content, isStreaming }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);

  const isAssistant = role === "assistant";

  async function copyToClipboard() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Strip JSON blocks from rendered content (they'll be shown separately)
  const displayContent = content.replace(/```json\n[\s\S]*?\n```/g, (match) => {
    try {
      const json = JSON.parse(match.replace(/```json\n/, "").replace(/\n```/, ""));
      if (json.campaign_ready) {
        return "\n\n> ✅ **Campaign created!** I've built your campaign based on our conversation. You can review and launch it from the Campaigns tab.\n";
      }
    } catch {
      // not JSON
    }
    return match;
  });

  return (
    <div
      className={cn(
        "group flex gap-3 px-4 py-3 rounded-2xl",
        isAssistant ? "bg-[#111111] border border-white/5" : "bg-blue-500/5"
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5",
          isAssistant ? "bg-blue-500/20" : "bg-white/10"
        )}
      >
        {isAssistant ? (
          <Bot className="w-4 h-4 text-blue-400" />
        ) : (
          <User className="w-4 h-4 text-white/60" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-semibold text-white/60">
            {isAssistant ? "Max" : "You"}
          </span>
        </div>

        {isAssistant ? (
          <div
            className={cn(
              "prose prose-invert prose-sm max-w-none",
              "prose-p:text-white/80 prose-p:leading-relaxed prose-p:my-2",
              "prose-headings:text-white prose-headings:font-semibold",
              "prose-strong:text-white prose-strong:font-semibold",
              "prose-code:text-blue-300 prose-code:bg-blue-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs",
              "prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl",
              "prose-ul:text-white/70 prose-ol:text-white/70",
              "prose-li:my-1",
              "prose-blockquote:border-blue-500/50 prose-blockquote:text-white/60 prose-blockquote:bg-blue-500/5 prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:rounded-lg prose-blockquote:not-italic",
              "prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline",
              isStreaming && "after:content-['▋'] after:animate-pulse after:text-blue-400 after:ml-0.5"
            )}
          >
            <ReactMarkdown>{displayContent}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm text-white/80 leading-relaxed">{content}</p>
        )}
      </div>

      {/* Copy button */}
      {isAssistant && !isStreaming && (
        <button
          onClick={copyToClipboard}
          className="opacity-0 group-hover:opacity-100 transition-opacity self-start mt-0.5 p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      )}
    </div>
  );
}

export function ThinkingIndicator() {
  return (
    <div className="flex gap-3 px-4 py-3 rounded-2xl bg-[#111111] border border-white/5">
      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-blue-400" />
      </div>
      <div className="flex-1">
        <p className="text-xs font-semibold text-white/60 mb-2">Max</p>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-blue-400/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 bg-blue-400/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 bg-blue-400/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}
