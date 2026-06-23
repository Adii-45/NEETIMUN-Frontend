import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProfileCard } from "@/components/ui/ProfileCard";
import { StaggerContainer, FadeUp } from "@/components/ui/motion";
import { leadership } from "@/lib/data/leadership";

export function Leadership() {
  return (
    <section className="py-24">
      <Container className="flex flex-col gap-14">
        <SectionHeading
          eyebrow="Secretariat Leadership"
          title="Voices of Authority"
        />
        <StaggerContainer className="mx-auto grid w-full max-w-3xl grid-cols-1 gap-10 sm:grid-cols-2">
          {leadership.map((person) => (
            <FadeUp key={person.name} viewportTrigger={false}>
              <ProfileCard {...person} size="lg" />
            </FadeUp>
          ))}
        </StaggerContainer>
      </Container>
    </section>
  );
}
