import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function SuccessState({ referenceId }: { referenceId: string }) {
  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-navy-900 text-cream-50 shadow-md shadow-navy-900/10">
        <Check aria-hidden="true" className="size-8" />
      </span>

      <div className="flex flex-col gap-3">
        <h2 className="font-display text-3xl text-navy-900">
          Application Submitted
        </h2>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-muted">
          Thank you for registering for NEETI MUN. Our team will review your
          application and reach out with allocation details and next steps.
        </p>
      </div>

      <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-cream-50 px-8 py-5">
        <span className="text-xs uppercase tracking-wide-label text-muted">
          Application Reference ID
        </span>
        <span className="font-display text-xl tracking-wide text-navy-900">
          {referenceId}
        </span>
      </div>

      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <Button href="/" variant="outline">
          Return Home
        </Button>
        <Button href="/committees">Explore Committees</Button>
      </div>
    </div>
  );
}
