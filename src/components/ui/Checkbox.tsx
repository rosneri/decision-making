"use client";

export function Checkbox({
  checked,
  onChange,
  ariaLabel,
  testId,
  className = "",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  ariaLabel?: string;
  testId?: string;
  className?: string;
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      {...(ariaLabel ? { "aria-label": ariaLabel } : {})}
      {...(testId ? { "data-testid": testId } : {})}
      className={`w-4 h-4 accent-vermilion cursor-pointer ${className}`}
    />
  );
}
