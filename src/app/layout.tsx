import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GitBoy | GitHub Analytics Dashboard",
  description:
    "Real-time GitHub activity and portfolio analytics: contribution heatmaps, language breakdown, impact score, and embeddable SVG badges.",
  openGraph: {
    title: "GitBoy | GitHub Analytics Dashboard",
    description:
      "Turn any GitHub username into a shareable analytics dashboard.",
    url: "https://git-boy.vercel.app",
    siteName: "GitBoy",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
