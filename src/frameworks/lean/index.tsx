"use client";
import { useState } from "react";
import { z } from "zod";

export const meta = {
  id: "lean",
  name: "Build-Measure-Learn",
  category: "Innovation & creativity",
  blurb: "Tight loops: ship the smallest test, measure the right metric, decide pivot vs persevere.",
} as const;

export const schema = z.object({
  framework: z.literal("lean"),
  category: z.string(),
  title: z.string(),
  cycle: z.number().int().min(1),
  hypothesis: z.string(),
  build: z.string(),
  measure: z.object({ metric: z.string(), value: z.number() }),
  learn: z.string(),
  decision: z.enum(["persevere", "pivot", "kill"]),
  recommendation: z.string(),
});
export type Lean = z.infer<typeof schema>;

export const sample: Lean = {
  framework: "lean",
  category: meta.category,
  title: "Should we keep building, or pivot?",
  cycle: 4,
  hypothesis: "freelancers will pay $20/mo for invoice automation",
  build: "v0.3 MVP — Stripe + 3 templates",
  measure: { metric: "paid signups", value: 42 },
  learn: "freelancers love it; agencies asked for team accounts",
  decision: "pivot",
  recommendation: "Pivot the segment to small agencies; persevere on the offer. Run cycle 5 with team-account billing.",
};

export function View({ data, onUpdate }: { data: Lean; onUpdate?: (d: Lean) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Lean) => { setS(n); onUpdate?.(n); };

  return (
    <div className="border border-ink bg-paper">
      <div className="p-3 border-b border-rule flex items-center justify-between">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">
          Cycle <span className="text-vermilion font-medium" data-testid="lean-cycle">{s.cycle}</span>
        </span>
        <button onClick={() => upd({ ...s, cycle: s.cycle + 1 })}
          data-testid="lean-next-cycle"
          className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted hover:text-vermilion border border-rule px-3 py-1">
          Next cycle →
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-rule">
        {[
          { l: "Build", k: "build" as const, v: s.build },
          { l: "Measure", k: "measure" as const, v: `${s.measure.metric}: ${s.measure.value}` },
          { l: "Learn", k: "learn" as const, v: s.learn },
        ].map(({ l, k, v }) => (
          <div key={l} className="p-4">
            <span className="font-code text-[10px] tracking-[0.22em] uppercase text-vermilion font-medium">{l}</span>
            {k === "measure" ? (
              <div className="mt-1 grid grid-cols-2 gap-2">
                <input value={s.measure.metric} onChange={(e) => upd({ ...s, measure: { ...s.measure, metric: e.target.value } })}
                  className="font-serif text-[14px] bg-transparent border-b border-rule outline-none focus:border-vermilion py-0.5 text-ink" />
                <input type="number" value={s.measure.value}
                  onChange={(e) => upd({ ...s, measure: { ...s.measure, value: Number(e.target.value) || 0 } })}
                  data-testid="lean-measure-value"
                  className="font-code text-[16px] font-medium bg-transparent border-b border-rule outline-none focus:border-vermilion py-0.5 text-ink" />
              </div>
            ) : (
              <textarea value={v} onChange={(e) => upd({ ...s, [k]: e.target.value })}
                data-testid={`lean-${k}`}
                className="block w-full mt-1 font-serif text-[14px] bg-transparent border-t border-rule pt-2 outline-none focus:border-vermilion resize-none text-ink"
                rows={3} />
            )}
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-rule">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Hypothesis</span>
        <input value={s.hypothesis} onChange={(e) => upd({ ...s, hypothesis: e.target.value })}
          className="block w-full mt-1 font-serif italic text-[14px] bg-transparent border-b border-rule outline-none focus:border-vermilion text-ink" />
      </div>
      <div className="p-4 border-t border-rule flex gap-2 flex-wrap">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted self-center">Decision</span>
        {(["persevere", "pivot", "kill"] as const).map((d) => (
          <button key={d} onClick={() => upd({ ...s, decision: d })}
            data-testid={`lean-decision-${d}`}
            aria-pressed={s.decision === d}
            className={`font-code text-[11px] tracking-[0.22em] uppercase font-medium px-3 py-1 border ${s.decision === d ? "bg-vermilion text-paper border-vermilion" : "border-rule text-ink-muted hover:border-ink"}`}>
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}
