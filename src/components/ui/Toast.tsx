"use client";

import { useEffect } from "react";
import { CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastState = { message: string } | null;

/**
 * Minimal, dependency-free success toast. Scoped to a single caller-held
 * slot (no global provider) since only the Contact form needs one today.
 */
export function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastState;
  onDismiss: () => void;
}) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, 6000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed inset-x-4 bottom-6 z-50 mx-auto flex max-w-md items-start gap-3 rounded-2xl border border-gold-400/50 bg-cream-50 p-4 shadow-2xl shadow-navy-900/10",
        "sm:inset-x-auto sm:right-6 animate-dropdown-in",
      )}
    >
      <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-gold-600" aria-hidden="true" />
      <p className="flex-1 text-sm leading-relaxed text-navy-900">{toast.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="rounded-full p-1 text-navy-900/50 transition-colors hover:bg-cream-200 hover:text-navy-900"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
