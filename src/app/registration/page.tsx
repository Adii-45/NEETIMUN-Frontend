import type { Metadata } from "next";
import { Hero } from "@/components/sections/registration/Hero";
import { RegistrationForm } from "@/components/sections/registration/RegistrationForm";
import { TrustBadges } from "@/components/sections/registration/TrustBadges";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Registration | NEETI MUN 2026",
  description:
    "Register as a delegate for NEETI MUN 2026 — choose your committee preference and secure your seat.",
};

export default function RegistrationPage() {
  return (
    <>
      <Hero />
      <section className="pb-20">
        <Container>
          <RegistrationForm />
        </Container>
      </section>
      <TrustBadges />
    </>
  );
}
