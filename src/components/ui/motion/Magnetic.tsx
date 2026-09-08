"use client";

import { useCallback, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Wraps a primary CTA with a subtle cursor-proximity shift. Inert on touch
 * devices (no hover/mousemove there) and disabled under reduced motion.
 *
 * Drives the shift through MotionValues (as CommitteeSpotlight does for its
 * cursor spotlight) instead of React state: mousemove can fire dozens of
 * times a second, and this is often mounted once per card in a grid, so
 * routing it through setState + re-render per event per instance would be
 * many avoidable component renders a second for a purely cosmetic effect.
 * MotionValues update the transform directly on the compositor thread.
 */
export function Magnetic({
  children,
  range = 4,
  className,
}: {
  children: React.ReactNode;
  /** Maximum shift in pixels (2-5px recommended). */
  range?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 150, damping: 15, mass: 0.5 });
  const y = useSpring(rawY, { stiffness: 150, damping: 15, mass: 0.5 });

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (reduced) return;
      if (
        typeof window !== "undefined" &&
        !window.matchMedia("(hover: hover) and (pointer: fine)").matches
      ) {
        return;
      }
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const relX = (event.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const relY = (event.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      rawX.set(relX * range);
      rawY.set(relY * range);
    },
    [reduced, range, rawX, rawY],
  );

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
    >
      {children}
    </motion.div>
  );
}
