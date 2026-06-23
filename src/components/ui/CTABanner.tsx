import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { RevealSection, StaggerContainer, FadeUp, Magnetic } from "@/components/ui/motion";

type CTALink = {
  label: string;
  href: string;
};

export function CTABanner({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  magneticPrimary = false,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  primaryCta: CTALink;
  secondaryCta?: CTALink;
  /** Apply the subtle cursor-proximity magnetic effect to the primary button. */
  magneticPrimary?: boolean;
}) {
  return (
    <section className="bg-navy-950">
      <Container className="flex flex-col items-center gap-6 py-20 text-center">
        <RevealSection className="flex flex-col items-center gap-6">
          {eyebrow ? (
            <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide-label text-gold-400">
              <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-gold-400" />
              {eyebrow}
            </span>
          ) : null}
          <h2 className="font-display max-w-2xl text-3xl text-cream-50 sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          {subtitle ? (
            <p className="max-w-xl text-base leading-relaxed text-cream-200/80">
              {subtitle}
            </p>
          ) : null}
        </RevealSection>
        <StaggerContainer
          className="mt-2 flex flex-col items-center gap-4 sm:flex-row"
          stagger={0.15}
          delayChildren={0.1}
        >
          <FadeUp viewportTrigger={false} scale={0.92}>
            {magneticPrimary ? (
              <Magnetic range={4}>
                <Button href={primaryCta.href} variant="light">
                  {primaryCta.label}
                </Button>
              </Magnetic>
            ) : (
              <Button href={primaryCta.href} variant="light">
                {primaryCta.label}
              </Button>
            )}
          </FadeUp>
          {secondaryCta ? (
            <FadeUp viewportTrigger={false} scale={0.92}>
              <Button href={secondaryCta.href} variant="outline-light">
                {secondaryCta.label}
              </Button>
            </FadeUp>
          ) : null}
        </StaggerContainer>
      </Container>
    </section>
  );
}
