import type { Metadata } from "next";
import { Suspense } from "react";
import { certificates } from "@/data/certificates";
import { AchievementsHero } from "@/components/achievements/hero";
import { AchievementsThreshold } from "@/components/achievements/threshold";
import { AchievementsIndex } from "@/components/achievements/index-section";
import { AchievementsClosing } from "@/components/achievements/closing";
import { AchievementsFooter } from "@/components/achievements/footer";

const trackCount = new Set(certificates.map((c) => c.track ?? "Other")).size;

export const metadata: Metadata = {
  title: "Achievements — Archive",
  description: `${certificates.length} certificates across ${trackCount} tracks, ordered by track.`,
};

export default function AchievementsPage() {
  return (
    <div className="min-h-screen">
      <AchievementsHero />
      <AchievementsThreshold />
      <Suspense fallback={null}>
        <AchievementsIndex />
      </Suspense>
      <AchievementsClosing />
      <AchievementsFooter />
    </div>
  );
}
