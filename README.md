<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f2027,50:203a43,100:2c5364&height=200&section=header&text=✨GitBoy&fontSize=52&fontColor=ffffff&animation=fadeIn&fontAlignY=50" width="100%" />

**Real-Time GitHub Activity & Portfolio Analytics Dashboard**

[Live Demo](https://git-boy.vercel.app) · [Report Bug](https://github.com/Abhinavkanaujiya101/GitBoy/issues) · [Request Feature](https://github.com/Abhinavkanaujiya101/GitBoy/issues)

![Next.js](https://img.shields.io/badge/Next.js-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

</div>

---

GitBoy is a modern, developer-focused web application that transforms any GitHub username into a shareable, interactive portfolio analytics dashboard. It also generates exportable, embeddable vector SVG stat badges for your GitHub READMEs.

---

## 🚀 Features

- **Instant Profile Analytics**: Enter any GitHub username to fetch profile details, follower counts, and total repository statistics.
- **52-Week Contribution Heatmap**: Visualizes the last 12 months of commit activity in a GitHub-style calendar grid, with current streak, longest streak, and active day tracking.
- **Language Breakdown**: Recharts donut chart with official GitHub language colors, switchable between *By Codebase Size* and *By Star Weight*.
- **Top Repositories Showcase**: Ranked repository list with sorting (Stars, Forks, Recently Updated), topic tags, licenses, and search filtering.
- **Transparent Impact Score**: A normalized 0–100 open-source footprint score with a fully documented formula and breakdown modal.
- **Dynamic SVG Stat Badges**: Clean, embeddable vector cards at `/api/badge/[username]?theme=dark|light`, with one-click Markdown copy for README files.
- **API Shielding & Caching**: Built-in 1-hour in-memory TTL cache with stale-while-revalidate fallback on rate limits and 8-second fetch timeouts.

---

## 🛠️ Tech Stack

| Category | Technology |
| -------- | ---------- |
| Framework | [Next.js](https://nextjs.org/) (App Router, Server Components & Route Handlers) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Charts | [Recharts](https://recharts.org/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Data Sources | GitHub REST API v3, GitHub GraphQL API v4, public contribution scrapers |
| Caching | In-memory Map with TTL (designed to swap with Redis in production) |

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

### 3. Environment variables (optional)

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Add a GitHub Personal Access Token to raise the rate limit from 60 to 5,000 requests/hour:

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

Add this to any GitHub profile README (replace `YOUR_USERNAME`):

```markdown
[![GitBoy Analytics](https://git-boy.vercel.app/api/badge/YOUR_USERNAME?theme=dark)](https://git-boy.vercel.app/YOUR_USERNAME)
```

### Query Parameters

| Parameter | Values | Default |
| --------- | ------ | ------- |
| `theme` | `dark`, `light` | `dark` |

---

## 📊 Impact Score Formula

$$\text{Raw Score} = (\text{Stars} \times 2.0) + (\text{Forks} \times 1.5) + (\text{Starred Repos} \times 3.0) + (\text{Contributions} \times 0.25) + (\text{Streak Bonus})$$

The raw score is normalized to a 0–100 scale using progressive logarithmic smoothing:

$$\text{Score} = \min\left(100, \text{round}\left(\frac{\text{Raw}}{\text{Raw} + 380} \times 100\right)\right)$$

| Score Range  | Contributor Tier     |
| ------------ | -------------------- |
| **0 – 34**   | Novice Pioneer       |
| **35 – 64**  | Active Builder       |
| **65 – 84**  | Open Source Champion |
| **85 – 100** | Ecosystem Titan      |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Abhinavkanaujiya101/GitBoy/issues).

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m "Add AmazingFeature"`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License.

---

## 👨‍💻 Author

<div align="center">

**Abhinav Kanaujiya**

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Abhinavkanaujiya101)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/abhinav-kanaujiya-781422343/)
[![LeetCode](https://img.shields.io/badge/LeetCode-FFA116?style=for-the-badge&logo=leetcode&logoColor=black)](https://leetcode.com/u/AbhinavKanaujiya/)

<br/>

⭐ **If you like this project, give it a star!** ⭐

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:2c5364,50:203a43,100:0f2027&height=100&section=footer" width="100%" />

</div>
