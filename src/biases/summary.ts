import type { BiasFinding } from "./schema";

export type BiasRisk = "low" | "medium" | "high";

export interface BiasSummary {
  // Findings the user has not dismissed.
  active: BiasFinding[];
  dismissed: number;
  risk: BiasRisk;
  // Strongest active finding, if any.
  top: BiasFinding | null;
}

// Pure helper shared by the result UI and the metrics strip. High when any
// single finding is strong or several medium ones stack up.
export function summarizeBiases(findings: readonly BiasFinding[] | undefined): BiasSummary {
  const list = findings ?? [];
  const active = list.filter((f) => !f.dismissed);
  const dismissed = list.length - active.length;
  const max = active.reduce((m, f) => Math.max(m, f.severity), 0);
  const total = active.reduce((s, f) => s + f.severity, 0);
  const risk: BiasRisk = max >= 4 || total >= 8 ? "high" : active.length > 0 ? "medium" : "low";
  const top = active.reduce<BiasFinding | null>((b, f) => (b === null || f.severity > b.severity ? f : b), null);
  return { active, dismissed, risk, top };
}
