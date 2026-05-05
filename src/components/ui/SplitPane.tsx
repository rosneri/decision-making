import type { ReactNode } from "react";

export function SplitPane({
  cols = 2,
  divided = true,
  responsive = true,
  className = "",
  children,
}: {
  cols?: 2 | 3 | 4;
  divided?: boolean;
  responsive?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const colCls = cols === 2 ? "md:grid-cols-2" : cols === 3 ? "md:grid-cols-3" : "md:grid-cols-4";
  const layout = responsive ? `grid-cols-1 ${colCls}` : `grid-cols-${cols}`;
  const dividers = divided
    ? responsive
      ? "divide-y md:divide-y-0 md:divide-x divide-rule"
      : "divide-x divide-rule"
    : "";
  return <div className={`grid ${layout} ${dividers} ${className}`.trim()}>{children}</div>;
}
