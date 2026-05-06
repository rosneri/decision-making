"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, RemoveButton, AddButton } from "@/components/ui";
import { meta, schema, sample, type Pareto } from "./data";
export { meta, schema, sample };
export type { Pareto };

export function View({ data, onUpdate }: { data: Pareto; onUpdate?: (d: Pareto) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Pareto) => { setS(n); onUpdate?.(n); };

  const sortedIdx = s.causes
    .map((c, i) => ({ c, i }))
    .sort((a, b) => b.c.contribution - a.c.contribution);
  const total = s.causes.reduce((n, c) => n + c.contribution, 0) || 1;
  const cumPct = sortedIdx.map((_, i) =>
    sortedIdx.slice(0, i + 1).reduce((n, x) => n + x.c.contribution, 0) / total
  );
  const vitalCount = cumPct.findIndex((p) => p >= 0.8) + 1 || sortedIdx.length;

  return (
    <Card>
      <div className="border-b border-rule p-4 flex items-center gap-4">
        <MicroLabel>Metric</MicroLabel>
        <InlineText
          value={s.metric}
          onChange={(v) => upd({ ...s, metric: v })}
          className="font-medium text-[14px]"
        />
        <span className="ml-auto font-code text-[10px] tracking-[0.22em] uppercase text-vermilion" data-testid="pareto-vital">
          vital few: {vitalCount}
        </span>
      </div>
      <ul className="list-none p-0 m-0">
        {sortedIdx.map(({ c, i }, rank) => {
          const pct = c.contribution / total;
          const isVital = rank < vitalCount;
          return (
            <li
              key={i}
              data-testid={`pareto-row-${rank}`}
              className={`flex items-center gap-3 py-3 px-4 border-b border-rule ${isVital ? "bg-vermilion/5" : ""}`}
            >
              <span className="font-code text-[10px] text-ink-muted w-[22px]">·{String(rank + 1).padStart(2, "0")}</span>
              <InlineText
                value={c.name}
                onChange={(v) => upd({ ...s, causes: s.causes.map((cc, j) => j === i ? { ...cc, name: v } : cc) })}
                className={`flex-1 ${isVital ? "text-vermilion font-medium" : ""}`}
              />
              <div className="flex-1 h-2 bg-rule/40 relative">
                <div
                  data-testid={`pareto-bar-${rank}`}
                  className={`absolute inset-y-0 left-0 ${isVital ? "bg-vermilion" : "bg-ink-muted/40"}`}
                  style={{ width: `${pct * 100}%` }}
                />
              </div>
              <input
                type="number"
                value={c.contribution}
                onChange={(e) => upd({ ...s, causes: s.causes.map((cc, j) => j === i ? { ...cc, contribution: Number(e.target.value) || 0 } : cc) })}
                data-testid={`pareto-val-${i}`}
                className="w-[70px] font-code text-[13px] text-right bg-transparent border-b border-rule outline-none"
              />
              <span className="font-code text-[10px] text-ink-muted w-[40px] text-right">{(pct * 100).toFixed(0)}%</span>
              <RemoveButton onClick={() => upd({ ...s, causes: s.causes.filter((_, j) => j !== i) })} showOnHover />
            </li>
          );
        })}
      </ul>
      <div className="p-3">
        <AddButton onClick={() => upd({ ...s, causes: [...s.causes, { name: "", contribution: 0 }] })}>
          + add cause
        </AddButton>
      </div>
    </Card>
  );
}
