import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { CardGrid, CardReveal } from "@/components/ui/motion";
import { foundation } from "@/lib/data/foundation";

export function Foundation() {
  return (
    <section className="bg-navy-950 py-24">
      <Container className="flex flex-col items-center gap-14">
        <SectionHeading
          eyebrow="Our Foundation"
          title="Commitment to Global Citizenship"
          tone="dark"
        />
        <CardGrid className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {foundation.map((item) => (
            <CardReveal key={item.title}>
              <FeatureCard
                icon={item.icon}
                title={item.title}
                description={item.description}
                tone="dark"
                className="h-full"
              />
            </CardReveal>
          ))}
        </CardGrid>
      </Container>
    </section>
  );
}
