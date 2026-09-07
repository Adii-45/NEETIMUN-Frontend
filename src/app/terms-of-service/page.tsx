import type { Metadata } from "next";
import { PolicyHero } from "@/components/policy/PolicyHero";
import { PolicyLayout } from "@/components/policy/PolicyLayout";
import {
  TermsOfServiceContent,
  TERMS_OF_SERVICE_SECTIONS,
} from "@/components/sections/policy/TermsOfServiceContent";
import { POLICY_EFFECTIVE_DATE, POLICY_LAST_UPDATED } from "@/lib/data/policy";

export const metadata: Metadata = {
  title: "Terms of Service | NEETI MUN 2026",
  description:
    "The terms governing registration, payment, participation, and use of the NEETI MUN website and conference.",
  alternates: {
    canonical: "/terms-of-service",
  },
};

export default function TermsOfServicePage() {
  return (
    <>
      <PolicyHero
        title="Terms of Service"
        intro="The terms governing registration, payment, and participation in the NEETI MUN conference."
        effectiveDate={POLICY_EFFECTIVE_DATE}
        lastUpdated={POLICY_LAST_UPDATED}
      />
      <PolicyLayout sections={TERMS_OF_SERVICE_SECTIONS}>
        <TermsOfServiceContent />
      </PolicyLayout>
    </>
  );
}
