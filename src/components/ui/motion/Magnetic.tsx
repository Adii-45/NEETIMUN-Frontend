"use client";

import { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Wraps a primary CTA with a subtle cursor-proximity shift. Inert on touch
 * devices (no hover/mousemove there) and disabled under reduced motion.
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
  const [pos, setPos] = useState({ x: 0, y: 0 });

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
      setPos({ x: relX * range, y: relY * range });
    },
    [reduced, range],
  );

  const handleMouseLeave = useCallback(() => setPos({ x: 0, y: 0 }), []);

  return (
    <motion.div
      ref={ref}
      className={cn("inline-block", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
