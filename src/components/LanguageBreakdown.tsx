"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { PieChart as ChartIcon, Layers, Star } from "lucide-react";
import { LanguageStat } from "@/lib/types";

interface LanguageBreakdownProps {
  languages: LanguageStat[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      name: string;
      value: number;
      color: string;
      count: number;
      percentage: number;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-xl text-xs backdrop-blur-md">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <span className="font-bold text-white">{data.name}</span>
        </div>
        <div className="text-slate-300 font-mono">
          <span>{data.percentage}%</span>
          <span className="text-slate-500 ml-1.5">({data.count} repos)</span>
        </div>
      </div>
    );
  }
  return null;
};

export default function LanguageBreakdown({ languages }: LanguageBreakdownProps) {
  const [metric, setMetric] = useState<"size" | "stars">("size");

  if (!languages || languages.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 text-center">
        <p className="text-sm text-slate-400">No language data detected in public repositories.</p>
      </div>
    );
  }

  // Prepare chart data based on selected metric
  const chartData = languages.slice(0, 6).map((lang) => ({
    name: lang.name,
    value: metric === "size" ? lang.size : Math.max(1, lang.stars),
    color: lang.color,
    count: lang.count,
    percentage: metric === "size" ? lang.percentageBySize : 0,
  }));

  // Re-calculate percentages for stars if in star mode
  if (metric === "stars") {
    const totalStarWeight = chartData.reduce((acc, c) => acc + c.value, 0);
    chartData.forEach((d) => {
      d.percentage = totalStarWeight > 0 ? parseFloat(((d.value / totalStarWeight) * 100).toFixed(1)) : 0;
    });
  }

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
            <ChartIcon className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Language Breakdown</h3>
            <p className="text-xs text-slate-400">Ecosystem tech stack distribution</p>
          </div>
        </div>

        {/* Metric Selector Toggle */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setMetric("size")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              metric === "size"
                ? "bg-slate-800 text-cyan-400 font-semibold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>By Repo Size</span>
          </button>
          <button
            onClick={() => setMetric("stars")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              metric === "stars"
                ? "bg-slate-800 text-cyan-400 font-semibold shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>By Star Weight</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Donut Chart */}
        <div className="md:col-span-5 h-56 flex items-center justify-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                stroke="#090d16"
                strokeWidth={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-lg font-black text-white">{languages.length}</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Languages</span>
          </div>
        </div>

        {/* Progress Bars & Legend */}
        <div className="md:col-span-7 flex flex-col space-y-3.5">
          {chartData.map((lang) => (
            <div key={lang.name} className="flex flex-col space-y-1">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: lang.color }}
                  />
                  <span className="font-semibold text-slate-200">{lang.name}</span>
                  <span className="text-[11px] text-slate-500">
                    ({lang.count} {lang.count === 1 ? "repo" : "repos"})
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-slate-300">
                  {lang.percentage}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${lang.percentage}%`,
                    backgroundColor: lang.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
