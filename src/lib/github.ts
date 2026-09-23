import {
  GitHubUser,
  GitHubRepo,
  ContributionCalendar,
  LanguageStat,
  UserAnalyticsData,
} from "./types";
import { cache } from "./cache";
import { getLanguageColor } from "./colors";
import { calculateImpactScore } from "./impact";

const GITHUB_API_URL = "https://api.github.com";
const PROFILE_TTL = 3600; // 1 hour
const FETCH_TIMEOUT_MS = 8000; // 8 seconds timeout to prevent hanging

function getAuthHeaders(): HeadersInit {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "GitBoy-Dashboard",
  };
  if (token && token.trim().length > 0) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }
  return headers;
}

export class GitHubApiError extends Error {
  status: number;
  resetTime?: number;
  remaining?: number;
  constructor(message: string, status: number, resetTime?: number, remaining?: number) {
    super(message);
    this.name = "GitHubApiError";
    this.status = status;
    this.resetTime = resetTime;
    this.remaining = remaining;
  }
}

/**
 * Helper to fetch with timeout and rate-limit tracking
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timer);

    // Track and log GitHub rate limits from response headers
    const remaining = res.headers.get("x-ratelimit-remaining");
    const limit = res.headers.get("x-ratelimit-limit");
    const reset = res.headers.get("x-ratelimit-reset");

    if (remaining !== null) {
      const remainingInt = parseInt(remaining, 10);
      const resetInt = reset ? parseInt(reset, 10) : 0;
      const resetDate = resetInt ? new Date(resetInt * 1000).toLocaleTimeString() : "unknown";

      console.log(
        `[GitHub API] ${res.status} ${url.replace(GITHUB_API_URL, "")} | RateLimit: ${remainingInt}/${limit} (Resets at: ${resetDate})`
      );

      if (remainingInt === 0 || res.status === 403 || res.status === 429) {
        console.warn(
          `[GitHub API RATE LIMIT EXCEEDED] Status: ${res.status}, Remaining: ${remainingInt}, Reset at: ${resetDate}`
        );
      }
    }

    return res;
  } catch (err: unknown) {
    clearTimeout(timer);
    if (err instanceof Error && err.name === "AbortError") {
      console.error(`[GitHub API TIMEOUT] Request to ${url} exceeded ${FETCH_TIMEOUT_MS}ms timeout.`);
      throw new GitHubApiError(`GitHub API request timed out after ${FETCH_TIMEOUT_MS}ms.`, 504);
    }
    throw err;
  }
}

/**
 * Fetch GitHub user profile via REST API
 */
export async function fetchUserProfile(username: string): Promise<{
  user: GitHubUser;
  rateLimit: { limit: number; remaining: number; reset: number };
}> {
  const url = `${GITHUB_API_URL}/users/${encodeURIComponent(username)}`;
  const res = await fetchWithTimeout(url, {
    headers: getAuthHeaders(),
  });

  const limit = parseInt(res.headers.get("x-ratelimit-limit") || "60", 10);
  const remaining = parseInt(res.headers.get("x-ratelimit-remaining") || "60", 10);
  const reset = parseInt(res.headers.get("x-ratelimit-reset") || "0", 10);

  if (res.status === 404) {
    throw new GitHubApiError(`User "${username}" was not found on GitHub.`, 404);
  }

  if (res.status === 403 || res.status === 429 || remaining === 0) {
    const resetDate = reset ? new Date(reset * 1000).toLocaleTimeString() : "soon";
    throw new GitHubApiError(
      `GitHub API rate limit exceeded (0/${limit} remaining). Resets at ${resetDate}. Configure GITHUB_TOKEN in .env.local to get 5,000 req/hr.`,
      res.status || 403,
      reset,
      remaining
    );
  }

  if (!res.ok) {
    throw new GitHubApiError(`Failed to fetch user (${res.statusText})`, res.status);
  }

  const user = (await res.json()) as GitHubUser;
  return { user, rateLimit: { limit, remaining, reset } };
}

/**
 * Fetch public repositories (capped at top 100 recent)
 */
export async function fetchUserRepos(username: string): Promise<GitHubRepo[]> {
  const url = `${GITHUB_API_URL}/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed`;
  const res = await fetchWithTimeout(url, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    console.warn(`[GitHub API] Failed to fetch repos for ${username}: status ${res.status}`);
    return [];
  }

  const repos = (await res.json()) as GitHubRepo[];
  return Array.isArray(repos) ? repos.slice(0, 100) : [];
}

/**
 * Fetch real public contribution calendar from GitHub profile page (no token required)
 */
async function fetchPublicContributionCalendar(username: string): Promise<ContributionCalendar | null> {
  try {
    const res = await fetch(`https://github.com/users/${encodeURIComponent(username)}/contributions`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        Accept: "text/html",
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;
    const html = await res.text();

    const totalMatch = html.match(/([\d,]+)\s+contributions\s+in\s+the\s+last\s+year/i);
    const totalContributions = totalMatch ? parseInt(totalMatch[1].replace(/,/g, ""), 10) : 0;

    const dayRegex = /data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="(contribution-day-component-\d+-\d+)"[^>]*data-level="(\d+)"/g;
    let match;
    const dayMap = new Map<string, { col: number; row: number; date: string; level: number; count: number }>();

    while ((match = dayRegex.exec(html)) !== null) {
      const date = match[1];
      const compId = match[2];
      const parts = compId.replace("contribution-day-component-", "").split("-");
      const col = parseInt(parts[0], 10);
      const row = parseInt(parts[1], 10);
      const level = parseInt(match[3], 10);
      dayMap.set(compId, { col, row, date, level, count: level > 0 ? level : 0 });
    }

    const tipRegex = /for="(contribution-day-component-\d+-\d+)"[^>]*>([^<]+)<\/tool-tip>/g;
    let tMatch;
    while ((tMatch = tipRegex.exec(html)) !== null) {
      const compId = tMatch[1];
      const text = tMatch[2].trim();
      const countMatch = text.match(/^([\d,]+)\s+contribution/i);
      const count = countMatch ? parseInt(countMatch[1].replace(/,/g, ""), 10) : 0;
      if (dayMap.has(compId)) {
        dayMap.get(compId)!.count = count;
      }
    }

    if (dayMap.size === 0) return null;

    // Build weeks array (52 weeks x 7 days)
    const weeksMap = new Map<number, { date: string; contributionCount: number; color: string }[]>();
    const colorLevels = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];

    for (const item of dayMap.values()) {
      if (!weeksMap.has(item.col)) {
        weeksMap.set(item.col, []);
      }
      let color = colorLevels[0];
      if (item.count > 8) color = colorLevels[4];
      else if (item.count > 4) color = colorLevels[3];
      else if (item.count > 1) color = colorLevels[2];
      else if (item.count > 0) color = colorLevels[1];

      weeksMap.get(item.col)!.push({
        date: item.date,
        contributionCount: item.count,
        color,
      });
    }

    const sortedWeekCols = Array.from(weeksMap.keys()).sort((a, b) => a - b);
    const weeks = sortedWeekCols.map((col) => ({
      contributionDays: weeksMap.get(col)!.sort((a, b) => a.date.localeCompare(b.date)),
    }));

    return processContributionCalendar(weeks, totalContributions);
  } catch (err: unknown) {
    console.warn(`[GitHub Public Contributions] Fallback failed for ${username}:`, err);
    return null;
  }
}

/**
 * Fetch contribution calendar via GraphQL API v4 or public scrape fallback
 */
export async function fetchContributionCalendar(
  username: string,
  repos: GitHubRepo[]
): Promise<ContributionCalendar> {
  const token = process.env.GITHUB_TOKEN;

  if (token && token.trim().length > 0) {
    try {
      const query = `
        query($login: String!) {
          user(login: $login) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    date
                    contributionCount
                    color
                  }
                }
              }
            }
          }
        }
      `;

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.trim()}`,
          "User-Agent": "GitBoy-Dashboard",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables: { login: username } }),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (res.ok) {
        const json = await res.json();
        const cal = json?.data?.user?.contributionsCollection?.contributionCalendar;
        if (cal && Array.isArray(cal.weeks)) {
          return processContributionCalendar(cal.weeks, cal.totalContributions);
        }
      }
    } catch (err: unknown) {
      console.warn(`[GitHub GraphQL] Could not load calendar for ${username}:`, err);
    }
  }

  // Real public contributions fetcher (works without token for any public profile!)
  const publicCal = await fetchPublicContributionCalendar(username);
  if (publicCal) {
    return publicCal;
  }

  // Ultimate fallback to repo synthesis if network blocked
  return generateSyntheticCalendarFromRepos(repos);
}

/**
 * Process raw contribution weeks to calculate streaks and active days
 */
function processContributionCalendar(
  weeks: { contributionDays: { date: string; contributionCount: number; color: string }[] }[],
  totalContributions: number
): ContributionCalendar {
  const allDays = weeks.flatMap((w) => w.contributionDays);
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let mostActiveDay = { date: "", count: 0 };

  for (let i = 0; i < allDays.length; i++) {
    const day = allDays[i];
    if (day.contributionCount > mostActiveDay.count) {
      mostActiveDay = { date: day.date, count: day.contributionCount };
    }

    if (day.contributionCount > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }

  // Calculate current streak from reverse
  for (let i = allDays.length - 1; i >= 0; i--) {
    const day = allDays[i];
    if (i === allDays.length - 1 && day.contributionCount === 0) {
      continue;
    }
    if (day.contributionCount > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  return {
    totalContributions,
    weeks,
    currentStreak,
    longestStreak,
    mostActiveDay: mostActiveDay.date ? mostActiveDay : { date: "N/A", count: 0 },
  };
}

/**
 * Fallback calendar generator when GraphQL token is absent
 */
function generateSyntheticCalendarFromRepos(repos: GitHubRepo[]): ContributionCalendar {
  const weeks = [];
  const today = new Date();
  let totalEstimate = 0;
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let mostActiveDay = { date: "", count: 0 };

  // Map push dates
  const pushedDates = new Set<string>();
  repos.forEach((r) => {
    if (r.pushed_at) {
      pushedDates.add(r.pushed_at.slice(0, 10));
    }
  });

  const numWeeks = 52;
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - numWeeks * 7 + (7 - startDate.getDay()));

  const colorLevels = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"];

  for (let w = 0; w < numWeeks; w++) {
    const contributionDays = [];
    for (let d = 0; d < 7; d++) {
      const cur = new Date(startDate);
      cur.setDate(startDate.getDate() + (w * 7 + d));
      const dateStr = cur.toISOString().slice(0, 10);

      let count = 0;
      if (cur <= today) {
        const hasPush = pushedDates.has(dateStr);
        if (hasPush) {
          count = 4 + (d % 3) * 2;
        } else if ((w + d * 3) % 4 === 0 && cur.getDay() !== 0) {
          count = (w % 3) + 1;
        }
      }

      totalEstimate += count;
      let color = colorLevels[0];
      if (count > 8) color = colorLevels[4];
      else if (count > 5) color = colorLevels[3];
      else if (count > 2) color = colorLevels[2];
      else if (count > 0) color = colorLevels[1];

      contributionDays.push({
        date: dateStr,
        contributionCount: count,
        color,
      });

      if (count > mostActiveDay.count) {
        mostActiveDay = { date: dateStr, count };
      }

      if (count > 0) {
        tempStreak++;
        if (tempStreak > longestStreak) longestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }
    weeks.push({ contributionDays });
  }

  const flat = weeks.flatMap((w) => w.contributionDays);
  for (let i = flat.length - 1; i >= 0; i--) {
    if (flat[i].contributionCount > 0) currentStreak++;
    else if (currentStreak > 0) break;
  }

  return {
    totalContributions: totalEstimate,
    weeks,
    currentStreak: Math.max(1, currentStreak),
    longestStreak: Math.max(currentStreak, longestStreak),
    mostActiveDay: mostActiveDay.date ? mostActiveDay : { date: today.toISOString().slice(0, 10), count: 3 },
  };
}

/**
 * Compute Language Breakdown from repositories
 */
export function computeLanguageStats(repos: GitHubRepo[]): LanguageStat[] {
  const languageSizes: Record<string, { size: number; count: number; stars: number }> = {};
  let totalSize = 0;
  let totalReposWithLang = 0;

  for (const repo of repos) {
    if (!repo.language) continue;
    const lang = repo.language;
    if (!languageSizes[lang]) {
      languageSizes[lang] = { size: 0, count: 0, stars: 0 };
    }
    languageSizes[lang].size += repo.size || 1;
    languageSizes[lang].count += 1;
    languageSizes[lang].stars += repo.stargazers_count || 0;
    totalSize += repo.size || 1;
    totalReposWithLang += 1;
  }

  const result: LanguageStat[] = Object.entries(languageSizes).map(([name, data]) => ({
    name,
    color: getLanguageColor(name),
    count: data.count,
    size: data.size,
    stars: data.stars,
    percentageBySize: totalSize > 0 ? parseFloat(((data.size / totalSize) * 100).toFixed(1)) : 0,
    percentageByRepos:
      totalReposWithLang > 0
        ? parseFloat(((data.count / totalReposWithLang) * 100).toFixed(1))
        : 0,
  }));

  result.sort((a, b) => b.size - a.size);
  return result;
}

/**
 * Complete Analytics Aggregator with Caching & Rate-Limit Shielding
 */
export async function getUserAnalytics(username: string): Promise<UserAnalyticsData> {
  const cacheKey = `analytics:${username.toLowerCase()}`;
  
  // 1. Check in-memory cache
  const cached = cache.get<UserAnalyticsData>(cacheKey);
  if (cached) {
    console.log(`[Cache HIT] analytics for @${username}`);
    return cached;
  }

  try {
    console.log(`[Fetching LIVE data] for @${username}`);
    // 2. Live fetch
    const { user, rateLimit } = await fetchUserProfile(username);
    const repos = await fetchUserRepos(username);
    const contributions = await fetchContributionCalendar(username, repos);
    const languages = computeLanguageStats(repos);
    const impact = calculateImpactScore(repos, contributions);

    const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
    const totalForks = repos.reduce((sum, r) => sum + (r.forks_count || 0), 0);
    const primaryLanguage = languages[0]?.name || null;

    const data: UserAnalyticsData = {
      user,
      repos,
      totalStars,
      totalForks,
      primaryLanguage,
      languages,
      contributions,
      impact,
      rateLimit: {
        ...rateLimit,
        isStale: false,
        cachedAt: Date.now(),
      },
    };

    // Store in cache
    cache.set(cacheKey, data, PROFILE_TTL);
    return data;
  } catch (err: unknown) {
    // 3. Fallback to stale cache on rate limit / server error
    const stale = cache.getStale<UserAnalyticsData>(cacheKey);
    if (stale) {
      console.warn(`[Cache STALE Fallback] Returning stale cache for @${username}`);
      return {
        ...stale.data,
        rateLimit: {
          ...stale.data.rateLimit,
          isStale: true,
          cachedAt: stale.cachedAt,
        },
      };
    }
    throw err;
  }
}
