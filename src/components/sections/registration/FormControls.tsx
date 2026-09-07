import { Check } from "lucide-react";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";

/** Shared invalid-border treatment for Input / Select / Textarea. */
export const invalidControlClass = "border-red-400/70 focus:border-red-400";

export function Field({
  label,
  htmlFor,
  required = false,
  error,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  error?: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={htmlFor}>
        {label}
        {required ? <span className="text-gold-600"> *</span> : null}
      </Label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-xs text-red-500">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function CheckField({
  id,
  checked,
  onChange,
  error,
  children,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="peer sr-only"
        />
        <span
          className={cn(
            "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border border-border bg-cream-50 transition-all duration-150",
            "peer-checked:border-navy-900 peer-checked:bg-navy-900",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-gold-500 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-cream-50",
            error && "border-red-400/70",
          )}
        >
          <Check aria-hidden="true" className="size-3.5 text-cream-50" />
        </span>
        <span className="text-sm leading-relaxed text-navy-900/80">
          {children}
        </span>
      </label>
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-500">
          {error}
        </p>
      ) : null}
    </div>
  );
}
