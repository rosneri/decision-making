"use client";
import { useState } from "react";
import { Card, InlineText, AddButton, RemoveButton, DotMeter, VerdictBar } from "@/components/ui";
import { meta, schema, sample, type AlgoImpact } from "./data";
export { meta, schema, sample };
export type { AlgoImpact };

export function View({ data, onUpdate }: { data: AlgoImpact; onUpdate?: (d: AlgoImpact) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: AlgoImpact) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<AlgoImpact["risks"][number]>) =>
    upd({ ...s, risks: s.risks.map((r, j) => j === i ? { ...r, ...patch } : r) });
  const add = () => upd({ ...s, risks: [...s.risks, { dimension: "new risk", severity: 3, open: true }] });
  const rm = (i: number) => upd({ ...s, risks: s.risks.filter((_, j) => j !== i) });

  const blockers = s.risks.filter((r) => r.open && r.severity >= 4);
  const blocked = blockers.length > 0;

  return (
    <Card>
      <ul className="divide-y divide-rule">
        {s.risks.map((r, i) => {
          const danger = r.open && r.severity >= 4;
          return (
            <li
              key={i}
              data-testid={`ai-risk-${i}`}
              className={`p-3 grid grid-cols-[1fr_auto_auto_auto] gap-2 sm:gap-3 items-center ${danger ? "bg-vermilion/5" : ""}`}
            >
              <InlineText
                value={r.dimension}
                onChange={(v) => set(i, { dimension: v })}
                italic
                size="sm"
                className={danger ? "text-vermilion" : ""}
              />
              <DotMeter
                value={r.severity}
                onChange={(n) => set(i, { severity: n })}
                accent={danger}
                size="sm"
                ariaLabel={`severity ${r.dimension}`}
              />
              <button
                onClick={() => set(i, { open: !r.open })}
                data-testid={`ai-status-${i}`}
                aria-pressed={!r.open}
                className={`font-code text-[11px] tracking-[0.22em] uppercase font-medium ${r.open ? "text-vermilion" : "text-ink"}`}
              >
                {r.open ? "✗ open" : "✓ ok"}
              </button>
              <RemoveButton onClick={() => rm(i)} ariaLabel="remove" />
            </li>
          );
        })}
      </ul>
      <AddButton onClick={add} className="px-3 py-2 border-t border-rule w-full text-left">+ risk</AddButton>
      <VerdictBar alarm={blocked} testId="ai-verdict">
        {blocked ? `Do not ship · ${blockers.length} open severity 4+` : "OK to ship"}
      </VerdictBar>
    </Card>
  );
}
