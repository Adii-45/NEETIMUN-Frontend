import { cn } from "@/lib/utils";
import { Counter } from "@/components/ui/motion/Counter";

const valueSizeClasses = {
  default: "text-4xl sm:text-5xl",
  sm: "text-2xl sm:text-4xl",
} as const;

export function StatBlock({
  value,
  label,
  tone = "dark",
  size = "default",
  className,
  animate = false,
}: {
  value: string;
  label: string;
  tone?: "dark" | "light";
  size?: keyof typeof valueSizeClasses;
  className?: string;
  /** Animate the value counting up from 0 when it scrolls into view. Only applies when `value` is a plain integer. */
  animate?: boolean;
}) {
  const numericValue = Number(value);
  const canAnimate = animate && Number.isFinite(numericValue);

  return (
    <div className={cn("flex flex-col items-center gap-2 text-center", className)}>
      <span
        className={cn(
          "font-display",
          valueSizeClasses[size],
          tone === "dark" ? "text-cream-50" : "text-navy-900",
        )}
      >
        {canAnimate ? <Counter value={numericValue} /> : value}
      </span>
      <span
        className={cn(
          "text-xs font-medium uppercase tracking-wide-label",
          tone === "dark" ? "text-cream-200/70" : "text-muted",
        )}
      >
        {label}
      </span>
    </div>
  );
}
