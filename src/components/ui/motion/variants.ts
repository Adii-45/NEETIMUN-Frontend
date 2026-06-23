import type { Transition, Variants } from "framer-motion";

export const EASE: Transition["ease"] = [0.16, 1, 0.3, 1];
export const DURATION = 0.6;
export const STAGGER = 0.1;
export const DELAY_CHILDREN = 0.05;
export const VIEWPORT = { once: true, margin: "-80px" } as const;

export function fadeUpVariants(reduced: boolean, delay = 0): Variants {
  if (reduced) {
    return {
      hidden: { opacity: 1, y: 0 },
      visible: { opacity: 1, y: 0 },
    };
  }
  return {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: DURATION, ease: EASE, delay },
    },
  };
}

export function fadeInVariants(reduced: boolean, delay = 0): Variants {
  if (reduced) {
    return {
      hidden: { opacity: 1 },
      visible: { opacity: 1 },
    };
  }
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: DURATION, ease: EASE, delay },
    },
  };
}

export function staggerVariants(reduced: boolean): Variants {
  if (reduced) {
    return { hidden: {}, visible: {} };
  }
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: STAGGER, delayChildren: DELAY_CHILDREN },
    },
  };
}
