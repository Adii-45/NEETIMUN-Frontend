import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Parallax, Magnetic } from "@/components/ui/motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream-100">
      <Parallax range={10} className="pointer-events-none absolute inset-0 select-none">
        <span
          aria-hidden
          className="font-display pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 text-[16rem] leading-none text-navy-900/5 select-none sm:text-[22rem]"
        >
          2026
        </span>
      </Parallax>

      <Container className="relative flex flex-col gap-6 py-28 sm:py-36">
        <span className="animate-fade-up flex items-center gap-3 text-xs font-medium uppercase tracking-wide-label text-gold-600 [animation-delay:0ms]">
          <span className="h-px w-8 bg-gold-500" />
          Legacy of Excellence
        </span>
        <h1 className="animate-fade-up font-display max-w-2xl text-5xl leading-[1.05] text-navy-900 [animation-delay:100ms] sm:text-6xl">
          Defining the Future of
          <br />
          <span className="italic text-gold-600">Global Discourse.</span>
        </h1>
        <p className="animate-fade-up max-w-xl text-base leading-relaxed text-muted [animation-delay:200ms]">
          Join the most prestigious gathering of young leaders, diplomats,
          and visionaries. Engaging in rigorous debate to solve the world&apos;s
          most pressing geopolitical challenges.
        </p>
        <div className="animate-fade-up mt-2 flex flex-col gap-4 [animation-delay:300ms] sm:flex-row">
          <Magnetic range={4}>
            <Button href="/registration">Register Now</Button>
          </Magnetic>
          <Button href="/about" variant="outline">
            Explore Archive
          </Button>
        </div>
      </Container>
    </section>
  );
}
