import type { Metadata } from "next";
import { PolicyHero } from "@/components/policy/PolicyHero";
import { PolicyLayout } from "@/components/policy/PolicyLayout";
import {
  CodeOfConductContent,
  CODE_OF_CONDUCT_SECTIONS,
} from "@/components/sections/policy/CodeOfConductContent";
import { POLICY_EFFECTIVE_DATE, POLICY_LAST_UPDATED } from "@/lib/data/policy";

export const metadata: Metadata = {
  title: "Code of Conduct | NEETI MUN 2026",
  description:
    "The standards of respect, professionalism, and diplomacy expected of every NEETI MUN participant, and how to report a concern.",
  alternates: {
    canonical: "/code-of-conduct",
  },
};

export default function CodeOfConductPage() {
  return (
    <>
      <PolicyHero
        title="Code of Conduct"
        intro="NEETI MUN is committed to a safe, respectful, inclusive, and professionally conducted conference for every participant."
        effectiveDate={POLICY_EFFECTIVE_DATE}
        lastUpdated={POLICY_LAST_UPDATED}
      />
      <PolicyLayout sections={CODE_OF_CONDUCT_SECTIONS}>
        <CodeOfConductContent />
      </PolicyLayout>
    </>
  );
}
