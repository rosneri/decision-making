"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText } from "@/components/ui";
import { meta, schema, sample, type Lean } from "./data";
export { meta, schema, sample };
export type { Lean };

export function View({ data, onUpdate }: { data: Lean; onUpdate?: (d: Lean) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Lean) => { setS(n); onUpdate?.(n); };

  return (
    <Card>
      <div className="p-3 border-b border-rule flex items-center justify-between">
        <MicroLabel>
          Cycle <span className="text-vermilion font-medium" data-testid="lean-cycle">{s.cycle}</span>
        </MicroLabel>
        <button
          onClick={() => upd({ ...s, cycle: s.cycle + 1 })}
          data-testid="lean-next-cycle"
          className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted hover:text-vermilion border border-rule px-3 py-1"
        >
          Next cycle →
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-rule">
        {[
          { l: "Build", k: "build" as const, v: s.build },
          { l: "Measure", k: "measure" as const },
          { l: "Learn", k: "learn" as const, v: s.learn },
        ].map(({ l, k, v }) => (
          <div key={l} className="p-4">
            <MicroLabel accent bold>{l}</MicroLabel>
            {k === "measure" ? (
              <div className="mt-1 grid grid-cols-2 gap-2">
                <InlineText
                  value={s.measure.metric}
                  onChange={(nv) => upd({ ...s, measure: { ...s.measure, metric: nv } })}
                  size="sm"
                  className="border-b border-rule py-0.5"
                />
                <input
                  type="number"
                  value={s.measure.value}
                  onChange={(e) => upd({ ...s, measure: { ...s.measure, value: Number(e.target.value) || 0 } })}
                  data-testid="lean-measure-value"
                  className="font-code text-[16px] font-medium bg-transparent border-b border-rule outline-none focus:border-vermilion py-0.5 text-ink"
                />
              </div>
            ) : (
              <textarea
                value={v}
                onChange={(e) => upd({ ...s, [k]: e.target.value })}
                data-testid={`lean-${k}`}
                className="block w-full mt-1 font-serif text-[14px] bg-transparent border-t border-rule pt-2 outline-none focus:border-vermilion resize-none text-ink"
                rows={3}
              />
            )}
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-rule">
        <MicroLabel>Hypothesis</MicroLabel>
        <InlineText
          value={s.hypothesis}
          onChange={(v) => upd({ ...s, hypothesis: v })}
          italic
          size="sm"
          className="block w-full mt-1 border-b border-rule"
        />
      </div>
      <div className="p-4 border-t border-rule flex gap-2 flex-wrap">
        <MicroLabel className="self-center">Decision</MicroLabel>
        {(["persevere", "pivot", "kill"] as const).map((d) => (
          <button
            key={d}
            onClick={() => upd({ ...s, decision: d })}
            data-testid={`lean-decision-${d}`}
            aria-pressed={s.decision === d}
            className={`font-code text-[11px] tracking-[0.22em] uppercase font-medium px-3 py-1 border ${s.decision === d ? "bg-vermilion text-paper border-vermilion" : "border-rule text-ink-muted hover:border-ink"}`}
          >
            {d}
          </button>
        ))}
      </div>
    </Card>
  );
}
