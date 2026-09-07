import { Info } from "lucide-react";

/**
 * Callout for a business/legal detail that is not established in the
 * codebase (e.g. refund terms, jurisdiction). Renders visibly rather than as
 * a silent placeholder, so it is obvious to any reader that it is pending
 * organizer/legal confirmation — never delete without replacing the content.
 */
export function PolicyNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-gold-400/50 bg-gold-300/10 p-4">
      <Info aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-gold-600" />
      <p className="text-sm leading-relaxed text-navy-900/80">
        <span className="font-semibold text-navy-900">Pending confirmation: </span>
        {children}
      </p>
    </div>
  );
}
