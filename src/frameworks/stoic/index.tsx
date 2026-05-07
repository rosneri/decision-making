"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, AddButton, RemoveButton } from "@/components/ui";
import { meta, schema, sample, type Stoic, type Side } from "./data";
export { meta, schema, sample };
export type { Stoic };

export function View({ data, onUpdate }: { data: Stoic; onUpdate?: (d: Stoic) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Stoic) => { setS(n); onUpdate?.(n); };
  const set = (side: Side, i: number, v: string) =>
    upd({ ...s, [side]: s[side].map((x, j) => j === i ? v : x) });
  const add = (side: Side) => upd({ ...s, [side]: [...s[side], ""] });
  const rm = (side: Side, i: number) => upd({ ...s, [side]: s[side].filter((_, j) => j !== i) });
  const move = (from: Side, i: number) => {
    const item = s[from][i]!;
    const to: Side = from === "yours" ? "notYours" : "yours";
    upd({ ...s, [from]: s[from].filter((_, j) => j !== i), [to]: [...s[to], item] });
  };

  return (
    <Card className="grid grid-cols-1 divide-y sm:grid-cols-2 sm:divide-y-0 sm:divide-x divide-ink">
      <div className="p-4 bg-vermilion/5">
        <MicroLabel accent bold>Yours · act on these</MicroLabel>
        <ul className="mt-3 space-y-1" data-testid="stoic-yours">
          {s.yours.map((x, i) => (
            <li key={i} className="flex items-center gap-2 group">
              <span className="text-vermilion">•</span>
              <InlineText value={x} onChange={(v) => set("yours", i, v)} size="sm" className="border-b border-rule" />
              <button
                onClick={() => move("yours", i)}
                aria-label="move to not yours"
                className="opacity-0 group-hover:opacity-100 font-code text-[10px] text-ink-muted hover:text-vermilion"
              >
                →
              </button>
              <RemoveButton onClick={() => rm("yours", i)} ariaLabel="remove" showOnHover />
            </li>
          ))}
        </ul>
        <AddButton onClick={() => add("yours")} className="mt-2">+ add</AddButton>
      </div>
      <div className="p-4 opacity-70">
        <MicroLabel>Not yours · release these</MicroLabel>
        <ul className="mt-3 space-y-1" data-testid="stoic-not-yours">
          {s.notYours.map((x, i) => (
            <li key={i} className="flex items-center gap-2 group">
              <span className="text-ink-muted">○</span>
              <InlineText
                value={x}
                onChange={(v) => set("notYours", i, v)}
                size="sm"
                className="border-b border-rule text-ink-muted line-through"
              />
              <button
                onClick={() => move("notYours", i)}
                aria-label="move to yours"
                className="opacity-0 group-hover:opacity-100 font-code text-[10px] text-ink-muted hover:text-vermilion"
              >
                ←
              </button>
              <RemoveButton onClick={() => rm("notYours", i)} ariaLabel="remove" showOnHover />
            </li>
          ))}
        </ul>
        <AddButton onClick={() => add("notYours")} className="mt-2">+ add</AddButton>
      </div>
    </Card>
  );
}
