"use client";

import { motion, useReducedMotion } from "framer-motion";
import { staggerVariants, STAGGER, DELAY_CHILDREN, VIEWPORT } from "./variants";

export function StaggerContainer({
  children,
  className,
  stagger = STAGGER,
  delayChildren = DELAY_CHILDREN,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={staggerVariants(!!reduced, stagger, delayChildren)}
    >
      {children}
    </motion.div>
  );
}
