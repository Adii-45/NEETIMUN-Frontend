import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProfileCard } from "@/components/ui/ProfileCard";
import { CardGrid, CardReveal } from "@/components/ui/motion";
import { leadership } from "@/lib/data/leadership";

export function Leadership() {
  return (
    <section className="py-24">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="Secretariat Leadership"
          title="Voices of Authority"
        />
        <CardGrid className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-10 sm:grid-cols-2">
          {leadership.map((person) => (
            <CardReveal key={person.name}>
              <ProfileCard {...person} size="lg" />
            </CardReveal>
          ))}
        </CardGrid>
      </Container>
    </section>
  );
}
