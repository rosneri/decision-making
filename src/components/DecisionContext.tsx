"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { FrameworkResult } from "@/frameworks";

interface DecisionContextValue {
  result: FrameworkResult;
  updateResult: (next: FrameworkResult) => void;
}

const DecisionContext = createContext<DecisionContextValue | null>(null);

export function DecisionProvider({
  value,
  children,
}: {
  value: DecisionContextValue;
  children: ReactNode;
}) {
  return <DecisionContext.Provider value={value}>{children}</DecisionContext.Provider>;
}

/** Returns the active decision context, or null when rendered outside a
 *  DecisionProvider (e.g. in unit tests that render a View directly). */
export function useDecision(): DecisionContextValue | null {
  return useContext(DecisionContext);
}

/** Hook for framework views: prefer the decision context when present;
 *  otherwise fall back to props (so isolated unit tests keep working). */
export function useFrameworkData<T extends FrameworkResult>(
  initial: T,
  onUpdate?: (next: T) => void,
): [T, (next: T) => void] {
  const ctx = useDecision();
  const [local, setLocal] = useState<T>(initial);
  if (ctx) {
    return [ctx.result as T, (next) => ctx.updateResult(next)];
  }
  return [
    local,
    (next) => {
      setLocal(next);
      onUpdate?.(next);
    },
  ];
}
