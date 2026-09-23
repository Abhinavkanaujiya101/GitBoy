"use client";

import { useState } from "react";
import { Zap, Info, Award, HelpCircle, Check, ChevronDown, ChevronUp } from "lucide-react";
import { ImpactScoreBreakdown } from "@/lib/types";

interface ImpactScoreCardProps {
  impact: ImpactScoreBreakdown;
}

export default function ImpactScoreCard({ impact }: ImpactScoreCardProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
            <Zap className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">Impact Score</h2>
              <span
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full border"
                style={{
                  color: impact.tierColor,
                  borderColor: `${impact.tierColor}40`,
                  backgroundColor: `${impact.tierColor}15`,
                }}
              >
                {impact.tier}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Normalized algorithm calculating open-source community footprint
            </p>
          </div>
        </div>

        {/* Big Score Display */}
        <div className="flex items-baseline gap-1.5 self-end sm:self-center">
          <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
            {impact.score}
          </span>
          <span className="text-sm font-semibold text-slate-500">/ 100</span>
        </div>
      </div>

      {/* Progress Bar Gauge */}
      <div className="mt-4">
        <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-1000"
            style={{ width: `${Math.max(5, impact.score)}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1 font-mono">
          <span>0 (Novice)</span>
          <span>35 (Builder)</span>
          <span>65 (Champion)</span>
          <span>85+ (Titan)</span>
        </div>
      </div>

      {/* Formula Transparency Toggle */}
      <div className="mt-5 pt-4 border-t border-slate-800/80">
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="flex items-center justify-between w-full text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            <span>How is this calculated? (Transparent Formula Breakdown)</span>
          </span>
          {showBreakdown ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showBreakdown && (
          <div className="mt-3 p-4 bg-slate-900/90 rounded-xl border border-slate-800 text-xs space-y-3">
            <div className="font-mono text-[11px] text-cyan-300/90 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
              {impact.formulaDescription}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/50">
                <span className="text-slate-400 block text-[11px]">Stars Weight (×2.0)</span>
                <span className="text-slate-200 font-bold font-mono">
                  +{impact.components.starsScore.toLocaleString()} pts
                </span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/50">
                <span className="text-slate-400 block text-[11px]">Forks Weight (×1.5)</span>
                <span className="text-slate-200 font-bold font-mono">
                  +{impact.components.forksScore.toLocaleString()} pts
                </span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/50">
                <span className="text-slate-400 block text-[11px]">Starred Repos (×3.0)</span>
                <span className="text-slate-200 font-bold font-mono">
                  +{impact.components.starredReposScore.toLocaleString()} pts
                </span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/50">
                <span className="text-slate-400 block text-[11px]">Consistency (Commits ×0.25)</span>
                <span className="text-slate-200 font-bold font-mono">
                  +{impact.components.consistencyScore.toLocaleString()} pts
                </span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/50">
                <span className="text-slate-400 block text-[11px]">Streak Momentum Bonus</span>
                <span className="text-slate-200 font-bold font-mono">
                  +{impact.components.streakBonus.toLocaleString()} pts
                </span>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/50">
                <span className="text-slate-400 block text-[11px]">Raw Combined Aggregate</span>
                <span className="text-cyan-400 font-bold font-mono">
                  {impact.rawScore.toLocaleString()} pts
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              Normalized onto a progressive 0–100 scale using logarithmic dampening to fairly reward both steady contributors and viral project creators.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
