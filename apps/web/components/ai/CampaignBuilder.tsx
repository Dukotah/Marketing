"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Megaphone, ArrowRight } from "lucide-react";
import { MarketingChannel } from "@launchpad/shared";

const CHANNEL_OPTIONS: { value: MarketingChannel; label: string; icon: string }[] = [
  { value: MarketingChannel.EMAIL, label: "Email", icon: "📧" },
  { value: MarketingChannel.SMS, label: "SMS", icon: "💬" },
  { value: MarketingChannel.SOCIAL_FACEBOOK, label: "Facebook", icon: "👥" },
  { value: MarketingChannel.SOCIAL_INSTAGRAM, label: "Instagram", icon: "📸" },
  { value: MarketingChannel.GOOGLE_ADS, label: "Google Ads", icon: "🔍" },
  { value: MarketingChannel.SEO, label: "SEO", icon: "📈" },
  { value: MarketingChannel.LOCAL_LISTINGS, label: "Local Listings", icon: "📍" },
];

interface CampaignBuilderProps {
  onComplete?: (campaignData: Record<string, unknown>) => void;
}

export function CampaignBuilder({ onComplete }: CampaignBuilderProps) {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    goal: "",
    audience: "",
    channels: [] as MarketingChannel[],
    budget: "",
  });

  const steps = [
    { label: "Name", description: "Campaign name" },
    { label: "Goal", description: "What do you want to achieve?" },
    { label: "Audience", description: "Who are you targeting?" },
    { label: "Channels", description: "Where will you run this?" },
    { label: "Budget", description: "How much will you spend?" },
  ];

  function toggleChannel(channel: MarketingChannel) {
    setFormData((prev) => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel],
    }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const campaignData = {
        campaign_ready: true,
        name: formData.name,
        goals: formData.goal,
        target_audience: formData.audience,
        channels: formData.channels,
        budget: parseFloat(formData.budget) || 0,
      };

      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaignData),
      });

      if (response.ok) {
        setSaved(true);
        onComplete?.(campaignData);
      }
    } catch {
      // handle error silently
    } finally {
      setSaving(false);
    }
  }

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-lg font-bold mb-2">Campaign Created!</h3>
        <p className="text-sm text-white/50 mb-4">
          Your campaign has been saved. Head to Campaigns to launch it.
        </p>
        <a
          href="/dashboard/campaigns"
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
        >
          View Campaigns <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    );
  }

  return (
    <div className="bg-[#111111] border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
          <Megaphone className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="font-semibold">Campaign Builder</h3>
          <p className="text-xs text-white/40">
            Step {step + 1} of {steps.length}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1 mb-6">
        {steps.map((s, i) => (
          <div
            key={s.label}
            className={`flex-1 h-1 rounded-full transition-colors ${
              i <= step ? "bg-blue-500" : "bg-white/10"
            }`}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-white/60 mb-1">
          {steps[step].description}
        </h4>

        {step === 0 && (
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Summer Sale Email Campaign"
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
          />
        )}
        {step === 1 && (
          <textarea
            value={formData.goal}
            onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
            placeholder="e.g., Generate 50 new leads, Drive 200 product sales, Increase brand awareness..."
            rows={3}
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
          />
        )}
        {step === 2 && (
          <textarea
            value={formData.audience}
            onChange={(e) =>
              setFormData({ ...formData, audience: e.target.value })
            }
            placeholder="e.g., Women aged 25-45 interested in fitness and wellness, local residents within 10 miles..."
            rows={3}
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
          />
        )}
        {step === 3 && (
          <div className="grid grid-cols-2 gap-2">
            {CHANNEL_OPTIONS.map((ch) => (
              <button
                key={ch.value}
                onClick={() => toggleChannel(ch.value)}
                className={`flex items-center gap-2 p-3 rounded-xl border text-sm transition-all ${
                  formData.channels.includes(ch.value)
                    ? "border-blue-500/50 bg-blue-500/10 text-blue-300"
                    : "border-white/10 bg-[#1a1a1a] text-white/60 hover:border-white/20 hover:text-white"
                }`}
              >
                <span>{ch.icon}</span>
                <span>{ch.label}</span>
                {formData.channels.includes(ch.value) && (
                  <CheckCircle2 className="w-3.5 h-3.5 ml-auto text-blue-400" />
                )}
              </button>
            ))}
          </div>
        )}
        {step === 4 && (
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">
              $
            </span>
            <input
              type="number"
              value={formData.budget}
              onChange={(e) =>
                setFormData({ ...formData, budget: e.target.value })
              }
              placeholder="500"
              min="0"
              className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-8 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        {step > 0 ? (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="text-sm text-white/40 hover:text-white transition-colors"
          >
            Back
          </button>
        ) : (
          <div />
        )}

        {step < steps.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={
              (step === 0 && !formData.name) ||
              (step === 1 && !formData.goal) ||
              (step === 2 && !formData.audience) ||
              (step === 3 && formData.channels.length === 0)
            }
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-40 text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? "Saving..." : "Create Campaign"}
          </button>
        )}
      </div>
    </div>
  );
}
