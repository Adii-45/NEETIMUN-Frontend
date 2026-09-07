"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { StaggerContainer } from "@/components/ui/motion/StaggerContainer";
import { FadeUp } from "@/components/ui/motion/FadeUp";
import { EASE } from "@/components/ui/motion/variants";

export type AccordionItem = {
  question: string;
  answer: string;
};

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const transition = { duration: reduced ? 0 : 0.3, ease: EASE };

  return (
    <StaggerContainer className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-cream-50">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <FadeUp key={item.question} viewportTrigger={false}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="text-sm font-medium text-navy-900">
                {item.question}
              </span>
              <motion.span
                className="shrink-0 text-gold-600"
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={transition}
              >
                <Plus size={18} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={transition}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-5 text-sm leading-relaxed text-muted">
                    {item.answer}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </FadeUp>
        );
      })}
    </StaggerContainer>
  );
}
