import { Container } from "@/components/ui/Container";

export function PolicyHero({
  title,
  intro,
  effectiveDate,
  lastUpdated,
}: {
  title: string;
  intro: string;
  effectiveDate: string;
  lastUpdated: string;
}) {
  return (
    <section className="bg-navy-950">
      <Container className="flex flex-col items-center gap-5 py-20 text-center sm:py-28">
        <span className="animate-fade-up flex items-center gap-3 text-xs font-medium uppercase tracking-wide-label text-gold-400 [animation-delay:0ms]">
          <span className="h-px w-8 bg-gold-500" />
          NEETI MUN
          <span className="h-px w-8 bg-gold-500" />
        </span>
        <h1 className="animate-fade-up font-display max-w-3xl text-4xl leading-tight tracking-tight text-cream-50 [animation-delay:100ms] sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="animate-fade-up max-w-xl text-base leading-relaxed text-cream-200/80 [animation-delay:200ms]">
          {intro}
        </p>
        <div className="animate-fade-up flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-2 text-xs text-cream-200/60 [animation-delay:300ms]">
          <span>
            Effective Date: <span className="text-cream-200/90">{effectiveDate}</span>
          </span>
          <span className="hidden h-3 w-px bg-cream-50/20 sm:inline-block" />
          <span>
            Last Updated: <span className="text-cream-200/90">{lastUpdated}</span>
          </span>
        </div>
      </Container>
    </section>
  );
}
