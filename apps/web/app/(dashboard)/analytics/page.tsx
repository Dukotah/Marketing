"use client";

import { MetricsCards } from "@/components/dashboard/MetricsCards";
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Plug } from "lucide-react";

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ color: string; name: string; value: number }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-3 text-sm">
        <p className="text-white/50 mb-2">{label}</p>
        {payload.map((p) => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {typeof p.value === "number" && p.name === "revenue" ? `$${p.value.toLocaleString()}` : p.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Suppress unused warning — kept for when real data is wired up
void CustomTooltip;

function ComingSoonChart({
  title,
  subtitle,
  icon: Icon,
  height = 240,
}: {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  height?: number;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="font-semibold mb-1">{title}</h2>
        <p className="text-sm text-white/40">{subtitle}</p>
      </div>
      <div
        className="flex flex-col items-center justify-center gap-3 border border-dashed border-white/10 rounded-xl"
        style={{ height }}
      >
        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-white/20" />
        </div>
        <div className="text-center">
          <p className="text-sm text-white/30 font-medium">Coming soon</p>
          <p className="text-xs text-white/20 mt-1 flex items-center gap-1.5 justify-center">
            <Plug className="w-3 h-3" />
            Connect your channels to see real data
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-white/40 text-sm mt-1">Last 30 days performance</p>
      </div>

      <MetricsCards />

      {/* Channel integrations notice */}
      <div className="flex items-start gap-3 bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4">
        <Plug className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-300">Channel integrations required</p>
          <p className="text-sm text-white/40 mt-0.5">
            Revenue, clicks, and conversion charts will populate once you connect your marketing channels (Google Ads, Facebook, Email, etc.).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue trend */}
        <div className="lg:col-span-2 bg-[#111111] border border-white/5 rounded-2xl p-6">
          <ComingSoonChart
            title="Revenue Over Time"
            subtitle="Daily revenue for the past 30 days"
            icon={TrendingUp}
            height={240}
          />
        </div>

        {/* Channel breakdown (pie) */}
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
          <ComingSoonChart
            title="Revenue by Channel"
            subtitle="Share of total revenue"
            icon={PieChartIcon}
            height={240}
          />
        </div>
      </div>

      {/* Channel performance bar chart */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
        <ComingSoonChart
          title="Channel Performance"
          subtitle="Revenue and clicks by marketing channel"
          icon={BarChart3}
          height={220}
        />
      </div>
    </div>
  );
}
