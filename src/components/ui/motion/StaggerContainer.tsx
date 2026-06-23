"use client";

import { motion, useReducedMotion } from "framer-motion";
import { staggerVariants, VIEWPORT } from "./variants";

export function StaggerContainer({
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
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={staggerVariants(!!reduced)}
    >
      {children}
    </motion.div>
  );
}
