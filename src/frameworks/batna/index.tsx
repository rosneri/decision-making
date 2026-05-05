"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText } from "@/components/ui";
import { meta, schema, sample, type Batna } from "./data";
export { meta, schema, sample };
export type { Batna };

export function View({ data, onUpdate }: { data: Batna; onUpdate?: (d: Batna) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Batna) => { setS(n); onUpdate?.(n); };

  const lo = s.yourBatna.value;
  const hi = s.theirBatna.value;
  const zopaExists = lo < hi;
  const min = Math.min(lo, hi, s.yourTarget, s.yourAnchor) - 20;
  const max = Math.max(lo, hi, s.yourTarget, s.yourAnchor) + 20;
  const span = max - min || 1;
  const pct = (v: number) => ((v - min) / span) * 100;

  const numCls = "block w-full mt-1 font-serif text-[18px] bg-transparent border-b border-rule outline-none focus:border-vermilion py-1";

  return (
    <Card>
      <div className="grid grid-cols-2 divide-x divide-rule border-b border-rule">
        {[
          { k: "yourBatna" as const, label: "Your BATNA", val: s.yourBatna },
          { k: "theirBatna" as const, label: "Their BATNA", val: s.theirBatna },
        ].map((c) => (
          <div key={c.k} className="p-4">
            <MicroLabel>{c.label}</MicroLabel>
            <InlineText
              value={c.val.label}
              onChange={(v) => upd({ ...s, [c.k]: { ...c.val, label: v } })}
              className="block w-full mt-1"
            />
            <div className="flex items-baseline gap-1 mt-2">
              <span className="font-code text-[11px] text-ink-muted">{s.unit}</span>
              <input
                type="number"
                value={c.val.value}
                onChange={(e) => upd({ ...s, [c.k]: { ...c.val, value: Number(e.target.value) || 0 } })}
                data-testid={`batna-${c.k}-value`}
                className="font-serif font-medium text-[24px] text-vermilion w-24 bg-transparent border-b border-rule outline-none focus:border-vermilion"
              />
            </div>
          </div>
        ))}
      </div>
      <div className="p-6">
        <MicroLabel>Salary band</MicroLabel>
        <div className="relative h-16 mt-3 border-2 border-ink" data-testid="batna-band">
          {zopaExists && (
            <div
              className="absolute inset-y-0 bg-vermilion/20 border-l border-r border-vermilion grid place-items-center"
              style={{ left: `${pct(lo)}%`, width: `${pct(hi) - pct(lo)}%` }}
              data-testid="batna-zopa"
            >
              <MicroLabel accent bold>ZOPA</MicroLabel>
            </div>
          )}
          {!zopaExists && (
            <div className="absolute inset-0 grid place-items-center font-code text-[11px] tracking-[0.18em] uppercase text-vermilion" data-testid="batna-no-zopa">
              No ZOPA — no deal exists
            </div>
          )}
          <span className="absolute -bottom-5 font-code text-[11px] text-ink-muted" style={{ left: `${pct(lo)}%`, transform: "translateX(-50%)" }}>{lo}</span>
          <span className="absolute -bottom-5 font-code text-[11px] text-ink-muted" style={{ left: `${pct(hi)}%`, transform: "translateX(-50%)" }}>{hi}</span>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-10">
          <label>
            <MicroLabel>Anchor first at</MicroLabel>
            <input
              type="number"
              value={s.yourAnchor}
              onChange={(e) => upd({ ...s, yourAnchor: Number(e.target.value) || 0 })}
              data-testid="batna-anchor"
              className={numCls}
            />
          </label>
          <label>
            <MicroLabel>Target</MicroLabel>
            <input
              type="number"
              value={s.yourTarget}
              onChange={(e) => upd({ ...s, yourTarget: Number(e.target.value) || 0 })}
              data-testid="batna-target"
              className={numCls}
            />
          </label>
        </div>
      </div>
    </Card>
  );
}
