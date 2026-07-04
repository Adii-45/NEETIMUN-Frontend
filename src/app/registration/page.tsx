import type { Metadata } from "next";
import { Hero } from "@/components/sections/registration/Hero";
import { RegistrationForm } from "@/components/sections/registration/RegistrationForm";
import { TrustBadges } from "@/components/sections/registration/TrustBadges";
import { Container } from "@/components/ui/Container";
import { committees, getCommitteeBySlug } from "@/lib/data/committees";

export const metadata: Metadata = {
  title: "Registration | NEETI MUN 2026",
  description:
    "Register as a delegate for NEETI MUN 2026 — choose your committee preference and secure your seat.",
};

export default async function RegistrationPage({
  searchParams,
}: {
  searchParams: Promise<{ committee?: string | string[] }>;
}) {
  const { committee } = await searchParams;
  const requestedSlug = Array.isArray(committee) ? committee[0] : committee;

  // Validate against the single source of truth; fall back to the first
  // committee for missing or unknown slugs (e.g. ?committee=random).
  const initialCommitteeSlug =
    getCommitteeBySlug(requestedSlug)?.slug ?? committees[0]?.slug ?? "";

  return (
    <>
      <Hero />
      <section className="pb-20">
        <Container>
          <RegistrationForm initialCommitteeSlug={initialCommitteeSlug} />
        </Container>
      </section>
      <TrustBadges />
    </>
  );
}
