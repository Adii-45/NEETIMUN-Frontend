"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type PortfolioSelectProps = {
  /** The portfolio options for the currently selected committee. */
  options: string[];
  /** Currently selected portfolio value (empty string when none). */
  value: string;
  onChange: (value: string) => void;
  /** Disabled until a committee is chosen. */
  disabled?: boolean;
  /** Shown on the trigger before a committee is selected. */
  disabledPlaceholder?: string;
  /** Shown on the trigger once a committee is selected but no portfolio picked. */
  placeholder?: string;
  /** Marks the field as invalid for styling + aria. */
  invalid?: boolean;
  id?: string;
  "aria-describedby"?: string;
};

export function PortfolioSelect({
  options,
  value,
  onChange,
  disabled = false,
  disabledPlaceholder = "Select a committee first",
  placeholder = "Select your preferred portfolio",
  invalid = false,
  id,
  "aria-describedby": describedBy,
}: PortfolioSelectProps) {
  const reactId = useId();
  const baseId = id ?? reactId;
  const listboxId = `${baseId}-listbox`;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((option) => option.toLowerCase().includes(q));
  }, [options, query]);

  // Keep the highlighted option in sync with the current selection / filter.
  useEffect(() => {
    if (!open) return;
    const selectedIndex = filtered.findIndex((option) => option === value);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [open, filtered, value]);

  // Focus the search field when the menu opens.
  useEffect(() => {
    if (open) {
      const frame = requestAnimationFrame(() => searchRef.current?.focus());
      return () => cancelAnimationFrame(frame);
    }
    setQuery("");
  }, [open]);

  // Scroll the active option into view during keyboard navigation.
  useEffect(() => {
    if (!open) return;
    optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  // Close when clicking outside.
  useEffect(() => {
    if (!open) return;
    function handlePointer(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointer);
    return () => document.removeEventListener("mousedown", handlePointer);
  }, [open]);

  function commit(option: string) {
    onChange(option);
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }

  function handleTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (
      event.key === "ArrowDown" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      setOpen(true);
    }
  }

  function handleSearchKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((index) =>
          filtered.length ? (index + 1) % filtered.length : 0,
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((index) =>
          filtered.length ? (index - 1 + filtered.length) % filtered.length : 0,
        );
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(Math.max(filtered.length - 1, 0));
        break;
      case "Enter":
        event.preventDefault();
        if (filtered[activeIndex]) commit(filtered[activeIndex]);
        break;
      case "Escape":
        event.preventDefault();
        setOpen(false);
        requestAnimationFrame(() => triggerRef.current?.focus());
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        break;
    }
  }

  const triggerLabel = value || (disabled ? disabledPlaceholder : placeholder);
  const activeOptionId =
    open && filtered[activeIndex] ? `${baseId}-option-${activeIndex}` : undefined;

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        id={baseId}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={activeOptionId}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        disabled={disabled}
        onClick={() => !disabled && setOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          "flex w-full items-center justify-between gap-3 rounded-xl border bg-cream-50 px-4 py-3 text-left text-sm transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50",
          disabled
            ? "cursor-not-allowed border-border opacity-60"
            : "cursor-pointer border-border hover:border-gold-400/60",
          open && "border-navy-900 shadow-md shadow-gold-500/10",
          invalid && !disabled && "border-red-400/70",
        )}
      >
        <span
          className={cn(
            "truncate",
            value ? "text-navy-900" : "text-navy-900/40",
          )}
        >
          {triggerLabel}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-4 shrink-0 text-muted transition-transform duration-200",
            open && "rotate-180 text-gold-600",
          )}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 origin-top animate-dropdown-in overflow-hidden rounded-xl border border-border bg-cream-50 shadow-xl shadow-navy-900/10"
        >
          <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
            <Search aria-hidden="true" className="size-4 shrink-0 text-muted" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={handleSearchKeyDown}
              placeholder="Search portfolios"
              role="combobox"
              aria-expanded="true"
              aria-controls={listboxId}
              aria-activedescendant={activeOptionId}
              aria-autocomplete="list"
              aria-label="Search portfolios"
              className="w-full bg-transparent text-sm text-navy-900 placeholder:text-navy-900/40 focus:outline-none"
            />
          </div>

          <ul
            id={listboxId}
            role="listbox"
            aria-label="Portfolio options"
            className="max-h-64 overflow-y-auto py-1.5"
          >
            {filtered.length === 0 ? (
              <li
                role="presentation"
                className="px-4 py-3 text-sm text-muted"
              >
                No matching portfolio found
              </li>
            ) : (
              filtered.map((option, index) => {
                const isSelected = option === value;
                const isActive = index === activeIndex;
                return (
                  <li
                    key={option}
                    ref={(node) => {
                      optionRefs.current[index] = node;
                    }}
                    id={`${baseId}-option-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => commit(option)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={cn(
                      "flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-sm transition-colors duration-150",
                      isActive ? "bg-cream-200/80 text-navy-900" : "text-navy-900/80",
                    )}
                  >
                    <span className="truncate">{option}</span>
                    <Check
                      aria-hidden="true"
                      className={cn(
                        "size-4 shrink-0 text-gold-600 transition-all duration-150",
                        isSelected
                          ? "scale-100 opacity-100"
                          : "scale-75 opacity-0",
                      )}
                    />
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
