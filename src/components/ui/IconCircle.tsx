import { cn } from "@/lib/utils";

export function IconCircle({
  children,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "flex h-12 w-12 items-center justify-center rounded-full border",
        tone === "dark"
          ? "border-cream-50/20 bg-cream-50/10 text-gold-400"
          : "border-gold-400/40 bg-gold-300/20 text-gold-600",
        className,
      )}
    >
      {children}
    </span>
  );
}
