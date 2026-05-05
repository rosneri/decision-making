"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, AddButton, RemoveButton, DotMeter, SplitPane } from "@/components/ui";
import { meta, schema, sample, type Doughnut, type Side } from "./data";
export { meta, schema, sample };
export type { Doughnut };

export function View({ data, onUpdate }: { data: Doughnut; onUpdate?: (d: Doughnut) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Doughnut) => { setS(n); onUpdate?.(n); };
  const set = (side: Side, i: number, patch: Partial<Doughnut[Side][number]>) =>
    upd({ ...s, [side]: s[side].map((x, j) => j === i ? { ...x, ...patch } : x) });
  const add = (side: Side) => upd({ ...s, [side]: [...s[side], { name: "dimension", severity: 1 }] });
  const rm = (side: Side, i: number) => upd({ ...s, [side]: s[side].filter((_, j) => j !== i) });

  return (
    <Card>
      <SplitPane>
        {(["shortfalls", "overshoots"] as const).map((side) => (
        <div key={side} className="p-4">
          <MicroLabel accent bold>
            {side === "shortfalls" ? "Shortfalls · social" : "Overshoots · ecological"}
          </MicroLabel>
          <ul className="mt-3 space-y-2" data-testid={`doughnut-${side}`}>
            {s[side].map((x, i) => (
              <li key={i} className="flex items-center gap-2 group">
                <InlineText
                  value={x.name}
                  onChange={(v) => set(side, i, { name: v })}
                  italic
                  size="sm"
                  className="border-b border-rule text-vermilion"
                />
                <DotMeter
                  value={x.severity}
                  onChange={(n) => set(side, i, { severity: n })}
                  variant="ring"
                  size="xs"
                  accent
                  ariaLabel={`severity ${x.name}`}
                />
                <RemoveButton onClick={() => rm(side, i)} ariaLabel="remove" showOnHover />
              </li>
            ))}
          </ul>
          <AddButton onClick={() => add(side)} className="mt-3">+ add</AddButton>
        </div>
        ))}
      </SplitPane>
    </Card>
  );
}
