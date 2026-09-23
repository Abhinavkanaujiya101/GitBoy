"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  MapPin,
  Building,
  Link as LinkIcon,
  Calendar,
  Users,
  ExternalLink,
  Share2,
  Check,
  Code2,
  AlertTriangle,
} from "lucide-react";
import { GitHubUser } from "@/lib/types";

interface ProfileHeaderProps {
  user: GitHubUser;
  isStale?: boolean;
  onOpenBadgeModal: () => void;
}

export default function ProfileHeader({
  user,
  isStale,
  onOpenBadgeModal,
}: ProfileHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const formattedJoinDate = new Date(user.created_at).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {isStale && (
        <div className="mb-6 flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 text-xs sm:text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            Notice: Showing cached snapshot due to GitHub API rate limits. Data will refresh automatically.
          </span>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6 md:items-start justify-between">
        {/* Left: Avatar + Details */}
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden ring-2 ring-cyan-500/40 shadow-xl shadow-cyan-500/10 relative">
              <Image
                src={user.avatar_url}
                alt={user.name || user.login}
                width={112}
                height={112}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded-full text-[10px] font-mono text-cyan-400 font-semibold shadow">
              #{user.id.toString().slice(-4)}
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {user.name || user.login}
                </h1>
                <Link
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1"
                >
                  @{user.login}
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {user.bio && (
                <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                  {user.bio}
                </p>
              )}
            </div>

            {/* Meta details list */}
            <div className="flex flex-wrap gap-x-5 gap-y-2 pt-2 text-xs sm:text-sm text-slate-400">
              {user.company && (
                <div className="flex items-center gap-1.5">
                  <Building className="w-4 h-4 text-slate-500" />
                  <span>{user.company}</span>
                </div>
              )}
              {user.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span>{user.location}</span>
                </div>
              )}
              {user.blog && (
                <div className="flex items-center gap-1.5">
                  <LinkIcon className="w-4 h-4 text-slate-500" />
                  <a
                    href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cyan-400 underline underline-offset-2 truncate max-w-[200px]"
                  >
                    {user.blog.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              )}
              {user.twitter_username && (
                <div className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 fill-slate-500" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <a
                    href={`https://twitter.com/${user.twitter_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-cyan-400"
                  >
                    @{user.twitter_username}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>Joined {formattedJoinDate}</span>
              </div>
            </div>

            {/* Followers / Following counts */}
            <div className="flex items-center gap-4 pt-1 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white">
                  {user.followers.toLocaleString()}
                </span>
                <span className="text-slate-400">followers</span>
              </div>
              <span className="text-slate-700">•</span>
              <div>
                <span className="font-bold text-white">
                  {user.following.toLocaleString()}
                </span>{" "}
                <span className="text-slate-400">following</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex flex-row md:flex-col gap-2.5 shrink-0 pt-2 md:pt-0">
          <button
            onClick={onOpenBadgeModal}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 text-cyan-300 border border-cyan-500/40 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm shadow-lg shadow-cyan-500/10 transition-all cursor-pointer"
          >
            <Code2 className="w-4 h-4" />
            <span>Embed SVG Badge</span>
          </button>

          <button
            onClick={handleShare}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-slate-400" />
                <span>Share Profile</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
