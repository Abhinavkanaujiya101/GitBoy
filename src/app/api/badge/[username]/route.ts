import { NextRequest, NextResponse } from "next/server";
import { getUserAnalytics } from "@/lib/github";
import { generateSvgBadge } from "@/lib/badge";
import { cache } from "@/lib/cache";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const searchParams = request.nextUrl.searchParams;
  const theme = (searchParams.get("theme") as "dark" | "light") || "dark";

  if (!username) {
    return new NextResponse("Username required", { status: 400 });
  }

  const badgeCacheKey = `badge:${username.toLowerCase()}:${theme}`;
  const cachedSvg = cache.get<string>(badgeCacheKey);

  if (cachedSvg) {
    return new NextResponse(cachedSvg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=7200, stale-while-revalidate=86400",
      },
    });
  }

  try {
    const data = await getUserAnalytics(username);
    const svg = generateSvgBadge(data, { theme });

    // Cache SVG for 2 hours (7200s)
    cache.set(badgeCacheKey, svg, 7200);

    return new NextResponse(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=7200, stale-while-revalidate=86400",
      },
    });
  } catch (err: unknown) {
    console.error(`[Badge API Error] Failed to generate badge for ${username}:`, err);
    // Generate graceful fallback SVG on error so README badge isn't broken
    const errorSvg = `
<svg width="400" height="80" viewBox="0 0 400 80" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="80" rx="10" fill="#0f172a" stroke="#ef4444" stroke-width="1.5" />
  <circle cx="36" cy="40" r="16" fill="#ef4444" fill-opacity="0.2" />
  <path d="M36 32V42M36 48H36.01" stroke="#ef4444" stroke-width="2" stroke-linecap="round" />
  <text x="64" y="36" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="700" fill="#f8fafc">
    GitBoy: User not found
  </text>
  <text x="64" y="54" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" fill="#94a3b8">
    Could not load analytics for @${username}
  </text>
</svg>
`.trim();

    return new NextResponse(errorSvg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "no-cache",
      },
    });
  }
}
