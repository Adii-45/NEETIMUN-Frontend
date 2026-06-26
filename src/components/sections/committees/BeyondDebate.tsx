import { Container } from "@/components/ui/Container";
import { FadeUp } from "@/components/ui/motion";

export function BeyondDebate() {
  return (
    <section className="bg-cream-100 py-24">
      <Container>
        <FadeUp>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
            <span className="block h-px w-16 bg-gold-500" />
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-wide-label text-gold-600">
                The NITI MUN Experience
              </span>
              <h2 className="font-display text-3xl leading-tight text-navy-900 sm:text-4xl">
                Beyond Debate
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-muted">
              NITI MUN is designed to be more than a conference. It is a
              platform where diplomacy meets strategy, policy meets innovation,
              and ideas shape outcomes. Across every committee, delegates will
              be challenged to think critically, collaborate effectively, and
              engage meaningfully with the complexities of the modern world.
            </p>
            <span className="block h-px w-16 bg-gold-500" />
          </div>
        </FadeUp>
      </Container>
    </section>
  );
}
