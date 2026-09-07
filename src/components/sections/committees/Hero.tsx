import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";

export function Hero() {
  return (
    <section className="bg-cream-100">
      <Container className="flex flex-col items-center gap-5 py-20 text-center sm:py-28">
        <Badge variant="gold" className="animate-fade-up [animation-delay:0ms]">
          Committees 2026
        </Badge>
        <h1 className="animate-fade-up font-display max-w-3xl text-4xl leading-tight tracking-tight text-navy-900 [animation-delay:100ms] sm:text-5xl lg:text-6xl">
          Deliberating the Architecture of Global Stability
        </h1>
        <p className="animate-fade-up max-w-xl text-base leading-relaxed text-muted [animation-delay:200ms]">
          NEETI MUN 2026 presents a rigorous simulation of the world&apos;s
          most critical decision-making bodies. We invite delegates to engage
          with policy-making that defines the coming decades.
        </p>
        <span className="animate-fade-up h-px w-16 bg-gold-500 [animation-delay:300ms]" />
      </Container>
    </section>
  );
}
