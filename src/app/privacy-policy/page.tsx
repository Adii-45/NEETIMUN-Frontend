import type { Metadata } from "next";
import { PolicyHero } from "@/components/policy/PolicyHero";
import { PolicyLayout } from "@/components/policy/PolicyLayout";
import {
  PrivacyPolicyContent,
  PRIVACY_POLICY_SECTIONS,
} from "@/components/sections/policy/PrivacyPolicyContent";
import { POLICY_EFFECTIVE_DATE, POLICY_LAST_UPDATED } from "@/lib/data/policy";

export const metadata: Metadata = {
  title: "Privacy Policy | NEETI MUN 2026",
  description:
    "How NEETI MUN collects, uses, and protects the personal information provided during registration, payment, and inquiries.",
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <PolicyHero
        title="Privacy Policy"
        intro="How NEETI MUN collects, uses, and protects your personal information across registration, payment, and inquiries."
        effectiveDate={POLICY_EFFECTIVE_DATE}
        lastUpdated={POLICY_LAST_UPDATED}
      />
      <PolicyLayout sections={PRIVACY_POLICY_SECTIONS}>
        <PrivacyPolicyContent />
      </PolicyLayout>
    </>
  );
}
