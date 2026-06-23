import { Container } from "@/components/ui/Container";
import { CommitteeCard } from "@/components/sections/committees/CommitteeCard";
import { StaggerContainer, FadeUp } from "@/components/ui/motion";
import { committees } from "@/lib/data/committees";

export function CommitteeGrid() {
  return (
    <section className="pb-24">
      <Container as={StaggerContainer} className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {committees.map((committee) => (
          <FadeUp key={committee.tag} viewportTrigger={false}>
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
          </FadeUp>
        ))}
      </Container>
    </section>
  );
}
