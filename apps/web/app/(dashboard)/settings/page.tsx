"use client";

import { useState } from "react";
import { User, Building, CreditCard, Bell, Shield, Loader2, CheckCircle2 } from "lucide-react";
import { PRICING_TIERS, SubscriptionTier } from "@launchpad/shared";
import { formatCurrency } from "@/lib/utils";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "organization", label: "Organization", icon: Building },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-white/40 text-sm mt-1">
          Manage your account and billing
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <div className="w-44 flex-shrink-0 space-y-0.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-500/15 text-blue-400"
                    : "text-white/50 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
              <h2 className="font-semibold mb-5">Profile Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl font-bold">
                    JD
                  </div>
                  <div>
                    <button className="text-sm bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 px-4 py-1.5 rounded-lg transition-colors">
                      Change photo
                    </button>
                    <p className="text-xs text-white/30 mt-1">
                      JPG or PNG. Max 2MB.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">
                      First name
                    </label>
                    <input
                      type="text"
                      defaultValue="Jane"
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">
                      Last name
                    </label>
                    <input
                      type="text"
                      defaultValue="Doe"
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1.5">
                    Email address
                  </label>
                  <input
                    type="email"
                    defaultValue="jane@example.com"
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saved && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                  {saved ? "Saved!" : saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "organization" && (
            <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
              <h2 className="font-semibold mb-5">Organization Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-white/60 mb-1.5">
                    Business name
                  </label>
                  <input
                    type="text"
                    placeholder="Acme Inc."
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1.5">
                    Industry
                  </label>
                  <select className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all">
                    <option value="">Select industry</option>
                    <option>Retail</option>
                    <option>Restaurant / Food</option>
                    <option>Health & Wellness</option>
                    <option>Professional Services</option>
                    <option>Real Estate</option>
                    <option>Technology</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1.5">
                    Website
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com"
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
                <button
                  onClick={handleSave}
                  className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
                >
                  Save changes
                </button>
              </div>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="space-y-5">
              {/* Current plan */}
              <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
                <h2 className="font-semibold mb-4">Current Plan</h2>
                <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-5">
                  <div>
                    <p className="font-semibold text-blue-400">Free Plan</p>
                    <p className="text-sm text-white/50 mt-0.5">
                      1 campaign · 10 AI prompts/mo · Email only
                    </p>
                  </div>
                  <span className="text-2xl font-bold">$0</span>
                </div>
                <p className="text-sm text-white/50 mb-4">
                  Upgrade to unlock more campaigns, AI prompts, and channels.
                </p>
              </div>

              {/* Upgrade options */}
              <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
                <h2 className="font-semibold mb-4">Upgrade Your Plan</h2>
                <div className="grid grid-cols-1 gap-3">
                  {PRICING_TIERS.filter(
                    (t) => t.tier !== SubscriptionTier.FREE
                  ).map((tier) => (
                    <div
                      key={tier.tier}
                      className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                        tier.highlighted
                          ? "border-blue-500/40 bg-blue-500/5"
                          : "border-white/5 hover:border-white/10"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{tier.name}</p>
                          {tier.badge && (
                            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">
                              {tier.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-white/40 mt-0.5">
                          {tier.features.slice(0, 2).join(" · ")}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-bold">
                            {formatCurrency(tier.price_monthly)}
                          </p>
                          <p className="text-xs text-white/30">/mo</p>
                        </div>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                          Upgrade
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
              <h2 className="font-semibold mb-5">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  {
                    label: "Campaign performance alerts",
                    description: "Get notified when campaigns hit milestones",
                    defaultChecked: true,
                  },
                  {
                    label: "Weekly summary email",
                    description: "Receive a weekly performance report",
                    defaultChecked: true,
                  },
                  {
                    label: "AI recommendations",
                    description: "Max will proactively send optimization tips",
                    defaultChecked: false,
                  },
                  {
                    label: "Billing notifications",
                    description: "Invoices and usage limit warnings",
                    defaultChecked: true,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-white/40 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked={item.defaultChecked}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-5">
              <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
                <h2 className="font-semibold mb-5">Change Password</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">
                      Current password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">
                      New password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors">
                    Update password
                  </button>
                </div>
              </div>
              <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6">
                <h2 className="font-semibold text-red-400 mb-2">Danger Zone</h2>
                <p className="text-sm text-white/50 mb-4">
                  Permanently delete your account and all associated data.
                </p>
                <button className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-sm font-medium px-5 py-2.5 rounded-xl transition-colors">
                  Delete account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
