"use client";

import { MetricsCards } from "@/components/dashboard/MetricsCards";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const DAILY_DATA = Array.from({ length: 30 }, (_, i) => ({
  date: `Jun ${i + 1}`,
  revenue: Math.floor(Math.random() * 2000 + 500),
  clicks: Math.floor(Math.random() * 500 + 100),
  conversions: Math.floor(Math.random() * 30 + 5),
}));

const CHANNEL_DATA = [
  { name: "Email", revenue: 8400, clicks: 1200 },
  { name: "Facebook", revenue: 6200, clicks: 2100 },
  { name: "Google Ads", revenue: 4800, clicks: 890 },
  { name: "Instagram", revenue: 2900, clicks: 1540 },
  { name: "SEO", revenue: 1890, clicks: 420 },
];

const PIE_DATA = [
  { name: "Email", value: 35, color: "#3b82f6" },
  { name: "Facebook", value: 26, color: "#8b5cf6" },
  { name: "Google Ads", value: 20, color: "#f59e0b" },
  { name: "Instagram", value: 12, color: "#ec4899" },
  { name: "SEO", value: 7, color: "#10b981" },
];

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

export default function AnalyticsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-white/40 text-sm mt-1">Last 30 days performance</p>
      </div>

      <MetricsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue trend */}
        <div className="lg:col-span-2 bg-[#111111] border border-white/5 rounded-2xl p-6">
          <h2 className="font-semibold mb-1">Revenue Over Time</h2>
          <p className="text-sm text-white/40 mb-5">Daily revenue for the past 30 days</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={DAILY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
              <XAxis
                dataKey="date"
                tick={{ fill: "#ffffff30", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fill: "#ffffff30", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${v}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#3b82f6" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Channel breakdown (pie) */}
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
          <h2 className="font-semibold mb-1">Revenue by Channel</h2>
          <p className="text-sm text-white/40 mb-5">Share of total revenue</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={PIE_DATA}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {PIE_DATA.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {PIE_DATA.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: d.color }}
                  />
                  <span className="text-white/60">{d.name}</span>
                </div>
                <span className="font-medium">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Channel performance bar chart */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
        <h2 className="font-semibold mb-1">Channel Performance</h2>
        <p className="text-sm text-white/40 mb-5">Revenue and clicks by marketing channel</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={CHANNEL_DATA} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
            <XAxis
              dataKey="name"
              tick={{ fill: "#ffffff30", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: "#ffffff30", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="clicks" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
