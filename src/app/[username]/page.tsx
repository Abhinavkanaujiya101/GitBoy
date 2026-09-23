import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import DashboardClient from "@/components/DashboardClient";
import SearchForm from "@/components/SearchForm";
import { getUserAnalytics, GitHubApiError } from "@/lib/github";
import { AlertCircle, UserX, ArrowLeft, Clock } from "lucide-react";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `${username} - GitBoy Analytics Dashboard`,
    description: `Real-time GitHub activity, language breakdown, contribution heatmap, and impact score for @${username}.`,
  };
}

export default async function UserProfilePage({ params }: PageProps) {
  const { username } = await params;

  try {
    const data = await getUserAnalytics(username);

    return (
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
        <Navbar currentUsername={data.user.login} />
        <main className="flex-1">
          <DashboardClient data={data} />
        </main>
      </div>
    );
  } catch (error: unknown) {
    if (error instanceof GitHubApiError) {
      if (error.status === 404) {
        return (
          <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
            <Navbar />
            <main className="flex-1 flex flex-col items-center justify-center p-4">
              <div className="glass-panel max-w-lg w-full p-8 rounded-2xl border border-slate-800 text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
                  <UserX className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-white">Developer Not Found</h1>
                  <p className="text-sm text-slate-400">
                    We could not find any GitHub user with the handle{" "}
                    <span className="font-mono text-cyan-400 font-semibold">@{username}</span>.
                    Please check the spelling and try again.
                  </p>
                </div>

                <div className="pt-2">
                  <SearchForm />
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Return to Home</span>
                  </Link>
                </div>
              </div>
            </main>
          </div>
        );
      }

      if (error.status === 403 || error.status === 429) {
        const resetDate = error.resetTime
          ? new Date(error.resetTime * 1000).toLocaleTimeString()
          : "in a few minutes";

        return (
          <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
            <Navbar />
            <main className="flex-1 flex flex-col items-center justify-center p-4">
              <div className="glass-panel max-w-lg w-full p-8 rounded-2xl border border-amber-500/30 text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center">
                  <Clock className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-white">Rate Limit Exceeded</h1>
                  <p className="text-sm text-slate-400">
                    GitHub API hourly rate limit for unauthenticated requests was reached.
                  </p>
                  <p className="text-xs text-amber-400/90 font-mono bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20">
                    Limit resets at: {resetDate}
                  </p>
                  <p className="text-xs text-slate-500 pt-2">
                    Tip: Add a <code className="text-slate-300">GITHUB_TOKEN</code> to your{" "}
                    <code className="text-slate-300">.env.local</code> to increase the limit to 5,000 req/hour!
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Return to Home</span>
                  </Link>
                </div>
              </div>
            </main>
          </div>
        );
      }
    }

    return (
      <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full p-8 rounded-2xl border border-slate-800 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 mx-auto flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-white">Unable to Load Profile</h1>
            <p className="text-sm text-slate-400">
              An unexpected error occurred while communicating with the GitHub API.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors pt-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Try another user</span>
            </Link>
          </div>
        </main>
      </div>
    );
  }
}
