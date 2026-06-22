import { cn } from "@/lib/utils";

export function Stepper({
  steps,
  activeStep,
  className,
}: {
  steps: string[];
  activeStep: number;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full items-center", className)}>
      {steps.map((step, index) => {
        const isActive = index === activeStep;
        const isComplete = index < activeStep;
        return (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full font-display text-sm transition-colors duration-200",
                  isActive || isComplete
                    ? "bg-navy-900 text-cream-50"
                    : "border border-border bg-cream-50 text-muted",
                )}
              >
                {index + 1}
              </span>
              <span
                className={cn(
                  "text-xs",
                  isActive ? "font-medium text-navy-900" : "text-muted",
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 ? (
              <div
                className={cn(
                  "mx-3 h-px flex-1",
                  isComplete ? "bg-navy-900" : "bg-border",
                )}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
