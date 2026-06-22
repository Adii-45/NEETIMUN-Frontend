import { Container } from "@/components/ui/Container";
import { CommitteeCard } from "@/components/sections/committees/CommitteeCard";
import { committees } from "@/lib/data/committees";

export function CommitteeGrid() {
  return (
    <section className="pb-24">
      <Container className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {committees.map((committee) => (
          <CommitteeCard
            key={committee.tag}
            tag={committee.tag}
            difficulty={committee.difficulty}
            icon={committee.icon}
            tagline={committee.tagline}
            briefing={committee.briefing}
            href={committee.href}
            dark={committee.dark}
          />
        ))}
      </Container>
    </section>
  );
}
