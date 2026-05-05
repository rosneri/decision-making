"use client";

export interface CycleVariant {
  className: string;
  label?: string;
}

export function CycleButton<T extends string>({
  value,
  states,
  variants,
  onCycle,
  size = 9,
  ariaLabel,
  testId,
  title,
}: {
  value: T;
  states: readonly T[];
  variants: Record<T, CycleVariant>;
  onCycle: (next: T) => void;
  size?: 7 | 8 | 9 | 10;
  ariaLabel?: string;
  testId?: string;
  title?: string;
}) {
  const next = () => {
    const i = states.indexOf(value);
    onCycle(states[(i + 1) % states.length]!);
  };
  const v = variants[value];
  const sizeCls = size === 7 ? "w-7 h-7" : size === 8 ? "w-8 h-8" : size === 10 ? "w-10 h-10" : "w-9 h-9";
  return (
    <button
      type="button"
      onClick={next}
      {...(ariaLabel ? { "aria-label": ariaLabel } : {})}
      {...(testId ? { "data-testid": testId } : {})}
      {...(title ? { title } : {})}
      className={`${sizeCls} border grid place-items-center ${v.className}`}
    >
      {v.label ?? value}
    </button>
  );
}
