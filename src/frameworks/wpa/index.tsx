"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, AddButton, RemoveButton } from "@/components/ui";
import { meta, schema, sample, type Wpa } from "./data";
export { meta, schema, sample };
export type { Wpa };

export function View({ data, onUpdate }: { data: Wpa; onUpdate?: (d: Wpa) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Wpa) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<Wpa["options"][number]>) =>
    upd({ ...s, options: s.options.map((o, j) => j === i ? { ...o, ...patch } : o) });
  const add = () => upd({ ...s, options: [...s.options, { name: "Option", wp: 0.5, note: "" }] });
  const rm = (i: number) => upd({ ...s, options: s.options.filter((_, j) => j !== i) });

  const best = s.options.reduce((b, o, i) => o.wp > s.options[b]!.wp ? i : b, 0);

  return (
    <Card>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-rule">
        {s.options.map((o, i) => {
          const isBest = i === best;
          return (
            <div key={i} className={`p-4 ${isBest ? "bg-vermilion/5" : ""}`} data-testid={`wpa-option-${i}`}>
              <div className="flex items-center gap-2">
                <InlineText
                  value={o.name}
                  onChange={(v) => set(i, { name: v })}
                  className={`text-[16px] font-medium ${isBest ? "text-vermilion" : ""}`}
                />
                <RemoveButton onClick={() => rm(i)} ariaLabel="remove" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <MicroLabel>WP</MicroLabel>
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.01}
                  value={o.wp}
                  onChange={(e) => set(i, { wp: Math.max(0, Math.min(1, Number(e.target.value) || 0)) })}
                  data-testid={`wpa-wp-${i}`}
                  className={`font-serif font-medium text-[28px] w-24 bg-transparent border-b border-rule outline-none ${isBest ? "text-vermilion" : "text-ink"}`}
                />
                <span className={`font-code text-[14px] ${isBest ? "text-vermilion" : "text-ink-muted"}`}>{(o.wp * 100).toFixed(1)}%</span>
              </div>
              <InlineText
                value={o.note}
                onChange={(v) => set(i, { note: v })}
                italic
                size="sm"
                className="block w-full mt-1 text-ink-muted border-b border-rule"
              />
              {isBest && <MicroLabel accent className="block mt-2">★ pick</MicroLabel>}
            </div>
          );
        })}
      </div>
      <AddButton onClick={add} className="px-3 py-2 border-t border-rule w-full text-left">+ option</AddButton>
    </Card>
  );
}
