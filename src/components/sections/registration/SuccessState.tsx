import { Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function SuccessState({
  registrationId,
  transactionId,
}: {
  registrationId: string;
  transactionId: string;
}) {
  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-navy-900 text-cream-50 shadow-md shadow-navy-900/10">
        <Check aria-hidden="true" className="size-8" />
      </span>

      <div className="flex flex-col gap-3">
        <h2 className="font-display text-3xl text-navy-900">
          Registration Successful
        </h2>
        <p className="mx-auto max-w-md text-sm leading-relaxed text-muted">
          Payment successful — thank you for registering for NEETI MUN. Our
          team will review your application and reach out with allocation
          details and next steps.
        </p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-border bg-cream-50 px-8 py-5">
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs uppercase tracking-wide-label text-muted">
            Registration ID
          </span>
          <span className="font-display text-xl tracking-wide text-navy-900">
            {registrationId}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 border-t border-border pt-4">
          <span className="flex items-center gap-1.5 text-xs uppercase tracking-wide-label text-muted">
            <ShieldCheck aria-hidden="true" className="size-3.5 text-emerald-600" />
            Transaction ID
          </span>
          <span className="break-all font-mono text-sm text-navy-900">
            {transactionId}
          </span>
        </div>
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
