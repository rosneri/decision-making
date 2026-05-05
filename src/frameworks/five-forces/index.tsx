"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, DotMeter } from "@/components/ui";
import { meta, schema, sample, type FiveForces, FORCES, type Force, FORCE_META } from "./data";
export { meta, schema, sample };
export type { FiveForces };

export function View({ data, onUpdate }: { data: FiveForces; onUpdate?: (d: FiveForces) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: FiveForces) => { setS(n); onUpdate?.(n); };
  const set = (f: Force, patch: Partial<FiveForces["forces"][Force]>) =>
    upd({ ...s, forces: { ...s.forces, [f]: { ...s.forces[f]!, ...patch } } });

  return (
    <Card className="p-6">
      <ul className="space-y-3">
        {FORCES.map((f) => {
          const force = s.forces[f]!;
          const isCenter = f === "rivalry";
          return (
            <li
              key={f}
              data-testid={`force-${f}`}
              className={`flex items-center gap-4 p-3 border ${isCenter ? "border-vermilion bg-vermilion/5" : "border-rule"}`}
            >
              <MicroLabel accent={isCenter} bold className="w-40">{FORCE_META[f].label}</MicroLabel>
              <InlineText
                value={force.note}
                onChange={(v) => set(f, { note: v })}
                italic
                size="sm"
              />
              <DotMeter
                value={force.level}
                onChange={(n) => set(f, { level: n })}
                variant={isCenter ? "ring" : "dot"}
                size="sm"
                accent={isCenter}
                ariaLabel={`level for ${f}`}
                itemAriaLabel={(n) => `set level ${n}`}
              />
              <span className="font-code text-[13px] text-ink-muted w-6 text-right">{force.level}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
