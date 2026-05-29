"use client";

import { TrendingUp, TrendingDown, Users, MousePointer, DollarSign, BarChart3 } from "lucide-react";
import { cn, formatCurrency, formatNumber } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

function MetricCard({
  label,
  value,
  change,
  changeLabel,
  icon: Icon,
  iconColor,
  iconBg,
}: MetricCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="bg-[#111111] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", iconBg)}>
          <Icon className={cn("w-5 h-5", iconColor)} />
        </div>
        <div
          className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg",
            isPositive
              ? "bg-green-500/10 text-green-400"
              : "bg-red-500/10 text-red-400"
          )}
        >
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {Math.abs(change)}%
        </div>
      </div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-sm text-white/40">{label}</p>
      <p className="text-xs text-white/25 mt-1">{changeLabel}</p>
    </div>
  );
}

interface MetricsCardsProps {
  data?: {
    totalReach: number;
    reachChange: number;
    clicks: number;
    clicksChange: number;
    conversions: number;
    conversionsChange: number;
    revenue: number;
    revenueChange: number;
  };
}

export function MetricsCards({ data }: MetricsCardsProps) {
  const metrics = data || {
    totalReach: 48291,
    reachChange: 12.3,
    clicks: 3847,
    clicksChange: 8.7,
    conversions: 284,
    conversionsChange: 22.1,
    revenue: 24190,
    revenueChange: 18.4,
  };

  const cards: MetricCardProps[] = [
    {
      label: "Total Reach",
      value: formatNumber(metrics.totalReach),
      change: metrics.reachChange,
      changeLabel: "vs. last 30 days",
      icon: Users,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/10",
    },
    {
      label: "Total Clicks",
      value: formatNumber(metrics.clicks),
      change: metrics.clicksChange,
      changeLabel: "vs. last 30 days",
      icon: MousePointer,
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/10",
    },
    {
      label: "Conversions",
      value: formatNumber(metrics.conversions),
      change: metrics.conversionsChange,
      changeLabel: "vs. last 30 days",
      icon: BarChart3,
      iconColor: "text-green-400",
      iconBg: "bg-green-500/10",
    },
    {
      label: "Revenue",
      value: formatCurrency(metrics.revenue),
      change: metrics.revenueChange,
      changeLabel: "vs. last 30 days",
      icon: DollarSign,
      iconColor: "text-yellow-400",
      iconBg: "bg-yellow-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <MetricCard key={card.label} {...card} />
      ))}
    </div>
  );
}
