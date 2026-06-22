"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type AccordionItem = {
  question: string;
  answer: string;
};

export function Accordion({ items }: { items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col divide-y divide-border overflow-hidden rounded-2xl border border-border bg-cream-50">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
            >
              <span className="text-sm font-medium text-navy-900">
                {item.question}
              </span>
              <Plus
                size={18}
                className={cn(
                  "shrink-0 text-gold-600 transition-transform duration-200",
                  isOpen && "rotate-45",
                )}
              />
            </button>
            {isOpen ? (
              <p className="px-6 pb-5 text-sm leading-relaxed text-muted">
                {item.answer}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
