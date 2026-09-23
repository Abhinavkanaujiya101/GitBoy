export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  language: string | null;
  languages_url: string;
  size: number;
  topics: string[];
  updated_at: string;
  pushed_at: string;
  created_at: string;
  archived: boolean;
  license: {
    key: string;
    name: string;
    spdx_id: string;
  } | null;
}

export interface ContributionDay {
  date: string;
  contributionCount: number;
  color: string;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
  currentStreak: number;
  longestStreak: number;
  mostActiveDay: {
    date: string;
    count: number;
  };
}

export interface LanguageStat {
  name: string;
  color: string;
  count: number; // number of repos
  size: number; // bytes/size
  percentageBySize: number;
  percentageByRepos: number;
  stars: number;
}

export interface ImpactScoreBreakdown {
  score: number; // 0 - 100
  tier: "Novice Pioneer" | "Active Builder" | "Open Source Champion" | "Ecosystem Titan";
  tierColor: string;
  components: {
    starsScore: number;
    forksScore: number;
    starredReposScore: number;
    consistencyScore: number;
    streakBonus: number;
  };
  rawScore: number;
  formulaDescription: string;
}

export interface UserAnalyticsData {
  user: GitHubUser;
  repos: GitHubRepo[];
  totalStars: number;
  totalForks: number;
  primaryLanguage: string | null;
  languages: LanguageStat[];
  contributions: ContributionCalendar;
  impact: ImpactScoreBreakdown;
  rateLimit: {
    limit: number;
    remaining: number;
    reset: number;
    isStale: boolean;
    cachedAt: number;
  };
}
