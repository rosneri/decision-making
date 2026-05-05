"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, AddButton, RemoveButton } from "@/components/ui";
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
    <Card className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-rule">
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
                <div className="flex gap-1" role="group" aria-label={`severity ${x.name}`}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => set(side, i, { severity: n })}
                      aria-label={`severity ${n}`}
                      className={`w-2.5 h-2.5 rounded-full ${n <= x.severity ? "bg-vermilion" : "border border-vermilion"}`}
                    />
                  ))}
                </div>
                <RemoveButton onClick={() => rm(side, i)} ariaLabel="remove" showOnHover />
              </li>
            ))}
          </ul>
          <AddButton onClick={() => add(side)} className="mt-3">+ add</AddButton>
        </div>
      ))}
    </Card>
  );
}
