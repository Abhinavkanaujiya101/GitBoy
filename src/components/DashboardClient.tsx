"use client";

import { useState } from "react";
import { UserAnalyticsData } from "@/lib/types";
import ProfileHeader from "./ProfileHeader";
import StatCards from "./StatCards";
import ImpactScoreCard from "./ImpactScoreCard";
import LanguageBreakdown from "./LanguageBreakdown";
import ContributionHeatmap from "./ContributionHeatmap";
import TopReposList from "./TopReposList";
import BadgeEmbedModal from "./BadgeEmbedModal";

interface DashboardClientProps {
  data: UserAnalyticsData;
}

export default function DashboardClient({ data }: DashboardClientProps) {
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. Profile Header */}
      <ProfileHeader
        user={data.user}
        isStale={data.rateLimit?.isStale}
        onOpenBadgeModal={() => setIsBadgeModalOpen(true)}
      />

      {/* 2. Stat Metric Cards */}
      <StatCards
        totalRepos={data.user.public_repos}
        totalStars={data.totalStars}
        totalForks={data.totalForks}
        primaryLanguage={data.primaryLanguage}
      />

      {/* 3. Impact Score Card */}
      <ImpactScoreCard impact={data.impact} />

      {/* 4. Contribution Heatmap Grid */}
      <ContributionHeatmap contributions={data.contributions} />

      {/* 5. Language Breakdown + Top Repos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 space-y-6">
          <LanguageBreakdown languages={data.languages} />
        </div>
        <div className="lg:col-span-7">
          <TopReposList repos={data.repos} />
        </div>
      </div>

      {/* 6. Dynamic SVG Embed Modal */}
      <BadgeEmbedModal
        username={data.user.login}
        isOpen={isBadgeModalOpen}
        onClose={() => setIsBadgeModalOpen(false)}
      />
    </div>
  );
}
