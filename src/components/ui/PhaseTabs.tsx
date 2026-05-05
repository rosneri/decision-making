"use client";

import type { ReactNode } from "react";

export interface PhaseItem<K extends string> {
  key: K;
  label: ReactNode;
  sub?: ReactNode;
  testId?: string;
}

export function PhaseTabs<K extends string>({
  items,
  active,
  onSelect,
  variant = "split",
  className = "",
}: {
  items: PhaseItem<K>[];
  active: K;
  onSelect: (k: K) => void;
  variant?: "split" | "pill";
  className?: string;
}) {
  if (variant === "pill") {
    return (
      <div className={`flex gap-2 flex-wrap ${className}`.trim()}>
        {items.map((it) => {
          const on = it.key === active;
          return (
            <button
              key={it.key}
              onClick={() => onSelect(it.key)}
              aria-pressed={on}
              {...(it.testId ? { "data-testid": it.testId } : {})}
              className={`font-code text-[10px] tracking-[0.22em] uppercase px-3 py-1 border ${
                on ? "bg-vermilion text-paper border-vermilion" : "border-rule text-ink-muted hover:border-ink"
              }`}
            >
              {it.label}
              {it.sub ? <> · {it.sub}</> : null}
            </button>
          );
        })}
      </div>
    );
  }
  // split: full-width grid with vertical rules between items
  const cols = items.length;
  return (
    <div
      className={`grid divide-x divide-rule ${className}`.trim()}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {items.map((it) => {
        const on = it.key === active;
        return (
          <button
            key={it.key}
            onClick={() => onSelect(it.key)}
            {...(it.testId ? { "data-testid": it.testId } : {})}
            className={`p-4 text-left ${on ? "bg-vermilion/5" : ""}`}
          >
            <span className={`font-code text-[10px] tracking-[0.22em] uppercase font-medium ${on ? "text-vermilion" : "text-ink-muted"}`}>
              {it.label}
            </span>
            {it.sub ? (
              <div className={`font-serif text-[15px] font-medium mt-1 ${on ? "text-vermilion" : "text-ink"}`}>
                {it.sub}
              </div>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
