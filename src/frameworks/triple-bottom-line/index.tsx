"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, EditableList } from "@/components/ui";
import { meta, schema, sample, type TripleBottomLine, PILLARS, type Tbl } from "./data";
export { meta, schema, sample };
export type { TripleBottomLine };

const LABEL: Record<Tbl, string> = { people: "PEOPLE", planet: "PLANET", profit: "PROFIT" };

export function View({ data, onUpdate }: { data: TripleBottomLine; onUpdate?: (d: TripleBottomLine) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: TripleBottomLine) => { setS(n); onUpdate?.(n); };
  const setP = (p: Tbl, patch: Partial<TripleBottomLine["pillars"]["people"]>) =>
    upd({ ...s, pillars: { ...s.pillars, [p]: { ...s.pillars[p], ...patch } } });

  return (
    <Card>
      <div className="border-b border-rule p-4">
        <MicroLabel>Initiative</MicroLabel>
        <InlineText value={s.initiative} onChange={(v) => upd({ ...s, initiative: v })} className="block w-full mt-1 font-medium text-[16px]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-rule">
        {PILLARS.map((p) => {
          const pos = s.pillars[p].score >= 0;
          return (
            <div key={p} data-testid={`tbl-${p}`} className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-serif font-medium text-[20px] text-vermilion">{LABEL[p]}</span>
                <input
                  type="number" min={-10} max={10}
                  value={s.pillars[p].score}
                  onChange={(e) => setP(p, { score: Math.max(-10, Math.min(10, Number(e.target.value) || 0)) })}
                  data-testid={`tbl-score-${p}`}
                  className={`w-[60px] font-serif font-medium text-[20px] text-right bg-transparent border-b ${pos ? "border-vermilion text-vermilion" : "border-rule text-ink-muted"} outline-none`}
                />
              </div>
              <MicroLabel>Pros</MicroLabel>
              <EditableList
                items={s.pillars[p].pros}
                testIdPrefix={`tbl-${p}-pro`}
                onChangeItem={(i, v) => setP(p, { pros: s.pillars[p].pros.map((x, j) => j === i ? v : x) })}
                onRemove={(i) => setP(p, { pros: s.pillars[p].pros.filter((_, j) => j !== i) })}
                onAdd={() => setP(p, { pros: [...s.pillars[p].pros, ""] })}
              />
              <div className="mt-3">
                <MicroLabel>Cons</MicroLabel>
                <EditableList
                  items={s.pillars[p].cons}
                  testIdPrefix={`tbl-${p}-con`}
                  onChangeItem={(i, v) => setP(p, { cons: s.pillars[p].cons.map((x, j) => j === i ? v : x) })}
                  onRemove={(i) => setP(p, { cons: s.pillars[p].cons.filter((_, j) => j !== i) })}
                  onAdd={() => setP(p, { cons: [...s.pillars[p].cons, ""] })}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
