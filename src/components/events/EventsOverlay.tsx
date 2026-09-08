"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { EASE } from "@/components/ui/motion/variants";
import { EventsBrowser } from "./EventsBrowser";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function EventsOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Escape to close, focus trap while open, and restore focus/scroll on
  // close — the same accessible-modal contract used throughout this app's
  // admin equivalent (NEETIMUN-Admin's detail drawers).
  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = originalOverflow;
      previouslyFocused.current?.focus();
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-navy-900/60 backdrop-blur-sm p-4 py-10 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.2, ease: EASE }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="events-overlay-heading"
            initial={{ opacity: 0, y: reduced ? 0 : 16, scale: reduced ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduced ? 0 : 16, scale: reduced ? 1 : 0.98 }}
            transition={{ duration: reduced ? 0 : 0.25, ease: EASE }}
            className="relative w-full max-w-6xl rounded-3xl border border-border bg-cream-100 p-6 shadow-2xl sm:p-10"
          >
            <div className="mb-8 flex items-start justify-between gap-4">
              <div>
                <h2 id="events-overlay-heading" className="font-display text-2xl text-navy-900 sm:text-3xl">
                  Events
                </h2>
                <p className="mt-2 max-w-xl text-sm text-muted">
                  Current, upcoming, and past NEETI MUN events, with live registration availability.
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close events"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-navy-900/15 text-navy-900 transition-colors hover:bg-cream-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
              >
                <X size={18} />
              </button>
            </div>

            <EventsBrowser className="max-h-[65vh] overflow-y-auto pr-1" />

            <div className="mt-8 flex justify-end border-t border-border pt-6">
              <Link
                href="/events"
                onClick={onClose}
                className="text-sm font-medium text-navy-900 underline underline-offset-4"
              >
                Open the full Events page &rarr;
              </Link>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
