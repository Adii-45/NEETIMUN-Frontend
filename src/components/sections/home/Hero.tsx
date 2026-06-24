import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Parallax, Magnetic } from "@/components/ui/motion";

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-cream-100">
      {/* Background layer — slowest drift, furthest depth */}
      <Parallax range={8} className="pointer-events-none absolute inset-0">
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 h-[58rem] w-[58rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-300/[0.12] blur-3xl"
        />
      </Parallax>
      {/* Mid layer */}
      <Parallax range={20} className="pointer-events-none absolute inset-0" fadeIn={{ delay: 0.6, duration: 1.2 }}>
        <div
          aria-hidden
          className="animate-float pointer-events-none absolute top-1/2 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-400/30"
        />
      </Parallax>
      {/* Foreground layer — fastest drift */}
      <Parallax range={30} className="pointer-events-none absolute inset-0" fadeIn={{ delay: 0.8, duration: 1.2 }}>
        <div
          aria-hidden
          className="animate-float-slow pointer-events-none absolute top-1/2 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-navy-900/10"
        />
      </Parallax>

      <Container className="relative flex flex-col items-center gap-8 py-28 text-center sm:py-36">
        <Badge
          variant="gold"
          className="animate-fade-up [animation-delay:0ms]"
        >
          EST. 2026 &middot; Global Leadership Summit
        </Badge>
        <h1 className="animate-fade-up font-display max-w-3xl text-5xl leading-[1.05] text-navy-900 [animation-delay:100ms] sm:text-6xl lg:text-7xl">
          NEETI MUN
          <br />
          <span className="italic text-gold-600">2026</span>
        </h1>
        <p className="animate-fade-up max-w-2xl text-lg text-navy-900/80 [animation-delay:200ms]">
          Where Diplomacy Meets Leadership.
        </p>
        <p className="animate-fade-up max-w-xl text-base leading-relaxed text-muted [animation-delay:300ms]">
          Join future policymakers and global thinkers in a simulation that
          mirrors the intensity of real-world international relations. Lead,
          debate, and resolve.
        </p>
        <div className="animate-fade-up mt-2 flex flex-col items-center gap-4 [animation-delay:400ms] sm:flex-row">
          <Magnetic range={4}>
            <Button href="/registration">Register Now</Button>
          </Magnetic>
          <Button href="/committees" variant="outline">
            Explore Committees
          </Button>
        </div>
      </Container>
    </section>
  );
}
