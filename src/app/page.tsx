import Navbar from "@/components/Navbar";
import SearchForm from "@/components/SearchForm";
import {
  Activity,
  BarChart3,
  Flame,
  Award,
  Share2,
  Code2,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative overflow-hidden">
        {/* Background ambient gradient spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-blue-600/10 to-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        {/* Hero Section */}
        <div className="w-full max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold tracking-wide uppercase">
            <Zap className="w-3.5 h-3.5 animate-pulse" />
            <span>Developer Portfolio Analytics &amp; Stat Cards</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight">
            Supercharge Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
              GitHub Presence
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Enter any GitHub username to generate a real-time portfolio analytics dashboard, 52-week contribution heatmaps, transparent impact scoring, and embeddable SVG README stat badges.
          </p>

          {/* Search Bar Form */}
          <div className="pt-4">
            <SearchForm />
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="w-full max-w-5xl mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-cyan-500/30 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
              <Award className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white mb-1">Transparent Impact Score</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              No black-box metrics. Transparent formula weighted by stars, forks, repositories, and consistency.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-blue-500/30 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3">
              <Flame className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white mb-1">Streak &amp; Heatmap Grid</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              52-week contribution calendar analysis tracking active days, year totals, and longest streaks.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-indigo-500/30 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white mb-1">Language Breakdown</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Recharts donut and stacked distribution charts weighted by codebase volume or star popularity.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-emerald-500/30 transition-colors">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
              <Code2 className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white mb-1">Embeddable SVG Badges</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Light &amp; dark vector SVG stat cards ready to paste into GitHub profile READMEs with one click.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-300">GitBoy Dashboard</span>
            <span>—</span>
            <span>Real-time GitHub activity &amp; portfolio intelligence</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Next.js App Router</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>Recharts</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
