# ⚡ GitBoy

> **Real-Time GitHub Activity & Portfolio Analytics Dashboard**

GitBoy is a modern, developer-focused web application that transforms any GitHub username into a shareable, interactive portfolio analytics dashboard and generates exportable, embeddable vector SVG stat badges for your GitHub READMEs.

---

## 🚀 Live Features

- **Instant Profile Analytics**: Input any GitHub username to fetch profile details, follower counts, and total repository statistics.
- **52-Week Contribution Heatmap**: Visualizes the last 12 months of commit activity in a GitHub-style calendar grid with current streak, longest streak, and active day tracking.
- **Language Breakdown**: Recharts donut chart with official GitHub language colors and toggle between *By Codebase Size* and *By Star Weight*.
- **Top Repositories Showcase**: Ranked repository list with sorting (Stars, Forks, Recently Updated), topic tags, licenses, and search filtering.
- **Transparent Impact Score**: A normalized 0–100 open-source footprint score with a fully documented formula and breakdown modal.
- **Dynamic SVG Stat Badges**: Clean, embeddable vector cards available at `/api/badge/[username]?theme=dark|light` with one-click Markdown copy for README files.
- **API Shielding & Caching**: Built-in 1-hour in-memory TTL caching with stale-while-revalidate fallbacks on rate limits and 8-second fetch timeouts.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Components & Route Handlers)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Sources**: GitHub REST API v3, GitHub GraphQL API v4, and public contribution scrapers.
- **Caching**: In-Memory Map with TTL (designed to swap with Redis in production).

---

## 📦 Getting Started

### Prerequisites
- Node.js 18.17 or higher
- npm, yarn, or pnpm

### 1. Clone the repository
```bash
git clone https://github.com/Abhinavkanaujiya101/GitBoy.git
cd GitBoy
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(Optional)* Add a GitHub Personal Access Token to increase the rate limit from 60 to 5,000 req/hour:
```env
GITHUB_TOKEN=ghp_your_token_here
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🖼️ Embeddable SVG Stat Badges

GitBoy provides an API endpoint that generates dynamic SVG images ready to embed in any GitHub profile README:

```markdown
[![GitBoy Analytics](https://gitboy.dev/api/badge/Abhinavkanaujiya101?theme=dark)](https://gitboy.dev/Abhinavkanaujiya101)
```

### Query Parameters
- `theme`: `dark` (default) or `light`

---

## 📊 Impact Score Formula

$$\text{Raw Score} = (\text{Stars} \times 2.0) + (\text{Forks} \times 1.5) + (\text{Starred Repos} \times 3.0) + (\text{Contributions} \times 0.25) + (\text{Streak Bonus})$$

Normalized to a 0–100 scale using progressive logarithmic smoothing:
$$\text{Score} = \min\left(100, \operatorname{round}\left(\frac{\text{Raw}}{\text{Raw} + 380} \times 100\right)\right)$$

| Score Range | Contributor Tier |
| :--- | :--- |
| **0 – 34** | Novice Pioneer |
| **35 – 64** | Active Builder |
| **65 – 84** | Open Source Champion |
| **85 – 100** | Ecosystem Titan |

---

## 📄 License

MIT License. Built for developers by developers.
