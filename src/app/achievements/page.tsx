import type { Metadata } from "next";
import { Suspense } from "react";
import { AchievementsHero } from "@/components/achievements/hero";
import { AchievementsIndex } from "@/components/achievements/index-section";
import { AchievementsThreshold } from "@/components/achievements/threshold";
import { AchievementsFooter } from "@/components/achievements/footer";

export const metadata: Metadata = {
  title: "Archive",
  description: "A collection of learning milestones behind the work I build.",
};

export default function AchievementsPage() {
  return (
    <div className="min-h-screen">
      <AchievementsHero />
      <Suspense fallback={null}>
        <AchievementsIndex />
      </Suspense>
      <AchievementsThreshold />
      <AchievementsFooter />
    </div>
  );
}
