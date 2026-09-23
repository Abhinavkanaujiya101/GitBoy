"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Loader2, Sparkles, History, User } from "lucide-react";

const SUGGESTED_PROFILES = [
  { name: "Linus Torvalds", username: "torvalds", tag: "Linux Creator" },
  { name: "shadcn", username: "shadcn", tag: "UI Components" },
  { name: "Lee Robinson", username: "leerob", tag: "VP at Vercel" },
  { name: "Dan Abramov", username: "gaearon", tag: "React Core" },
  { name: "Anthony Fu", username: "antfu", tag: "Vue / Vite Core" },
  { name: "Sindre Sorhus", username: "sindresorhus", tag: "OSS Legend" },
];

export default function SearchForm() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("gitboy_recent_searches");
      if (stored) {
        setRecentSearches(JSON.parse(stored).slice(0, 5));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const handleNavigate = (targetUser: string) => {
    const cleanUser = targetUser.trim().replace(/^@/, "");
    if (!cleanUser) return;

    setIsLoading(true);

    try {
      const updated = [cleanUser, ...recentSearches.filter((u) => u.toLowerCase() !== cleanUser.toLowerCase())].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("gitboy_recent_searches", JSON.stringify(updated));
    } catch {
      // Ignore
    }

    router.push(`/${encodeURIComponent(cleanUser)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNavigate(username);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-75 transition duration-500 group-focus-within:opacity-100"></div>

        <div className="relative flex items-center bg-slate-900/95 border border-slate-700/80 rounded-xl p-2 shadow-2xl backdrop-blur-xl">
          <div className="pl-3.5 pr-2 text-slate-400">
            <Search className="w-5 h-5 text-cyan-400" />
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter GitHub username (e.g. torvalds)"
            disabled={isLoading}
            className="w-full bg-transparent px-2 py-3 text-base text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-0 font-mono"
            autoFocus
          />
          <button
            type="submit"
            disabled={isLoading || !username.trim()}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-5 py-3 rounded-lg shadow-lg shadow-cyan-500/25 transition-all text-sm whitespace-nowrap cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>Analyze</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Suggested Quick Profiles */}
      <div className="mt-6 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Popular profiles to explore:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_PROFILES.map((profile) => (
            <button
              key={profile.username}
              onClick={() => handleNavigate(profile.username)}
              className="group flex items-center gap-1.5 text-xs bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <User className="w-3 h-3 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              <span className="font-mono text-cyan-400">@{profile.username}</span>
              <span className="text-slate-500 text-[11px] hidden sm:inline">({profile.tag})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-1 text-slate-500 shrink-0">
            <History className="w-3 h-3" />
            <span>Recent:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {recentSearches.map((rec) => (
              <button
                key={rec}
                onClick={() => handleNavigate(rec)}
                className="bg-slate-900/50 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 px-2 py-0.5 rounded text-slate-400 hover:text-slate-200 font-mono transition-colors cursor-pointer"
              >
                @{rec}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
