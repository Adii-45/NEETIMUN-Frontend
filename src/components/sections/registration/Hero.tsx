import { Clock } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";

export function Hero() {
  return (
    <section className="bg-cream-100">
      <Container className="flex flex-col items-center gap-6 py-24 text-center sm:py-28">
        <h1 className="animate-fade-up font-display text-4xl text-navy-900 [animation-delay:0ms] sm:text-5xl">
          Delegate Registration
        </h1>
        <p className="animate-fade-up max-w-xl text-base leading-relaxed text-muted [animation-delay:100ms]">
          Join the ranks of global leaders at NEETI MUN 2026. Excellence in
          diplomacy starts here.
        </p>
        <Badge variant="default" className="animate-fade-up [animation-delay:200ms]">
          <Clock size={14} />
          Average completion time: Under 2 minutes
        </Badge>
      </Container>
    </section>
  );
}
