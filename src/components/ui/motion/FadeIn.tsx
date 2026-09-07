"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeInVariants, VIEWPORT } from "./variants";

export function FadeIn({
  children,
  className,
  delay = 0,
  viewportTrigger = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** Set false when nesting inside StaggerContainer / RevealSection so timing is inherited from the parent. */
  viewportTrigger?: boolean;
}) {
  const reduced = useReducedMotion();
  const variants = fadeInVariants(!!reduced, delay);

  if (!viewportTrigger) {
    return (
      <motion.div className={className} variants={variants}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
