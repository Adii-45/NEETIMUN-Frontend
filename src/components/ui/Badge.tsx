import { cn } from "@/lib/utils";

const variantClasses = {
  default: "bg-cream-200 text-navy-900 border border-border",
  outline: "bg-transparent text-navy-900 border border-navy-900/20",
  dark: "bg-navy-900/40 text-cream-50 border border-cream-50/20",
  gold: "bg-gold-300/40 text-gold-600 border border-gold-400/60",
} as const;

export function Badge({
  variant = "default",
  className,
  children,
}: {
  variant?: keyof typeof variantClasses;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium uppercase tracking-wide-label",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
