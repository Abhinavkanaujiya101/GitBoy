"use client";

import { useState } from "react";
import { X, Copy, Check, ExternalLink, Moon, Sun, Sparkles } from "lucide-react";

interface BadgeEmbedModalProps {
  username: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function BadgeEmbedModal({
  username,
  isOpen,
  onClose,
}: BadgeEmbedModalProps) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const origin = typeof window !== "undefined" ? window.location.origin : "https://gitboy.dev";
  const badgeUrl = `${origin}/api/badge/${username}?theme=${theme}`;
  const profileUrl = `${origin}/${username}`;

  const markdownSnippet = `[![GitBoy Analytics](${badgeUrl})](${profileUrl})`;
  const htmlSnippet = `<a href="${profileUrl}">\n  <img src="${badgeUrl}" alt="GitBoy Analytics" />\n</a>`;

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-white text-base">Embeddable SVG Stat Badge</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Theme Selector */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Badge Theme Preview
            </span>
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
              <button
                onClick={() => setTheme("dark")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  theme === "dark"
                    ? "bg-slate-800 text-cyan-400 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Dark</span>
              </button>
              <button
                onClick={() => setTheme("light")}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  theme === "light"
                    ? "bg-slate-800 text-cyan-400 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Light</span>
              </button>
            </div>
          </div>

          {/* Live SVG Preview */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-center transition-colors ${
              theme === "dark"
                ? "bg-slate-950 border-slate-800"
                : "bg-slate-100 border-slate-300"
            }`}
          >
            {/* Direct embedded SVG image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/badge/${username}?theme=${theme}`}
              alt={`GitBoy Stat Badge for ${username}`}
              className="max-w-full h-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Snippet 1: Markdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">
                Markdown (for GitHub README.md)
              </label>
              <button
                onClick={() => handleCopy(markdownSnippet, "markdown")}
                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
              >
                {copiedType === "markdown" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Markdown</span>
                  </>
                )}
              </button>
            </div>
            <pre className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap break-all">
              {markdownSnippet}
            </pre>
          </div>

          {/* Snippet 2: Direct Image URL */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">Raw SVG URL</label>
              <div className="flex items-center gap-3">
                <a
                  href={`/api/badge/${username}?theme=${theme}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Tab</span>
                </a>
                <button
                  onClick={() => handleCopy(badgeUrl, "url")}
                  className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium cursor-pointer"
                >
                  {copiedType === "url" ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <pre className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs font-mono text-slate-400 overflow-x-auto whitespace-pre-wrap break-all">
              {badgeUrl}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-950/60 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
