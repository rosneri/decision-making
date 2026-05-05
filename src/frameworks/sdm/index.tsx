"use client";
import { useState } from "react";
import { z } from "zod";

export const meta = {
  id: "sdm",
  name: "Shared Decision-Making",
  category: "Medical & clinical",
  blurb: "Compare options on outcomes the patient actually cares about.",
} as const;

export const schema = z.object({
  framework: z.literal("sdm"),
  category: z.string(),
  title: z.string(),
  patientPriority: z.string(),
  options: z.array(z.object({
    name: z.string(),
    survivalPct: z.number().min(0).max(100),
    qualityOfLife: z.number().int().min(0).max(5),
    burden: z.number().int().min(0).max(5),
  })).min(1).max(8),
  recommendation: z.string(),
});
export type Sdm = z.infer<typeof schema>;

export const sample: Sdm = {
  framework: "sdm",
  category: meta.category,
  title: "Stage I prostate cancer · 64yo · active",
  patientPriority: "keep my running",
  options: [
    { name: "Active surveillance", survivalPct: 99, qualityOfLife: 5, burden: 1 },
    { name: "Surgery (RP)", survivalPct: 97, qualityOfLife: 3, burden: 4 },
    { name: "Radiation", survivalPct: 96, qualityOfLife: 3, burden: 3 },
    { name: "Hormone therapy", survivalPct: 92, qualityOfLife: 2, burden: 2 },
  ],
  recommendation: "Given priority on staying active, surveillance preserves QoL with minimal survival trade-off.",
};

export function View({ data, onUpdate }: { data: Sdm; onUpdate?: (d: Sdm) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Sdm) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<Sdm["options"][number]>) =>
    upd({ ...s, options: s.options.map((o, j) => j === i ? { ...o, ...patch } : o) });

  // best fit = highest QoL × survival, low burden
  const scored = s.options.map((o, i) => ({ ...o, i, fit: o.survivalPct * o.qualityOfLife / Math.max(1, o.burden) }));
  const best = scored.reduce((a, x) => x.fit > a.fit ? x : a, scored[0]!);

  return (
    <div className="border border-ink bg-paper">
      <div className="p-4 border-b border-rule bg-paper-deep">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Patient priority</span>
        <input value={s.patientPriority} onChange={(e) => upd({ ...s, patientPriority: e.target.value })}
          className="block w-full mt-1 font-serif italic text-[16px] bg-transparent border-none outline-none text-ink" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-rule">
        {scored.map((o) => {
          const isBest = o.i === best.i;
          return (
            <div key={o.i} data-testid={`sdm-option-${o.i}`}
              className={`p-4 ${isBest ? "bg-vermilion/5" : ""}`}>
              <input value={o.name} onChange={(e) => set(o.i, { name: e.target.value })}
                className={`font-serif text-[16px] font-medium bg-transparent border-none outline-none w-full ${isBest ? "text-vermilion" : "text-ink"}`} />
              <Row label="5-yr survival" suffix="%">
                <input type="number" min={0} max={100} value={o.survivalPct}
                  onChange={(e) => set(o.i, { survivalPct: Math.max(0, Math.min(100, Number(e.target.value) || 0)) })}
                  className="w-14 text-right font-code text-[13px] bg-transparent border-b border-rule outline-none" />
              </Row>
              <Row label="Quality of life" suffix="/5">
                <input type="number" min={0} max={5} value={o.qualityOfLife}
                  onChange={(e) => set(o.i, { qualityOfLife: Math.max(0, Math.min(5, Number(e.target.value) || 0)) })}
                  className="w-10 text-right font-code text-[13px] bg-transparent border-b border-rule outline-none" />
              </Row>
              <Row label="Burden" suffix="/5">
                <input type="number" min={0} max={5} value={o.burden}
                  onChange={(e) => set(o.i, { burden: Math.max(0, Math.min(5, Number(e.target.value) || 0)) })}
                  className="w-10 text-right font-code text-[13px] bg-transparent border-b border-rule outline-none" />
              </Row>
            </div>
          );
        })}
      </div>
      <div className="p-4 border-t border-rule bg-paper-deep" data-testid="sdm-best">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Best fit</span>
        <span className="ml-2 font-serif font-medium text-vermilion text-[15px]">{best.name}</span>
      </div>
    </div>
  );
}

function Row({ label, suffix, children }: { label: string; suffix: string; children: React.ReactNode }) {
  return (
    <div className="mt-2 flex items-center gap-2">
      <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted flex-1">{label}</span>
      {children}
      <span className="font-code text-[11px] text-ink-muted">{suffix}</span>
    </div>
  );
}
