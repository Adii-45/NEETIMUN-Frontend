import type { Metadata } from "next";
import { Hero } from "@/components/sections/committees/Hero";
import { CommitteeGrid } from "@/components/sections/committees/CommitteeGrid";
import { BeyondDebate } from "@/components/sections/committees/BeyondDebate";
import { CTABanner } from "@/components/ui/CTABanner";

export const metadata: Metadata = {
  title: "Committees | NEETI MUN 2026",
  description:
    "Explore the 2026 committee portfolios — Black Budget Council, World Summit 2040, UNODC, AIPPM, India and the Mic, and International Press.",
};

export default function CommitteesPage() {
  return (
    <>
      <Hero />
      <CommitteeGrid />
      <BeyondDebate />
      <CTABanner
        title="Ready to Represent?"
        subtitle="Join the ranks of global strategists and diplomats. Selection for premium committees is highly competitive."
        primaryCta={{ label: "View All Committees", href: "/committees" }}
        secondaryCta={{
          label: "Download Delegate Handbook",
          href: "/committees",
        }}
      />
    </>
  );
}
