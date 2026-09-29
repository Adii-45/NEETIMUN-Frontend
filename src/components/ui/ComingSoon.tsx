"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Shared behaviour for resources (study guides, handbooks, prospectus, ...)
 * that aren't released yet: instead of navigating anywhere, clicking opens a
 * "To Be Released" dialog. Uses the native <dialog> element, which provides
 * modal semantics, focus trapping and Escape-to-close; a click on the
 * backdrop also closes it. Swap a trigger back to a real link once the
 * resource exists.
 */
function ComingSoonModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={descId}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-3xl border border-border bg-cream-50 p-0 text-navy-900 shadow-2xl backdrop:bg-navy-950/60"
    >
      <div className="flex flex-col items-center gap-4 px-8 py-10 text-center">
        <span className="text-xs font-medium uppercase tracking-wide-label text-gold-600">Resource</span>
        <h2 id={titleId} className="font-display text-2xl text-navy-900">
          To Be Released
        </h2>
        <p id={descId} className="text-sm leading-relaxed text-muted">
          This resource will be available soon. Please check back closer to the event.
        </p>
        <Button type="button" onClick={onClose} className="mt-2">
          Close
        </Button>
      </div>
    </dialog>
  );
}

type ButtonVariant = React.ComponentProps<typeof Button>["variant"];

/** A regular site Button that opens the "To Be Released" dialog instead of linking. */
export function ComingSoonButton({
  variant,
  className,
  children,
}: {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="button" variant={variant} className={className} onClick={() => setOpen(true)}>
        {children}
      </Button>
      <ComingSoonModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

/** Same behaviour for text-link style triggers; the caller supplies the classes. */
export function ComingSoonLink({ className, children }: { className?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        {children}
      </button>
      <ComingSoonModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
