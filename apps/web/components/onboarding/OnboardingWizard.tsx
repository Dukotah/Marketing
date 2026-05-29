"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const INDUSTRIES = [
  "Retail / E-commerce",
  "Food & Beverage",
  "Health & Wellness",
  "Home Services",
  "Professional Services",
  "Real Estate",
  "Beauty & Salon",
  "Automotive",
  "Education",
  "Entertainment",
  "Non-profit",
  "Other",
];

const GOALS = [
  { id: "customers", label: "Get more customers" },
  { id: "social", label: "Grow social media" },
  { id: "traffic", label: "Drive website traffic" },
  { id: "repeat", label: "Increase repeat sales" },
  { id: "brand", label: "Build brand awareness" },
];

const CHANNELS = [
  { id: "EMAIL", label: "Email", emoji: "✉️", description: "Newsletters & campaigns" },
  { id: "SMS", label: "SMS", emoji: "💬", description: "Text message marketing" },
  { id: "SOCIAL_FACEBOOK", label: "Facebook", emoji: "📘", description: "Ads & organic posts" },
  { id: "SOCIAL_INSTAGRAM", label: "Instagram", emoji: "📸", description: "Visual content & reels" },
  { id: "GOOGLE_ADS", label: "Google Ads", emoji: "🔍", description: "Search & display ads" },
  { id: "SEO", label: "SEO", emoji: "🌐", description: "Organic search ranking" },
  { id: "LOCAL_LISTINGS", label: "Local", emoji: "📍", description: "Google Business & maps" },
];

interface FormData {
  businessName: string;
  industry: string;
  website: string;
  goals: string[];
  channels: string[];
}

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState<FormData>({
    businessName: "",
    industry: "",
    website: "",
    goals: [],
    channels: [],
  });

  const totalSteps = 4;

  function toggleGoal(id: string) {
    setForm((prev) => ({
      ...prev,
      goals: prev.goals.includes(id)
        ? prev.goals.filter((g) => g !== id)
        : [...prev.goals, id],
    }));
  }

  function toggleChannel(id: string) {
    setForm((prev) => ({
      ...prev,
      channels: prev.channels.includes(id)
        ? prev.channels.filter((c) => c !== id)
        : [...prev.channels, id],
    }));
  }

  function canAdvance() {
    if (step === 1) return form.businessName.trim().length > 0 && form.industry.length > 0;
    if (step === 2) return form.goals.length > 0;
    if (step === 3) return form.channels.length > 0;
    return true;
  }

  async function handleFinish() {
    setIsSaving(true);
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.businessName,
          industry: form.industry,
          website: form.website || null,
        }),
      });
    } catch {
      // ignore, still redirect
    } finally {
      setIsSaving(false);
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i + 1 === step
                  ? "w-8 bg-blue-500"
                  : i + 1 < step
                  ? "w-4 bg-blue-500/60"
                  : "w-4 bg-white/10"
              )}
            />
          ))}
        </div>

        <div className="bg-[#111111] border border-white/5 rounded-2xl p-8">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">Tell us about your business</h2>
                <p className="text-white/40 text-sm">
                  Help Max personalise your marketing strategy.
                </p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">
                    Business name <span className="text-blue-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.businessName}
                    onChange={(e) => setForm((p) => ({ ...p, businessName: e.target.value }))}
                    placeholder="e.g. Sunny Bakery"
                    className="w-full bg-[#1a1a1a] border border-white/10 focus:border-blue-500/40 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">
                    Industry <span className="text-blue-400">*</span>
                  </label>
                  <select
                    value={form.industry}
                    onChange={(e) => setForm((p) => ({ ...p, industry: e.target.value }))}
                    className="w-full bg-[#1a1a1a] border border-white/10 focus:border-blue-500/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors appearance-none"
                  >
                    <option value="" disabled className="bg-[#1a1a1a]">
                      Select your industry
                    </option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind} className="bg-[#1a1a1a]">
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">
                    Website <span className="text-white/30 font-normal">(optional)</span>
                  </label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))}
                    placeholder="https://yourbusiness.com"
                    className="w-full bg-[#1a1a1a] border border-white/10 focus:border-blue-500/40 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">What are you trying to achieve?</h2>
                <p className="text-white/40 text-sm">Select all that apply.</p>
              </div>
              <div className="space-y-2.5">
                {GOALS.map((goal) => {
                  const selected = form.goals.includes(goal.id);
                  return (
                    <button
                      key={goal.id}
                      onClick={() => toggleGoal(goal.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all text-left",
                        selected
                          ? "border-blue-500/50 bg-blue-500/10 text-white"
                          : "border-white/10 bg-[#1a1a1a] text-white/60 hover:border-white/20 hover:text-white/80"
                      )}
                    >
                      <div
                        className={cn(
                          "w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0 transition-all",
                          selected ? "border-blue-500 bg-blue-500" : "border-white/20"
                        )}
                      >
                        {selected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-sm font-medium">{goal.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">Which channels interest you?</h2>
                <p className="text-white/40 text-sm">
                  Pick the ones you want to explore. You can change this later.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {CHANNELS.map((channel) => {
                  const selected = form.channels.includes(channel.id);
                  return (
                    <button
                      key={channel.id}
                      onClick={() => toggleChannel(channel.id)}
                      className={cn(
                        "flex flex-col items-start gap-1.5 px-4 py-3.5 rounded-xl border transition-all text-left",
                        selected
                          ? "border-blue-500/50 bg-blue-500/10"
                          : "border-white/10 bg-[#1a1a1a] hover:border-white/20"
                      )}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <span className="text-lg">{channel.emoji}</span>
                        <span
                          className={cn(
                            "text-sm font-semibold transition-colors",
                            selected ? "text-white" : "text-white/70"
                          )}
                        >
                          {channel.label}
                        </span>
                        {selected && (
                          <div className="ml-auto w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-white/30">{channel.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">You&apos;re all set!</h2>
                <p className="text-white/40 text-sm max-w-sm mx-auto leading-relaxed">
                  Max is ready to help <strong className="text-white/70">{form.businessName}</strong> grow.
                  Your personalised marketing dashboard is waiting.
                </p>
              </div>
              <div className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4 text-left space-y-2.5">
                <p className="text-xs text-white/30 uppercase tracking-wider font-medium mb-3">Summary</p>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Business</span>
                  <span className="text-white font-medium">{form.businessName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Industry</span>
                  <span className="text-white">{form.industry}</span>
                </div>
                {form.website && (
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Website</span>
                    <span className="text-white truncate max-w-[200px]">{form.website}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Goals</span>
                  <span className="text-white">{form.goals.length} selected</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Channels</span>
                  <span className="text-white">{form.channels.length} selected</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            {step > 1 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canAdvance()}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl transition-all",
                  canAdvance()
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-white/5 text-white/20 cursor-not-allowed"
                )}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={isSaving}
                className="flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition-all disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Go to Dashboard"}
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
