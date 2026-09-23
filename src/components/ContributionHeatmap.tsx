"use client";

import { useState } from "react";
import { Flame, Calendar, Trophy, Zap } from "lucide-react";
import { ContributionCalendar } from "@/lib/types";

interface ContributionHeatmapProps {
  contributions: ContributionCalendar;
}

export default function ContributionHeatmap({ contributions }: ContributionHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number } | null>(null);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800">
      {/* Header with Streak Stat Counters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">Contribution Heatmap</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Last 52 weeks activity and commit frequency
          </p>
        </div>

        {/* 3 Metric Pills */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Total */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-xl">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">Year Total</span>
              <span className="font-bold text-white font-mono">
                {contributions.totalContributions.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Current Streak */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-xl">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">Current Streak</span>
              <span className="font-bold text-white font-mono">
                {contributions.currentStreak} {contributions.currentStreak === 1 ? "day" : "days"}
              </span>
            </div>
          </div>

          {/* Longest Streak */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-xl">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">Longest Streak</span>
              <span className="font-bold text-white font-mono">
                {contributions.longestStreak} {contributions.longestStreak === 1 ? "day" : "days"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="relative overflow-x-auto pb-2">
        <div className="min-w-[760px]">
          {/* Month headers approximation */}
          <div className="flex justify-between text-[11px] text-slate-500 font-mono mb-2 px-6">
            {months.map((m, i) => (
              <span key={`${m}-${i}`}>{m}</span>
            ))}
          </div>

          {/* Heatmap Grid: 52 columns x 7 rows */}
          <div className="flex gap-1 items-start">
            {/* Day labels (Mon, Wed, Fri) */}
            <div className="flex flex-col justify-between h-[100px] text-[10px] text-slate-500 font-mono pr-2 select-none">
              <span>Mon</span>
              <span>Wed</span>
              <span>Fri</span>
            </div>

            {/* Weeks */}
            <div className="flex gap-[3.5px]">
              {contributions.weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-[3.5px]">
                  {week.contributionDays.map((day, dIdx) => {
                    const isHovered = hoveredDay?.date === day.date;
                    // Compute nice green shades
                    let bg = "#161b22";
                    if (day.contributionCount > 8) bg = "#39d353";
                    else if (day.contributionCount > 5) bg = "#26a641";
                    else if (day.contributionCount > 2) bg = "#006d32";
                    else if (day.contributionCount > 0) bg = "#0e4429";

                    return (
                      <div
                        key={`${wIdx}-${dIdx}`}
                        onMouseEnter={() =>
                          setHoveredDay({ date: day.date, count: day.contributionCount })
                        }
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`w-3 h-3 rounded-xs transition-transform duration-150 cursor-pointer ${
                          isHovered ? "scale-125 ring-2 ring-white z-10" : ""
                        }`}
                        style={{ backgroundColor: bg }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Legend / Active Day */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-800/80 text-xs">
        {/* Tooltip display */}
        <div className="h-5 flex items-center">
          {hoveredDay ? (
            <span className="font-mono text-cyan-400 font-medium">
              {hoveredDay.count} {hoveredDay.count === 1 ? "contribution" : "contributions"} on{" "}
              {hoveredDay.date}
            </span>
          ) : (
            <span className="text-slate-500">Hover over any square for exact contribution count</span>
          )}
        </div>

        {/* GitHub Color Intensity Legend */}
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
          <span>Less</span>
          <div className="w-2.5 h-2.5 rounded-xs bg-[#161b22]" />
          <div className="w-2.5 h-2.5 rounded-xs bg-[#0e4429]" />
          <div className="w-2.5 h-2.5 rounded-xs bg-[#006d32]" />
          <div className="w-2.5 h-2.5 rounded-xs bg-[#26a641]" />
          <div className="w-2.5 h-2.5 rounded-xs bg-[#39d353]" />
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
