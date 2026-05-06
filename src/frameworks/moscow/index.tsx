"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, RemoveButton, AddButton } from "@/components/ui";
import { meta, schema, sample, type Moscow, BUCKETS, META } from "./data";
export { meta, schema, sample };
export type { Moscow };

export function View({ data, onUpdate }: { data: Moscow; onUpdate?: (d: Moscow) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Moscow) => { setS(n); onUpdate?.(n); };

  return (
    <Card>
      <div className="border-b border-rule p-4">
        <MicroLabel>Release</MicroLabel>
        <InlineText value={s.release} onChange={(v) => upd({ ...s, release: v })} className="block w-full mt-1 font-medium text-[16px]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-x divide-y divide-rule">
        {BUCKETS.map((b) => {
          const items = s.items.map((it, i) => ({ it, i })).filter(({ it }) => it.bucket === b);
          const accent = b === "must";
          return (
            <div key={b} data-testid={`moscow-${b}`} className={`p-4 ${accent ? "bg-vermilion/5" : ""}`}>
              <MicroLabel accent={accent} bold={accent}>{META[b].word}</MicroLabel>
              <p className="font-serif italic text-[12px] text-ink-muted mt-0.5">{META[b].note}</p>
              <ul className="list-none p-0 mt-2 space-y-1">
                {items.map(({ it, i }) => (
                  <li key={i} className="flex items-center gap-2 group" data-testid={`moscow-item-${i}`}>
                    <span className={`font-code text-[10px] ${accent ? "text-vermilion" : "text-ink-muted"}`}>·</span>
                    <InlineText
                      value={it.name}
                      onChange={(v) => upd({ ...s, items: s.items.map((x, j) => j === i ? { ...x, name: v } : x) })}
                      className="flex-1"
                    />
                    <select
                      value={it.bucket}
                      onChange={(e) => upd({ ...s, items: s.items.map((x, j) => j === i ? { ...x, bucket: e.target.value as typeof BUCKETS[number] } : x) })}
                      data-testid={`moscow-bucket-${i}`}
                      className="font-code text-[10px] tracking-[0.22em] uppercase bg-transparent border-b border-rule outline-none"
                    >
                      {BUCKETS.map((bb) => (<option key={bb} value={bb}>{bb}</option>))}
                    </select>
                    <RemoveButton onClick={() => upd({ ...s, items: s.items.filter((_, j) => j !== i) })} showOnHover />
                  </li>
                ))}
              </ul>
              <div className="mt-2">
                <AddButton onClick={() => upd({ ...s, items: [...s.items, { name: "new item", bucket: b }] })}>
                  + add
                </AddButton>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
