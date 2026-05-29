"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Zap,
  BarChart3,
  Mail,
  Target,
  Bot,
  Globe,
  ArrowRight,
  CheckCircle2,
  Star,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { PRICING_TIERS } from "@launchpad/shared";

const FEATURES = [
  {
    icon: Bot,
    title: "AI Marketing Strategist",
    description:
      "Meet Max, your always-on AI marketing expert. Ask questions, get campaign ideas, generate copy, and receive data-driven recommendations in seconds.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Zap,
    title: "Multi-Channel Campaigns",
    description:
      "Launch campaigns across Email, SMS, Facebook, Instagram, Google Ads, SEO, and Local Listings — all from one dashboard.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
  {
    icon: BarChart3,
    title: "Unified Analytics",
    description:
      "See all your marketing performance in one place. Track impressions, clicks, conversions, and revenue across every channel.",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    icon: Mail,
    title: "AI Copy Generation",
    description:
      "Generate compelling email subject lines, ad copy, social posts, and landing page content that converts — trained on what actually works.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Target,
    title: "Audience Targeting",
    description:
      "Define your ideal customer and let AI segment, target, and personalize your messaging for maximum relevance and ROI.",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
  {
    icon: Globe,
    title: "Local Business Tools",
    description:
      "Dominate your local market with Google Business Profile management, local SEO, and review monitoring built right in.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Launchpad helped us 3x our email open rates in 30 days. Max suggested subject line formulas we never would have thought of.",
    author: "Sarah Chen",
    role: "Owner, Bloom Floral Studio",
    avatar: "SC",
  },
  {
    quote:
      "I used to spend $3k/month on a marketing agency. Now I spend $149 and get better results because Max actually understands my business.",
    author: "Mike Rodriguez",
    role: "Founder, Rodriguez Auto Body",
    avatar: "MR",
  },
  {
    quote:
      "The AI campaign builder is incredible. I described what I wanted, and within minutes I had a complete 6-week campaign ready to launch.",
    author: "Jessica Park",
    role: "CEO, Park Wellness Co.",
    avatar: "JP",
  },
];

export default function LandingPage() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly"
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold">Launchpad</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
              <a href="#features" className="hover:text-white transition-colors">
                Features
              </a>
              <a href="#pricing" className="hover:text-white transition-colors">
                Pricing
              </a>
              <a
                href="#testimonials"
                className="hover:text-white transition-colors"
              >
                Testimonials
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm text-white/60 hover:text-white transition-colors px-4 py-2"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="text-sm bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Start free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-sm text-blue-400 mb-8">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Powered by Claude AI</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Your AI Marketing Team,
            <br />
            <span className="text-gradient">On Demand</span>
          </h1>

          <p className="text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Launchpad gives small businesses access to enterprise-grade marketing
            intelligence. Build campaigns, generate copy, and grow your revenue
            — with Max, your AI marketing strategist.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/signup"
              className="group flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 glow-blue-sm"
            >
              Start for free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium px-8 py-3.5 rounded-xl transition-colors"
            >
              See a demo
            </Link>
          </div>

          {/* Social proof numbers */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-white/40">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>
                <strong className="text-white">2,400+</strong> businesses
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span>
                <strong className="text-white">3.2x</strong> avg. ROI increase
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span>
                <strong className="text-white">4.9/5</strong> rating
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="relative max-w-5xl mx-auto mt-16">
          <div className="glass rounded-2xl border border-white/10 overflow-hidden glow-blue-sm">
            <div className="bg-[#111111] border-b border-white/5 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-[#1a1a1a] rounded-md px-4 py-1 text-xs text-white/30">
                  app.launchpad.ai/dashboard
                </div>
              </div>
            </div>
            <div className="p-6">
              {/* Mock dashboard */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Total Reach", value: "48,291", change: "+12.3%" },
                  { label: "Conversions", value: "1,847", change: "+8.7%" },
                  { label: "Revenue", value: "$24,190", change: "+22.1%" },
                  { label: "ROAS", value: "4.8x", change: "+0.6x" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5"
                  >
                    <p className="text-xs text-white/40 mb-1">{stat.label}</p>
                    <p className="text-xl font-bold">{stat.value}</p>
                    <p className="text-xs text-green-400 mt-1">{stat.change}</p>
                  </div>
                ))}
              </div>
              {/* Mock AI chat */}
              <div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-blue-400 font-medium mb-1">Max</p>
                    <p className="text-sm text-white/70">
                      Based on your Q4 goals, I recommend launching a 3-channel
                      campaign targeting holiday shoppers. Here&apos;s what I&apos;d suggest
                      for your email subject line:{" "}
                      <span className="text-white font-medium">
                        &quot;Your customers are already shopping. Are you showing up?&quot;
                      </span>
                    </p>
                  </div>
                </div>
                <div className="bg-[#111111] rounded-lg px-4 py-2.5 text-sm text-white/30 border border-white/5">
                  Ask Max anything about your marketing...
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-400 text-sm font-medium mb-3 uppercase tracking-wider">
              Everything you need
            </p>
            <h2 className="text-4xl font-bold mb-4">
              Marketing superpowers for every business
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Launchpad combines AI intelligence with powerful marketing tools so
              you can compete with brands 10x your size.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group bg-[#111111] hover:bg-[#141414] border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all duration-200"
                >
                  <div
                    className={`w-10 h-10 ${feature.bg} rounded-xl flex items-center justify-center mb-4`}
                  >
                    <Icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        id="testimonials"
        className="py-24 px-4 sm:px-6 lg:px-8 bg-[#050505]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-blue-400 text-sm font-medium mb-3 uppercase tracking-wider">
              Real results
            </p>
            <h2 className="text-4xl font-bold">Businesses that grew with Max</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.author}
                className="bg-[#111111] border border-white/5 rounded-2xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  &quot;{t.quote}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.author}</p>
                    <p className="text-xs text-white/40">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-400 text-sm font-medium mb-3 uppercase tracking-wider">
              Simple pricing
            </p>
            <h2 className="text-4xl font-bold mb-4">
              Start free, scale as you grow
            </h2>
            <p className="text-white/50 mb-8">
              No hidden fees. Cancel any time. Upgrade when you&apos;re ready.
            </p>
            {/* Billing toggle */}
            <div className="inline-flex items-center bg-[#111111] border border-white/10 rounded-lg p-1">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  billingPeriod === "monthly"
                    ? "bg-white text-black"
                    : "text-white/50 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod("yearly")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  billingPeriod === "yearly"
                    ? "bg-white text-black"
                    : "text-white/50 hover:text-white"
                }`}
              >
                Yearly
                <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.tier}
                className={`relative rounded-2xl p-6 flex flex-col ${
                  tier.highlighted
                    ? "bg-blue-500/10 border-2 border-blue-500/50 glow-blue-sm"
                    : "bg-[#111111] border border-white/5"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {tier.badge}
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-1">{tier.name}</h3>
                  <p className="text-white/40 text-sm mb-4">
                    {tier.description}
                  </p>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold">
                      $
                      {billingPeriod === "monthly"
                        ? tier.price_monthly
                        : tier.price_yearly}
                    </span>
                    {tier.price_monthly > 0 && (
                      <span className="text-white/40 text-sm mb-1">/mo</span>
                    )}
                  </div>
                  {billingPeriod === "yearly" && tier.price_monthly > 0 && (
                    <p className="text-xs text-green-400 mt-1">
                      Billed annually (save $
                      {(tier.price_monthly - tier.price_yearly) * 12}/yr)
                    </p>
                  )}
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/70">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className={`w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    tier.highlighted
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                  }`}
                >
                  {tier.price_monthly === 0 ? "Get started free" : "Start trial"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative bg-[#111111] border border-white/10 rounded-3xl p-12 overflow-hidden">
            <div className="absolute inset-0 bg-blue-glow opacity-50 pointer-events-none" />
            <div className="relative">
              <h2 className="text-4xl font-bold mb-4">
                Ready to meet Max?
              </h2>
              <p className="text-white/50 mb-8 text-lg">
                Join 2,400+ businesses using AI to grow faster. Start for free,
                no credit card required.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-8 py-3.5 rounded-xl transition-all glow-blue-sm text-lg"
              >
                Start for free
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold">Launchpad</span>
          </div>
          <p className="text-sm text-white/30">
            © 2025 Launchpad. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/40">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
