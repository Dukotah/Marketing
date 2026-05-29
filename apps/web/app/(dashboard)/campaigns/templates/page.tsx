"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CAMPAIGN_TEMPLATES, CampaignTemplate } from "@launchpad/shared";
import { LayoutTemplate, Zap, Mail, MessageSquare, Facebook, Instagram, MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";

const CATEGORY_TABS = [
  { value: "all", label: "All" },
  { value: "seasonal", label: "Seasonal" },
  { value: "promotional", label: "Promotional" },
  { value: "nurture", label: "Nurture" },
  { value: "announcement", label: "Announcement" },
  { value: "reengagement", label: "Re-engagement" },
] as const;

const DIFFICULTY_COLORS: Record<CampaignTemplate["difficulty"], string> = {
  beginner: "bg-green-500/15 text-green-400 border-green-500/20",
  intermediate: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  advanced: "bg-red-500/15 text-red-400 border-red-500/20",
};

const CHANNEL_ICONS: Record<string, React.ReactNode> = {
  EMAIL: <Mail className="w-3 h-3" />,
  SMS: <MessageSquare className="w-3 h-3" />,
  SOCIAL_FACEBOOK: <Facebook className="w-3 h-3" />,
  SOCIAL_INSTAGRAM: <Instagram className="w-3 h-3" />,
  LOCAL_LISTINGS: <MapPin className="w-3 h-3" />,
};

const CHANNEL_LABELS: Record<string, string> = {
  EMAIL: "Email",
  SMS: "SMS",
  SOCIAL_FACEBOOK: "Facebook",
  SOCIAL_INSTAGRAM: "Instagram",
  GOOGLE_ADS: "Google Ads",
  SEO: "SEO",
  LOCAL_LISTINGS: "Local Listings",
};

const CATEGORY_COLORS: Record<string, string> = {
  seasonal: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  promotional: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  nurture: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  announcement: "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  reengagement: "bg-pink-500/15 text-pink-400 border-pink-500/20",
};

export default function CampaignTemplatesPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered =
    activeCategory === "all"
      ? CAMPAIGN_TEMPLATES
      : CAMPAIGN_TEMPLATES.filter((t) => t.category === activeCategory);

  function handleUseTemplate(template: CampaignTemplate) {
    const prompt = `I want to run the "${template.name}" campaign. Here's the starting content:\n\nHeadline: ${template.content.headline}\n\nBody: ${template.content.body}\n\nCTA: ${template.content.cta_text}${template.content.subject ? `\n\nEmail Subject: ${template.content.subject}` : ""}\n\nTarget Audience: ${template.target_audience}\n\nGoals: ${template.goals}\n\nHelp me customize this campaign for my business.`;

    const params = new URLSearchParams({ prompt });
    router.push(`/dashboard/ai-assistant?${params.toString()}`);
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-blue-500/15 rounded-lg flex items-center justify-center">
            <LayoutTemplate className="w-4 h-4 text-blue-400" />
          </div>
          <h1 className="text-2xl font-bold">Campaign Templates</h1>
        </div>
        <p className="text-white/40 text-sm ml-11">
          Start fast with a pre-built campaign — customize any template with AI in seconds.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1 mb-6 p-1 bg-white/5 rounded-lg w-fit border border-white/5">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveCategory(tab.value)}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150",
              activeCategory === tab.value
                ? "bg-blue-500 text-white shadow"
                : "text-white/50 hover:text-white hover:bg-white/5"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Template count */}
      <p className="text-xs text-white/30 mb-4">
        {filtered.length} template{filtered.length !== 1 ? "s" : ""}
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onUse={() => handleUseTemplate(template)}
          />
        ))}
      </div>
    </div>
  );
}

function TemplateCard({
  template,
  onUse,
}: {
  template: CampaignTemplate;
  onUse: () => void;
}) {
  return (
    <div className="flex flex-col bg-[#111111] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all duration-200 group">
      {/* Top row: category + difficulty */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={cn(
            "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border",
            CATEGORY_COLORS[template.category]
          )}
        >
          {template.category}
        </span>
        <span
          className={cn(
            "text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border",
            DIFFICULTY_COLORS[template.difficulty]
          )}
        >
          {template.difficulty}
        </span>
      </div>

      {/* Name */}
      <h3 className="font-semibold text-white text-base mb-1.5 leading-snug">
        {template.name}
      </h3>

      {/* Description */}
      <p className="text-sm text-white/50 leading-relaxed mb-4 flex-1">
        {template.description}
      </p>

      {/* Channel badges */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {template.channels.map((channel) => (
          <span
            key={channel}
            className="flex items-center gap-1 text-[11px] text-white/40 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full"
          >
            {CHANNEL_ICONS[channel]}
            {CHANNEL_LABELS[channel] ?? channel}
          </span>
        ))}
      </div>

      {/* Estimated reach */}
      <div className="flex items-center gap-1.5 mb-4">
        <Search className="w-3 h-3 text-white/20" />
        <span className="text-xs text-white/30">Est. reach: {template.estimatedReach}</span>
      </div>

      {/* CTA */}
      <button
        onClick={onUse}
        className="w-full flex items-center justify-center gap-2 bg-blue-500/10 hover:bg-blue-500 border border-blue-500/20 hover:border-blue-500 text-blue-400 hover:text-white text-sm font-medium py-2.5 rounded-lg transition-all duration-150"
      >
        <Zap className="w-3.5 h-3.5" />
        Use Template
      </button>
    </div>
  );
}
