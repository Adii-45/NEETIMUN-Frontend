import { Container } from "@/components/ui/Container";
import { CommitteeCard } from "@/components/sections/committees/CommitteeCard";
import { CardGrid, CardReveal } from "@/components/ui/motion";
import { committees } from "@/lib/data/committees";

export function CommitteeGrid() {
  return (
    <section className="pb-24">
      <Container as={CardGrid} className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {committees.map((committee) => (
          <CardReveal key={committee.tag}>
            <CommitteeCard
              tag={committee.tag}
              difficulty={committee.difficulty}
              icon={committee.icon}
              tagline={committee.tagline}
              briefing={committee.briefing}
              href={committee.href}
              dark={committee.dark}
              className="h-full"
            />
          </CardReveal>
        ))}
      </Container>
    </section>
  );
}
