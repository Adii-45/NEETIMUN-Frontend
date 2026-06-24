"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DURATION, EASE, VIEWPORT } from "./variants";

/** Entrance wrapper that scales content from 0.97 → 1 as it enters viewport. Use for CTA section containers. */
export function ScaleIn({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduced ? {} : { scale: 0.97, opacity: 0.85 }}
      whileInView={reduced ? {} : { scale: 1, opacity: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: DURATION + 0.2, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
