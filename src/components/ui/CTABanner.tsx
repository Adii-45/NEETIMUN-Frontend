import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

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
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  primaryCta: CTALink;
  secondaryCta?: CTALink;
}) {
  return (
    <section className="bg-navy-950">
      <Container className="flex flex-col items-center gap-6 py-20 text-center">
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
        <div className="mt-2 flex flex-col items-center gap-4 sm:flex-row">
          <Button href={primaryCta.href} variant="light">
            {primaryCta.label}
          </Button>
          {secondaryCta ? (
            <Button href={secondaryCta.href} variant="outline-light">
              {secondaryCta.label}
            </Button>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
