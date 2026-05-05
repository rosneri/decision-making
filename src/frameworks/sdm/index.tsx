"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, InlineNumber } from "@/components/ui";
import { meta, schema, sample, type Sdm } from "./data";
export { meta, schema, sample };
export type { Sdm };

export function View({ data, onUpdate }: { data: Sdm; onUpdate?: (d: Sdm) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Sdm) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<Sdm["options"][number]>) =>
    upd({ ...s, options: s.options.map((o, j) => j === i ? { ...o, ...patch } : o) });

  const scored = s.options.map((o, i) => ({ ...o, i, fit: o.survivalPct * o.qualityOfLife / Math.max(1, o.burden) }));
  const best = scored.reduce((a, x) => x.fit > a.fit ? x : a, scored[0]!);

  return (
    <Card>
      <div className="p-4 border-b border-rule bg-paper-deep">
        <MicroLabel>Patient priority</MicroLabel>
        <InlineText
          value={s.patientPriority}
          onChange={(v) => upd({ ...s, patientPriority: v })}
          italic
          size="lg"
          className="block w-full mt-1 text-[16px]"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-rule">
        {scored.map((o) => {
          const isBest = o.i === best.i;
          return (
            <div key={o.i} data-testid={`sdm-option-${o.i}`} className={`p-4 ${isBest ? "bg-vermilion/5" : ""}`}>
              <InlineText
                value={o.name}
                onChange={(v) => set(o.i, { name: v })}
                className={`text-[16px] font-medium ${isBest ? "text-vermilion" : ""}`}
              />
              <Row label="5-yr survival" suffix="%">
                <InlineNumber
                  value={o.survivalPct}
                  onChange={(v) => set(o.i, { survivalPct: Math.max(0, Math.min(100, v)) })}
                  min={0}
                  max={100}
                  size="sm"
                  width="w-14"
                  className="text-right border-b border-rule"
                />
              </Row>
              <Row label="Quality of life" suffix="/5">
                <InlineNumber
                  value={o.qualityOfLife}
                  onChange={(v) => set(o.i, { qualityOfLife: Math.max(0, Math.min(5, v)) })}
                  min={0}
                  max={5}
                  size="sm"
                  width="w-10"
                  className="text-right border-b border-rule"
                />
              </Row>
              <Row label="Burden" suffix="/5">
                <InlineNumber
                  value={o.burden}
                  onChange={(v) => set(o.i, { burden: Math.max(0, Math.min(5, v)) })}
                  min={0}
                  max={5}
                  size="sm"
                  width="w-10"
                  className="text-right border-b border-rule"
                />
              </Row>
            </div>
          );
        })}
      </div>
      <div className="p-4 border-t border-rule bg-paper-deep" data-testid="sdm-best">
        <MicroLabel>Best fit</MicroLabel>
        <span className="ml-2 font-serif font-medium text-vermilion text-[15px]">{best.name}</span>
      </div>
    </Card>
  );
}

function Row({ label, suffix, children }: { label: string; suffix: string; children: React.ReactNode }) {
  return (
    <div className="mt-2 flex items-center gap-2">
      <MicroLabel className="flex-1">{label}</MicroLabel>
      {children}
      <span className="font-code text-[11px] text-ink-muted">{suffix}</span>
    </div>
  );
}
