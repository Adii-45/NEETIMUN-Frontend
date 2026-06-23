import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "group rounded-2xl border border-border bg-cream-50 p-6 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:border-gold-400/40 hover:shadow-2xl hover:shadow-navy-900/15",
        className,
      )}
    >
      {children}
    </div>
  );
}
