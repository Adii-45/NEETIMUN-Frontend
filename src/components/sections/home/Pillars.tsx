import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { StaggerContainer, FadeUp } from "@/components/ui/motion";
import { pillars } from "@/lib/data/pillars";

export function Pillars() {
  return (
    <section className="bg-cream-200/60 py-24">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="Excellence"
          title="The Pillars of Neeti"
          align="left"
        />
        <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {pillars.map((pillar) => (
            <FadeUp key={pillar.title} viewportTrigger={false}>
              <FeatureCard
                icon={pillar.icon}
                title={pillar.title}
                description={pillar.description}
                featured={pillar.featured}
                className="h-full"
              />
            </FadeUp>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}
