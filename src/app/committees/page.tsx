import type { Metadata } from "next";
import { Hero } from "@/components/sections/committees/Hero";
import { CommitteeGrid } from "@/components/sections/committees/CommitteeGrid";
import { CTABanner } from "@/components/ui/CTABanner";

export const metadata: Metadata = {
  title: "Committees | NEETI MUN 2026",
  description:
    "Explore the 2026 committee portfolios — UNODC, AIPPM, Black Budget Council, and the 2040 Global Summit.",
};

export default function CommitteesPage() {
  return (
    <>
      <Hero />
      <CommitteeGrid />
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
