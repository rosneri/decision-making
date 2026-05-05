import type { DecisionMatrix } from "./schema";

export function getMetrics(d: DecisionMatrix) {
  const totalW = d.criteria.reduce((s, c) => s + c.weight, 0) || 1;
  const totals = d.options.map((o) =>
    o.scores.reduce((sum, s, j) => sum + s * ((d.criteria[j]?.weight ?? 0) / totalW), 0),
  );
  const winner = totals.reduce((bi, t, i) => (t > (totals[bi] ?? 0) ? i : bi), 0);
  return [
    { k: "Winner", v: d.options[winner]?.name ?? "—" },
    { k: "Score", v: (totals[winner] ?? 0).toFixed(2) },
  ];
}
