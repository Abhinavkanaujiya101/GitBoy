import { BookOpen, Star, GitFork, Terminal } from "lucide-react";
import { getLanguageColor } from "@/lib/colors";

interface StatCardsProps {
  totalRepos: number;
  totalStars: number;
  totalForks: number;
  primaryLanguage: string | null;
}

export default function StatCards({
  totalRepos,
  totalStars,
  totalForks,
  primaryLanguage,
}: StatCardsProps) {
  const langColor = getLanguageColor(primaryLanguage);

  const stats = [
    {
      label: "Total Repositories",
      value: totalRepos.toLocaleString(),
      subtext: "Public repos indexed",
      icon: BookOpen,
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Total Stars Earned",
      value: totalStars.toLocaleString(),
      subtext: "Across all public repositories",
      icon: Star,
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      label: "Total Forks Received",
      value: totalForks.toLocaleString(),
      subtext: "Community derivations",
      icon: GitFork,
      iconColor: "text-indigo-400",
      iconBg: "bg-indigo-500/10 border-indigo-500/20",
    },
    {
      label: "Primary Language",
      value: primaryLanguage || "N/A",
      subtext: "By total codebase volume",
      icon: Terminal,
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
      customDotColor: langColor,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700/90 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {stat.label}
              </span>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center border ${stat.iconBg} group-hover:scale-110 transition-transform`}
              >
                <Icon className={`w-4 h-4 ${stat.iconColor}`} />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              {stat.customDotColor && (
                <span
                  className="w-3 h-3 rounded-full inline-block shrink-0 shadow-sm"
                  style={{ backgroundColor: stat.customDotColor }}
                />
              )}
              <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {stat.value}
              </span>
            </div>

            <p className="mt-1.5 text-xs text-slate-500">{stat.subtext}</p>
          </div>
        );
      })}
    </div>
  );
}
