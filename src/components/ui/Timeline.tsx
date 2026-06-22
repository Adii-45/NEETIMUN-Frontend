import { cn } from "@/lib/utils";

export type TimelineItem = {
  date: string;
  title: string;
  description: string;
};

export function Timeline({
  items,
  className,
}: {
  items: TimelineItem[];
  className?: string;
}) {
  return (
    <div className={cn("relative flex flex-col gap-12", className)}>
      <div className="absolute top-2 bottom-2 left-2 w-px bg-border sm:left-1/2 sm:-translate-x-1/2" />
      {items.map((item, index) => {
        const alignEnd = index % 2 === 1;
        return (
          <div
            key={item.title}
            className={cn(
              "relative flex flex-col gap-2 pl-10 sm:w-1/2 sm:pl-0",
              alignEnd
                ? "sm:ml-auto sm:items-start sm:pl-10 sm:text-left"
                : "sm:items-end sm:pr-10 sm:text-right",
            )}
          >
            <span
              className={cn(
                "absolute top-1.5 left-2 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-navy-900 bg-cream-50 sm:left-auto",
                alignEnd ? "sm:-left-1.5" : "sm:-right-1.5 sm:translate-x-1/2",
              )}
            />
            <span className="text-xs font-medium uppercase tracking-wide-label text-gold-600">
              {item.date}
            </span>
            <h3 className="font-display text-xl text-navy-900">{item.title}</h3>
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              {item.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
