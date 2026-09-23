"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, GitFork, ExternalLink, Search, ArrowUpDown, Shield, Code } from "lucide-react";
import { GitHubRepo } from "@/lib/types";
import { getLanguageColor } from "@/lib/colors";

interface TopReposListProps {
  repos: GitHubRepo[];
}

export default function TopReposList({ repos }: TopReposListProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"stars" | "forks" | "updated">("stars");

  // Filter repos by search text
  const filteredRepos = repos.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      (r.description && r.description.toLowerCase().includes(q)) ||
      (r.language && r.language.toLowerCase().includes(q))
    );
  });

  // Sort repos
  const sortedRepos = [...filteredRepos].sort((a, b) => {
    if (sortBy === "stars") return (b.stargazers_count || 0) - (a.stargazers_count || 0);
    if (sortBy === "forks") return (b.forks_count || 0) - (a.forks_count || 0);
    if (sortBy === "updated") return new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime();
    return 0;
  });

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800">
      {/* Header with Title & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-tight">Top Repositories</h3>
            <span className="text-xs bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full text-slate-400 font-mono">
              {repos.length} repos
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Key open-source contributions &amp; projects
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter repositories..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setSortBy("stars")}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                sortBy === "stars" ? "bg-slate-800 text-cyan-400 font-semibold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Stars
            </button>
            <button
              onClick={() => setSortBy("forks")}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                sortBy === "forks" ? "bg-slate-800 text-cyan-400 font-semibold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Forks
            </button>
            <button
              onClick={() => setSortBy("updated")}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                sortBy === "updated" ? "bg-slate-800 text-cyan-400 font-semibold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Updated
            </button>
          </div>
        </div>
      </div>

      {/* Repos Grid */}
      {sortedRepos.length === 0 ? (
        <div className="py-12 text-center text-slate-500 text-xs">
          No repositories match your filter criteria.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sortedRepos.slice(0, 10).map((repo) => {
            const langColor = getLanguageColor(repo.language);
            return (
              <div
                key={repo.id}
                className="bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 p-4 rounded-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <Link
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5 group-hover:underline truncate"
                    >
                      <Code className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{repo.name}</span>
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    </Link>

                    {repo.fork && (
                      <span className="text-[10px] text-slate-500 bg-slate-950 border border-slate-800 px-1.5 py-0.5 rounded shrink-0">
                        Fork
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 min-h-[32px] mb-3">
                    {repo.description || "No description provided."}
                  </p>
                </div>

                {/* Topics / Tags */}
                {repo.topics && repo.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {repo.topics.slice(0, 3).map((topic) => (
                      <span
                        key={topic}
                        className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-1.5 py-0.5 rounded"
                      >
                        #{topic}
                      </span>
                    ))}
                    {repo.topics.length > 3 && (
                      <span className="text-[10px] text-slate-500 self-center">
                        +{repo.topics.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Footer Metrics */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/50">
                  <div className="flex items-center gap-4">
                    {repo.language && (
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: langColor }}
                        />
                        <span className="text-slate-300 font-medium text-[11px]">
                          {repo.language}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-1 text-[11px] text-amber-400/90 font-mono">
                      <Star className="w-3.5 h-3.5 fill-amber-400/20 text-amber-400" />
                      <span>{repo.stargazers_count.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                      <GitFork className="w-3.5 h-3.5 text-slate-500" />
                      <span>{repo.forks_count.toLocaleString()}</span>
                    </div>
                  </div>

                  {repo.license && (
                    <div className="flex items-center gap-1 text-[10px] text-slate-500 truncate max-w-[90px]">
                      <Shield className="w-3 h-3" />
                      <span className="truncate">{repo.license.spdx_id || repo.license.name}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
