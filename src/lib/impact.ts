import { ImpactScoreBreakdown, GitHubRepo, ContributionCalendar } from "./types";

/**
 * GitBoy Impact Score Engine
 * 
 * Formula:
 * rawScore = (totalStars * 2.0)
 *          + (totalForks * 1.5)
 *          + (reposWithStars * 3.0)
 *          + (totalContributions * 0.25)
 *          + (longestStreak * 1.0)
 *          + (currentStreak * 0.5)
 * 
 * Normalized 0-100 Scale:
 * Uses a progressive logarithmic curve designed to make scores between 20-80 achievable
 * for active open source developers while retaining head-room for ecosystem creators.
 */
export function calculateImpactScore(
  repos: GitHubRepo[],
  contributions: ContributionCalendar
): ImpactScoreBreakdown {
  const totalStars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
  const totalForks = repos.reduce((acc, r) => acc + (r.forks_count || 0), 0);
  const reposWithStars = repos.filter((r) => (r.stargazers_count || 0) > 0).length;
  const totalContributions = contributions.totalContributions || 0;
  const longestStreak = contributions.longestStreak || 0;
  const currentStreak = contributions.currentStreak || 0;

  const starsScore = totalStars * 2.0;
  const forksScore = totalForks * 1.5;
  const starredReposScore = reposWithStars * 3.0;
  const consistencyScore = Math.round(totalContributions * 0.25);
  const streakBonus = Math.round(longestStreak * 1.0 + currentStreak * 0.5);

  const rawScore = Math.round(
    starsScore + forksScore + starredReposScore + consistencyScore + streakBonus
  );

  // Progressive normalization: 
  // score = (raw / (raw + k)) * 100 with k = 350
  // When raw = 0 -> 0
  // When raw = 350 -> 50
  // When raw = 1400 -> 80
  // When raw = 5000 -> 93
  // When raw = 15000 -> 98
  const k = 380;
  let normalized = 0;
  if (rawScore > 0) {
    normalized = Math.min(100, Math.max(1, Math.round((rawScore / (rawScore + k)) * 100)));
  }

  let tier: ImpactScoreBreakdown["tier"] = "Novice Pioneer";
  let tierColor = "#94a3b8"; // slate

  if (normalized >= 85) {
    tier = "Ecosystem Titan";
    tierColor = "#a855f7"; // purple
  } else if (normalized >= 65) {
    tier = "Open Source Champion";
    tierColor = "#3b82f6"; // blue
  } else if (normalized >= 35) {
    tier = "Active Builder";
    tierColor = "#10b981"; // emerald
  }

  const formulaDescription =
    "Impact Score = (Stars × 2.0) + (Forks × 1.5) + (Starred Repos × 3.0) + (Contributions × 0.25) + (Streak × 1.5), normalized to 0–100 scale.";

  return {
    score: normalized,
    tier,
    tierColor,
    components: {
      starsScore: Math.round(starsScore),
      forksScore: Math.round(forksScore),
      starredReposScore,
      consistencyScore,
      streakBonus,
    },
    rawScore,
    formulaDescription,
  };
}
