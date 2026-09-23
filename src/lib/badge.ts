import { UserAnalyticsData } from "./types";

interface BadgeOptions {
  theme?: "dark" | "light";
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
}

export function generateSvgBadge(
  data: UserAnalyticsData,
  options: BadgeOptions = {}
): string {
  const isDark = options.theme !== "light";
  const { user, totalStars, totalForks, contributions, impact, languages } = data;

  const bgGradientStart = isDark ? "#0f172a" : "#ffffff";
  const bgGradientEnd = isDark ? "#090d16" : "#f8fafc";
  const borderColor = isDark ? "#1e293b" : "#e2e8f0";
  const titleColor = isDark ? "#f8fafc" : "#0f172a";
  const subtitleColor = isDark ? "#94a3b8" : "#64748b";
  const statBoxBg = isDark ? "rgba(30, 41, 59, 0.6)" : "rgba(241, 245, 249, 0.8)";
  const statBoxBorder = isDark ? "rgba(51, 65, 85, 0.5)" : "rgba(203, 213, 225, 0.6)";
  const statValueColor = isDark ? "#f1f5f9" : "#1e293b";
  const statLabelColor = isDark ? "#94a3b8" : "#64748b";

  const displayName = escapeXml(user.name || user.login);
  const handle = escapeXml(`@${user.login}`);
  const topLangs = languages.slice(0, 3);

  // Language dots SVG
  const langItems = topLangs
    .map((l, i) => {
      const xOffset = 28 + i * 135;
      return `
        <g transform="translate(${xOffset}, 175)">
          <circle cx="5" cy="5" r="4.5" fill="${escapeXml(l.color)}" />
          <text x="14" y="9" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="500" fill="${subtitleColor}">
            ${escapeXml(l.name)} <tspan font-weight="600" fill="${titleColor}">${l.percentageBySize}%</tspan>
          </text>
        </g>
      `;
    })
    .join("");

  return `
<svg width="495" height="205" viewBox="0 0 495 205" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0" y1="0" x2="495" y2="205" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${bgGradientStart}" />
      <stop offset="100%" stop-color="${bgGradientEnd}" />
    </linearGradient>
    <linearGradient id="impactGradient" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>
    <clipPath id="avatarClip">
      <circle cx="48" cy="48" r="24" />
    </clipPath>
    <filter id="cardShadow" x="-10" y="-10" width="515" height="225" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="${isDark ? "0.4" : "0.08"}" />
    </filter>
  </defs>

  <!-- Card Background -->
  <rect x="1" y="1" width="493" height="203" rx="14" fill="url(#bgGradient)" stroke="${borderColor}" stroke-width="1.5" filter="url(#cardShadow)" />

  <!-- Avatar & User Info -->
  <g transform="translate(24, 22)">
    <!-- Avatar circle -->
    <image href="${escapeXml(user.avatar_url)}" x="0" y="0" width="48" height="48" clip-path="url(#avatarClip)" preserveAspectRatio="xMidYMid slice" />
    <circle cx="24" cy="24" r="24" stroke="${borderColor}" stroke-width="1.5" fill="none" />

    <!-- Name & Handle -->
    <text x="58" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" fill="${titleColor}">
      ${displayName}
    </text>
    <text x="58" y="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="400" fill="${subtitleColor}">
      ${handle}
    </text>
  </g>

  <!-- Impact Score Badge -->
  <g transform="translate(345, 24)">
    <rect width="124" height="42" rx="10" fill="${statBoxBg}" stroke="${impact.tierColor}" stroke-width="1.2" />
    <text x="14" y="18" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" text-transform="uppercase" letter-spacing="0.5" fill="${impact.tierColor}">
      IMPACT SCORE
    </text>
    <text x="14" y="34" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="${titleColor}">
      ${impact.score}<tspan font-size="11" font-weight="500" fill="${subtitleColor}"> / 100</tspan>
    </text>
  </g>

  <!-- Stat Metric Boxes (4 columns) -->
  <!-- Stars -->
  <g transform="translate(24, 86)">
    <rect width="102" height="66" rx="8" fill="${statBoxBg}" stroke="${statBoxBorder}" stroke-width="1" />
    <path d="M14 16L15.5 20.5H20.2L16.4 23.3L17.8 27.8L14 25L10.2 27.8L11.6 23.3L7.8 20.5H12.5L14 16Z" fill="#eab308" />
    <text x="26" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="500" fill="${statLabelColor}">Stars</text>
    <text x="14" y="50" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="700" fill="${statValueColor}">${formatNumber(totalStars)}</text>
  </g>

  <!-- Forks -->
  <g transform="translate(138, 86)">
    <rect width="102" height="66" rx="8" fill="${statBoxBg}" stroke="${statBoxBorder}" stroke-width="1" />
    <circle cx="15" cy="18" r="2.5" fill="#3b82f6" />
    <circle cx="21" cy="24" r="2.5" fill="#3b82f6" />
    <circle cx="15" cy="26" r="2.5" fill="#3b82f6" />
    <text x="28" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="500" fill="${statLabelColor}">Forks</text>
    <text x="14" y="50" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="700" fill="${statValueColor}">${formatNumber(totalForks)}</text>
  </g>

  <!-- Contributions -->
  <g transform="translate(252, 86)">
    <rect width="102" height="66" rx="8" fill="${statBoxBg}" stroke="${statBoxBorder}" stroke-width="1" />
    <circle cx="16" cy="21" r="4" fill="#10b981" />
    <text x="26" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="500" fill="${statLabelColor}">Year Commits</text>
    <text x="14" y="50" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="700" fill="${statValueColor}">${formatNumber(contributions.totalContributions)}</text>
  </g>

  <!-- Streak -->
  <g transform="translate(366, 86)">
    <rect width="102" height="66" rx="8" fill="${statBoxBg}" stroke="${statBoxBorder}" stroke-width="1" />
    <path d="M14 16C14 16 16.5 19 16.5 21C16.5 22.4 15.4 23.5 14 23.5C12.6 23.5 11.5 22.4 11.5 21C11.5 19 14 16 14 16Z" fill="#f97316" />
    <text x="25" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="500" fill="${statLabelColor}">Streak</text>
    <text x="14" y="50" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="700" fill="${statValueColor}">${contributions.currentStreak} <tspan font-size="11" font-weight="500" fill="${statLabelColor}">days</tspan></text>
  </g>

  <!-- Language Indicators -->
  ${langItems}

  <!-- GitBoy Brand Footer Mark -->
  <g transform="translate(420, 185)">
    <text font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="700" fill="${subtitleColor}" letter-spacing="1">GITBOY</text>
  </g>
</svg>
`.trim();
}
