"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Parallax, Magnetic } from "@/components/ui/motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Scales and dims the hero content as it scrolls off the top of the viewport,
 * creating a "page recedes behind you" depth transition.
 */
function HeroScrollExit({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Only starts receding in the last 25% of the section scrolling past
  const scale = useTransform(
    scrollYProgress,
    [0, 0.75, 1],
    reduced ? [1, 1, 1] : [1, 1, 0.97],
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.75, 1],
    reduced ? [1, 1, 1] : [1, 1, 0.88],
  );

  return (
    <motion.div ref={ref} style={{ scale, opacity }}>
      {children}
    </motion.div>
  );
}

export function Hero() {
  const reduced = useReducedMotion();

  // Derive a stable zero-duration for reduced-motion fast transitions
  const d = (ms: number) => (reduced ? 0 : ms);
  const delay = (s: number) => (reduced ? 0 : s);

  return (
    <section id="hero" className="relative overflow-hidden bg-cream-100">
      {/* Background layer — slowest drift */}
      <Parallax range={8} className="pointer-events-none absolute inset-0">
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 h-[58rem] w-[58rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-300/[0.12] blur-3xl"
        />
      </Parallax>
      {/* Mid layer — appears after text sequence completes */}
      <Parallax
        range={20}
        className="pointer-events-none absolute inset-0"
        fadeIn={{ delay: 1.4, duration: 1.4 }}
      >
        <div
          aria-hidden
          className="animate-float pointer-events-none absolute top-1/2 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold-400/30"
        />
      </Parallax>
      {/* Foreground layer — fastest drift */}
      <Parallax
        range={30}
        className="pointer-events-none absolute inset-0"
        fadeIn={{ delay: 1.6, duration: 1.4 }}
      >
        <div
          aria-hidden
          className="animate-float-slow pointer-events-none absolute top-1/2 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-navy-900/10"
        />
      </Parallax>

      <HeroScrollExit>
        <Container className="relative">
          <div className="flex flex-col items-center gap-8 py-28 text-center sm:py-36">

            {/* 1. Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: d(0.65), ease: EASE, delay: delay(0.1) }}
            >
              <Badge variant="gold">
                EST. 2026 &middot; Global Leadership Summit
              </Badge>
            </motion.div>

            {/* 2. Title — line-by-line mask reveal */}
            {/* Each line slides up from behind an overflow-hidden clip boundary */}
            <h1 className="font-display max-w-3xl text-5xl leading-[1.05] text-navy-900 sm:text-6xl lg:text-7xl">
              <span className="block overflow-hidden pb-1">
                <motion.span
                  className="block"
                  initial={{ y: reduced ? "0%" : "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: d(0.9), ease: EASE, delay: delay(0.25) }}
                >
                  NEETI MUN
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-1">
                <motion.span
                  className="block italic text-gold-600"
                  initial={{ y: reduced ? "0%" : "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: d(0.9), ease: EASE, delay: delay(0.42) }}
                >
                  2026
                </motion.span>
              </span>
            </h1>

            {/* 3. Subtitle */}
            <motion.p
              className="max-w-2xl text-lg text-navy-900/80"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: d(0.65), ease: EASE, delay: delay(0.82) }}
            >
              Where Diplomacy Meets Leadership.
            </motion.p>

            {/* 4. Description */}
            <motion.p
              className="max-w-xl text-base leading-relaxed text-muted"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: d(0.65), ease: EASE, delay: delay(0.98) }}
            >
              Join future policymakers and global thinkers in a simulation that
              mirrors the intensity of real-world international relations. Lead,
              debate, and resolve.
            </motion.p>

            {/* 5. CTA buttons */}
            <motion.div
              className="mt-2 flex flex-col items-center gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: d(0.65), ease: EASE, delay: delay(1.12) }}
            >
              <Magnetic range={4}>
                <Button href="/registration">Register Now</Button>
              </Magnetic>
              <Button href="/committees" variant="outline">
                Explore Committees
              </Button>
            </motion.div>

          </div>
        </Container>
      </HeroScrollExit>
    </section>
  );
}
