"use client";

import { useRef, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useReducedMotion,
} from "framer-motion";

/**
 * Section-wide cursor spotlight for the committee grid.
 * Renders a spring-lagged radial gold gradient that follows the cursor,
 * making cards near the cursor glow subtly warmer. Desktop/fine-pointer only.
 */
export function CommitteeSpotlight({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const mouseX = useMotionValue(-700);
  const mouseY = useMotionValue(-700);

  // Spring lag creates the luxury "light follows with weight" feel
  const x = useSpring(mouseX, { stiffness: 90, damping: 18, restDelta: 0.5 });
  const y = useSpring(mouseY, { stiffness: 90, damping: 18, restDelta: 0.5 });

  const rawOpacity = useMotionValue(0);
  const opacity = useSpring(rawOpacity, { stiffness: 60, damping: 16 });

  // Live CSS gradient string built from MotionValues — zero re-renders
  const background = useMotionTemplate`radial-gradient(700px circle at ${x}px ${y}px, rgba(201, 162, 39, 0.10), transparent 60%)`;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reduced) return;
      if (
        typeof window !== "undefined" &&
        !window.matchMedia("(hover: hover) and (pointer: fine)").matches
      ) {
        return;
      }
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
      rawOpacity.set(1);
    },
    [reduced, mouseX, mouseY, rawOpacity],
  );

  const handleMouseLeave = useCallback(() => {
    rawOpacity.set(0);
  }, [rawOpacity]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Spotlight overlay — desktop fine-pointer only, z above cards but below interactive elements */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 hidden lg:block"
        style={{ background, opacity }}
      />
      {children}
    </div>
  );
}
