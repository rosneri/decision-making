import type { CostBenefit } from "./schema";

export function getMetrics(d: CostBenefit) {
  const benTotal = d.benefits.reduce((s, x) => s + x.weight, 0);
  const costTotal = d.costs.reduce((s, x) => s + x.weight, 0);
  const diff = benTotal - costTotal;
  return [
    { k: "Benefit", v: String(benTotal) },
    { k: "Cost", v: String(costTotal) },
    { k: "Net", v: (diff > 0 ? "+" : "") + diff },
  ];
}
