import { cn } from "@/lib/utils";

export function StatBlock({
  value,
  label,
  tone = "dark",
  className,
}: {
  value: string;
  label: string;
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-2 text-center", className)}>
      <span
        className={cn(
          "font-display text-4xl sm:text-5xl",
          tone === "dark" ? "text-cream-50" : "text-navy-900",
        )}
      >
        {value}
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
