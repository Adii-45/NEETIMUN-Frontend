import { Container } from "@/components/ui/Container";
import { CommitteeCard } from "@/components/sections/committees/CommitteeCard";
import { CardGrid, CardReveal, Parallax, Magnetic } from "@/components/ui/motion";
import { CommitteeSpotlight } from "@/components/sections/committees/CommitteeSpotlight";
import { committees } from "@/lib/data/committees";

export function CommitteeGrid() {
  return (
    <section className="pb-24">
      <CommitteeSpotlight>
      <Container as={CardGrid} className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {committees.map((committee) => (
          <CardReveal key={committee.tag}>
            <Parallax range={4} className="h-full">
              <Magnetic range={2}>
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
              </Magnetic>
            </Parallax>
          </CardReveal>
        ))}
      </Container>
      </CommitteeSpotlight>
    </section>
  );
}
