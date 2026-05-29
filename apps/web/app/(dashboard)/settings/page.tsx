"use client";

import { useState, useEffect, useRef } from "react";
import { User, Building, CreditCard, Bell, Shield, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { PRICING_TIERS, SubscriptionTier } from "@launchpad/shared";
import { formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "organization", label: "Organization", icon: Building },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
];

const NOTIFICATION_KEYS = [
  {
    key: "campaign_performance",
    label: "Campaign performance alerts",
    description: "Get notified when campaigns hit milestones",
    defaultChecked: true,
  },
  {
    key: "weekly_summary",
    label: "Weekly summary email",
    description: "Receive a weekly performance report",
    defaultChecked: true,
  },
  {
    key: "ai_recommendations",
    label: "AI recommendations",
    description: "Max will proactively send optimization tips",
    defaultChecked: false,
  },
  {
    key: "billing_notifications",
    label: "Billing notifications",
    description: "Invoices and usage limit warnings",
    defaultChecked: true,
  },
];

function Toast({ message, type }: { message: string; type: "success" | "error" }) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium shadow-lg transition-all ${
        type === "success"
          ? "bg-green-500/20 border border-green-500/30 text-green-400"
          : "bg-red-500/20 border border-red-500/30 text-red-400"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 className="w-4 h-4" />
      ) : (
        <AlertTriangle className="w-4 h-4" />
      )}
      {message}
    </div>
  );
}

export default function SettingsPage() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState("profile");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Profile state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);

  // Org state
  const [orgId, setOrgId] = useState<string | null>(null);
  const [orgName, setOrgName] = useState("");
  const [orgIndustry, setOrgIndustry] = useState("");
  const [orgWebsite, setOrgWebsite] = useState("");
  const [orgSaving, setOrgSaving] = useState(false);
  const [orgLoading, setOrgLoading] = useState(true);
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null);
  const [subscriptionTier, setSubscriptionTier] = useState<string>("FREE");

  // Notification state
  const [notifPrefs, setNotifPrefs] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(NOTIFICATION_KEYS.map((n) => [n.key, n.defaultChecked]))
  );
  const [notifSaving, setNotifSaving] = useState(false);

  // Security state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteSaving, setDeleteSaving] = useState(false);

  // Billing state
  const [billingLoading, setBillingLoading] = useState<string | null>(null);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(message: string, type: "success" | "error" = "success") {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    toastTimerRef.current = setTimeout(() => setToast(null), 3000);
  }

  // Load user + org on mount
  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setEmail(user.email ?? "");
        const meta = user.user_metadata ?? {};
        const fullName: string = meta.full_name ?? "";
        const parts = fullName.split(" ");
        setFirstName(parts[0] ?? "");
        setLastName(parts.slice(1).join(" ") ?? "");
      }

      const { data: org } = await supabase
        .from("organizations")
        .select("id, name, industry, website, stripe_customer_id, subscription_tier, notification_preferences")
        .eq("owner_id", user?.id ?? "")
        .single();

      if (org) {
        setOrgId(org.id);
        setOrgName(org.name ?? "");
        setOrgIndustry(org.industry ?? "");
        setOrgWebsite(org.website ?? "");
        setStripeCustomerId(org.stripe_customer_id ?? null);
        setSubscriptionTier(org.subscription_tier ?? "FREE");

        if (org.notification_preferences && typeof org.notification_preferences === "object") {
          setNotifPrefs((prev) => ({ ...prev, ...(org.notification_preferences as Record<string, boolean>) }));
        }
      }

      setOrgLoading(false);
    }

    load();
  }, []);

  // Profile save
  async function handleProfileSave() {
    setProfileSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: email || undefined,
        data: {
          full_name: `${firstName} ${lastName}`.trim(),
        },
      });
      if (error) throw error;
      showToast("Profile saved successfully");
    } catch (err: unknown) {
      showToast((err as Error).message ?? "Failed to save profile", "error");
    } finally {
      setProfileSaving(false);
    }
  }

  // Org save
  async function handleOrgSave() {
    if (!orgId) return;
    setOrgSaving(true);
    try {
      const { error } = await supabase
        .from("organizations")
        .update({ name: orgName, industry: orgIndustry || null, website: orgWebsite || null })
        .eq("id", orgId);
      if (error) throw error;
      showToast("Organization saved successfully");
    } catch (err: unknown) {
      showToast((err as Error).message ?? "Failed to save organization", "error");
    } finally {
      setOrgSaving(false);
    }
  }

  // Notification save
  async function handleNotifSave() {
    if (!orgId) return;
    setNotifSaving(true);
    try {
      const { error } = await supabase
        .from("organizations")
        .update({ notification_preferences: notifPrefs } as Record<string, unknown>)
        .eq("id", orgId);
      // If column doesn't exist, Supabase returns an error — we swallow it gracefully
      if (error && !error.message.includes("column")) {
        throw error;
      }
      showToast("Notification preferences saved");
    } catch (err: unknown) {
      showToast((err as Error).message ?? "Failed to save preferences", "error");
    } finally {
      setNotifSaving(false);
    }
  }

  // Password save
  async function handlePasswordSave() {
    if (!newPassword) return;
    if (newPassword !== confirmPassword) {
      showToast("New password and confirmation do not match", "error");
      return;
    }
    setPasswordSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setNewPassword("");
      setConfirmPassword("");
      showToast("Password updated successfully");
    } catch (err: unknown) {
      showToast((err as Error).message ?? "Failed to update password", "error");
    } finally {
      setPasswordSaving(false);
    }
  }

  // Account deletion
  async function handleDeleteAccount() {
    setDeleteSaving(true);
    try {
      const res = await fetch("/api/account/delete", { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to delete account");
      }
      window.location.href = "/";
    } catch (err: unknown) {
      showToast((err as Error).message ?? "Failed to delete account", "error");
      setDeleteSaving(false);
      setShowDeleteConfirm(false);
    }
  }

  // Stripe checkout
  async function handleUpgrade(tier: string) {
    setBillingLoading(`upgrade-${tier}`);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, interval: "monthly" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to start checkout");
      window.location.href = data.url;
    } catch (err: unknown) {
      showToast((err as Error).message ?? "Failed to start checkout", "error");
      setBillingLoading(null);
    }
  }

  // Stripe portal
  async function handleManageBilling() {
    setBillingLoading("portal");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to open billing portal");
      window.location.href = data.url;
    } catch (err: unknown) {
      showToast((err as Error).message ?? "Failed to open billing portal", "error");
      setBillingLoading(null);
    }
  }

  const initials =
    firstName || lastName
      ? `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
      : email.charAt(0).toUpperCase() || "?";

  return (
    <div className="max-w-4xl mx-auto">
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#111111] border border-red-500/20 rounded-2xl p-6 max-w-sm w-full mx-4">
            <h3 className="font-semibold text-red-400 mb-2">Delete account?</h3>
            <p className="text-sm text-white/60 mb-5">
              This will permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-white/70 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteSaving}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 text-sm font-medium px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                {deleteSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                {deleteSaving ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-white/40 text-sm mt-1">Manage your account and billing</p>
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
          {/* Profile tab */}
          {activeTab === "profile" && (
            <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
              <h2 className="font-semibold mb-5">Profile Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-xl font-bold">
                    {initials}
                  </div>
                  <div>
                    <button className="text-sm bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 px-4 py-1.5 rounded-lg transition-colors">
                      Change photo
                    </button>
                    <p className="text-xs text-white/30 mt-1">JPG or PNG. Max 2MB.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">First name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">Last name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-white/60 mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
                <button
                  onClick={handleProfileSave}
                  disabled={profileSaving}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                >
                  {profileSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {profileSaving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          )}

          {/* Organization tab */}
          {activeTab === "organization" && (
            <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
              <h2 className="font-semibold mb-5">Organization Details</h2>
              {orgLoading ? (
                <div className="flex items-center gap-2 text-white/40 text-sm py-4">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">Business name</label>
                    <input
                      type="text"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder="Acme Inc."
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">Industry</label>
                    <select
                      value={orgIndustry}
                      onChange={(e) => setOrgIndustry(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all"
                    >
                      <option value="">Select industry</option>
                      <option>Retail</option>
                      <option>Restaurant / Food</option>
                      <option>Health &amp; Wellness</option>
                      <option>Professional Services</option>
                      <option>Real Estate</option>
                      <option>Technology</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">Website</label>
                    <input
                      type="url"
                      value={orgWebsite}
                      onChange={(e) => setOrgWebsite(e.target.value)}
                      placeholder="https://example.com"
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  <button
                    onClick={handleOrgSave}
                    disabled={orgSaving}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {orgSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {orgSaving ? "Saving..." : "Save changes"}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Billing tab */}
          {activeTab === "billing" && (
            <div className="space-y-5">
              {/* Current plan */}
              <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
                <h2 className="font-semibold mb-4">Current Plan</h2>
                <div className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mb-5">
                  <div>
                    <p className="font-semibold text-blue-400">{subscriptionTier} Plan</p>
                    <p className="text-sm text-white/50 mt-0.5">
                      {subscriptionTier === "FREE"
                        ? "1 campaign · 10 AI prompts/mo · Email only"
                        : "Your current subscription"}
                    </p>
                  </div>
                  {subscriptionTier === "FREE" && <span className="text-2xl font-bold">$0</span>}
                </div>
                {subscriptionTier !== "FREE" && stripeCustomerId ? (
                  <button
                    onClick={handleManageBilling}
                    disabled={billingLoading === "portal"}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {billingLoading === "portal" && <Loader2 className="w-4 h-4 animate-spin" />}
                    Manage Billing
                  </button>
                ) : (
                  <p className="text-sm text-white/50 mb-4">
                    Upgrade to unlock more campaigns, AI prompts, and channels.
                  </p>
                )}
              </div>

              {/* Upgrade options */}
              {subscriptionTier === "FREE" && (
                <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
                  <h2 className="font-semibold mb-4">Upgrade Your Plan</h2>
                  <div className="grid grid-cols-1 gap-3">
                    {PRICING_TIERS.filter((t) => t.tier !== SubscriptionTier.FREE).map((tier) => (
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
                            <p className="font-bold">{formatCurrency(tier.price_monthly)}</p>
                            <p className="text-xs text-white/30">/mo</p>
                          </div>
                          <button
                            onClick={() => handleUpgrade(tier.tier.toLowerCase())}
                            disabled={billingLoading === `upgrade-${tier.tier.toLowerCase()}`}
                            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                          >
                            {billingLoading === `upgrade-${tier.tier.toLowerCase()}` && (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            )}
                            Upgrade
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notifications tab */}
          {activeTab === "notifications" && (
            <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
              <h2 className="font-semibold mb-5">Notification Preferences</h2>
              <div className="space-y-4">
                {NOTIFICATION_KEYS.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-white/40 mt-0.5">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifPrefs[item.key] ?? item.defaultChecked}
                        onChange={(e) =>
                          setNotifPrefs((prev) => ({ ...prev, [item.key]: e.target.checked }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500" />
                    </label>
                  </div>
                ))}
              </div>
              <button
                onClick={handleNotifSave}
                disabled={notifSaving}
                className="flex items-center gap-2 mt-5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                {notifSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                {notifSaving ? "Saving..." : "Save preferences"}
              </button>
            </div>
          )}

          {/* Security tab */}
          {activeTab === "security" && (
            <div className="space-y-5">
              <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
                <h2 className="font-semibold mb-5">Change Password</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">New password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-1.5">Confirm new password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full bg-[#1a1a1a] border rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none transition-all ${
                        confirmPassword && newPassword !== confirmPassword
                          ? "border-red-500/50 focus:border-red-500/70"
                          : "border-white/10 focus:border-blue-500/50"
                      }`}
                    />
                    {confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                    )}
                  </div>
                  <button
                    onClick={handlePasswordSave}
                    disabled={passwordSaving || !newPassword || newPassword !== confirmPassword}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {passwordSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {passwordSaving ? "Updating..." : "Update password"}
                  </button>
                </div>
              </div>
              <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-6">
                <h2 className="font-semibold text-red-400 mb-2">Danger Zone</h2>
                <p className="text-sm text-white/50 mb-4">
                  Permanently delete your account and all associated data.
                </p>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
                >
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
