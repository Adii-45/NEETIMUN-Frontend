"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { FadeUp, Parallax } from "@/components/ui/motion";
import { SectionBackdrop } from "@/components/ui/SectionBackdrop";

const EASE = [0.16, 1, 0.3, 1] as const;
const VIEWPORT = { once: true } as const;

// Animated gold rule that expands from the center out
function GoldRule() {
  return (
    <motion.span
      aria-hidden
      className="block h-px origin-center bg-gold-500"
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.9, ease: EASE }}
      style={{ width: 64 }}
    />
  );
}

export function BeyondDebate() {
  return (
    <section className="relative overflow-hidden bg-cream-100 py-28">
      <SectionBackdrop variant="gold-bl" range={8} />

      <Container>
        <Parallax range={5}>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-10 text-center">
            <GoldRule />

            <FadeUp>
              <div className="flex flex-col gap-4">
                <span className="text-[11px] font-semibold uppercase tracking-wide-label text-gold-600">
                  The NITI MUN Experience
                </span>
                <h2 className="font-display text-3xl leading-tight tracking-tight text-navy-900 sm:text-4xl">
                  Beyond Debate
                </h2>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <p className="text-lg leading-8 text-muted">
                NITI MUN is designed to be more than a conference. It is a
                platform where diplomacy meets strategy, policy meets
                innovation, and ideas shape outcomes. Across every committee,
                delegates will be challenged to think critically, collaborate
                effectively, and engage meaningfully with the complexities of
                the modern world.
              </p>
            </FadeUp>

            <GoldRule />
          </div>
        </Parallax>
      </Container>
    </section>
  );
}
