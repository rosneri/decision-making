"use client";
import { useState } from "react";
import { z } from "zod";

export const meta = {
  id: "lca",
  name: "Life-Cycle Assessment",
  category: "Environmental & sustainability",
  blurb: "Track impact across cradle-to-grave; the largest stage is your hotspot.",
} as const;

export const schema = z.object({
  framework: z.literal("lca"),
  category: z.string(),
  title: z.string(),
  unit: z.string(),
  stages: z.array(z.object({
    name: z.string(),
    impact: z.number().min(0),
  })).min(2).max(12),
  recommendation: z.string(),
});
export type Lca = z.infer<typeof schema>;

export const sample: Lca = {
  framework: "lca",
  category: meta.category,
  title: "How sustainable is the new packaging really?",
  unit: "kg CO₂e",
  stages: [
    { name: "raw materials", impact: 38 },
    { name: "manufacture", impact: 22 },
    { name: "transport", impact: 8 },
    { name: "use", impact: 18 },
    { name: "end of life", impact: 14 },
  ],
  recommendation: "Hotspot is raw materials at 38%. Switch sourcing first — manufacturing tweaks won't move the needle.",
};

export function View({ data, onUpdate }: { data: Lca; onUpdate?: (d: Lca) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Lca) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<Lca["stages"][number]>) =>
    upd({ ...s, stages: s.stages.map((x, j) => j === i ? { ...x, ...patch } : x) });
  const add = () => upd({ ...s, stages: [...s.stages, { name: "stage", impact: 5 }] });
  const rm = (i: number) => upd({ ...s, stages: s.stages.filter((_, j) => j !== i) });

  const total = s.stages.reduce((a, x) => a + x.impact, 0) || 1;
  const hotIdx = s.stages.reduce((b, x, i) => x.impact > s.stages[b]!.impact ? i : b, 0);

  return (
    <div className="border border-ink bg-paper">
      <div className="p-4">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">{s.unit} per unit · cradle → grave</span>
        <div className="mt-3 flex h-12 border-2 border-ink" data-testid="lca-bar">
          {s.stages.map((st, i) => (
            <div key={i} data-testid={`lca-segment-${i}`}
              className={`grid place-items-center text-paper font-code text-[10px] ${i === hotIdx ? "bg-vermilion" : i % 2 ? "bg-ink" : "bg-ink-muted"}`}
              style={{ flex: st.impact || 0.0001, borderRight: i < s.stages.length - 1 ? "1px solid var(--paper)" : "none" }}>
              {st.impact}
            </div>
          ))}
        </div>
        <div className="mt-1 flex">
          {s.stages.map((st, i) => (
            <span key={i} className={`text-center font-serif italic text-[12px] px-1 ${i === hotIdx ? "text-vermilion font-medium" : "text-ink-muted"}`}
              style={{ flex: st.impact || 0.0001 }}>
              {st.name}
            </span>
          ))}
        </div>
      </div>
      <table className="w-full border-t border-rule">
        <tbody>
          {s.stages.map((st, i) => (
            <tr key={i} className="border-b border-rule">
              <td className="px-3 py-2">
                <input value={st.name} onChange={(e) => set(i, { name: e.target.value })}
                  className="font-serif text-[14px] bg-transparent border-none outline-none" />
              </td>
              <td className="px-3 py-2 text-right">
                <input type="number" min={0} value={st.impact}
                  onChange={(e) => set(i, { impact: Math.max(0, Number(e.target.value) || 0) })}
                  data-testid={`lca-impact-${i}`}
                  className="font-code text-[13px] w-20 text-right bg-transparent border-b border-rule outline-none" />
              </td>
              <td className="px-3 py-2 text-right font-code text-[12px] text-ink-muted w-16">{((st.impact / total) * 100).toFixed(0)}%</td>
              <td className="px-3 py-2 text-right">
                <button onClick={() => rm(i)} aria-label="remove" className="text-ink-muted hover:text-vermilion">×</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={add} className="font-serif italic text-[13px] text-ink-muted hover:text-vermilion px-3 py-2 border-t border-rule w-full text-left">+ stage</button>
      <div className="p-4 border-t border-rule grid grid-cols-2">
        <div>
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Total</span>
          <div className="font-serif font-medium text-[20px] text-ink mt-1" data-testid="lca-total">{total} {s.unit}</div>
        </div>
        <div className="border-l border-vermilion pl-4">
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-vermilion font-medium">Hotspot</span>
          <div className="font-serif font-medium text-[20px] text-vermilion mt-1" data-testid="lca-hotspot">{s.stages[hotIdx]?.name}</div>
        </div>
      </div>
    </div>
  );
}
