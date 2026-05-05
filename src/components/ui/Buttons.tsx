"use client";

import type { ReactNode } from "react";

export function RemoveButton({
  onClick,
  ariaLabel,
  showOnHover = false,
  className = "",
  title,
}: {
  onClick: () => void;
  ariaLabel?: string;
  showOnHover?: boolean;
  className?: string;
  title?: string;
}) {
  const visibility = showOnHover ? "opacity-0 group-hover:opacity-100 transition-opacity duration-200" : "";
  return (
    <button
      type="button"
      onClick={onClick}
      {...(ariaLabel ? { "aria-label": ariaLabel } : {})}
      {...(title ? { title } : {})}
      className={`text-ink-muted hover:text-vermilion px-1.5 bg-transparent border-none cursor-pointer font-serif ${visibility} ${className}`.trim()}
    >
      ×
    </button>
  );
}

export function AddButton({
  onClick,
  children,
  className = "",
  testId,
}: {
  onClick: () => void;
  children: ReactNode;
  className?: string;
  testId?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      {...(testId ? { "data-testid": testId } : {})}
      className={`font-serif italic text-[13px] text-ink-muted hover:text-vermilion cursor-pointer bg-transparent border-none transition-colors duration-200 ${className}`.trim()}
    >
      {children}
    </button>
  );
}
