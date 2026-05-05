"use client";
import { useState } from "react";
import { z } from "zod";

export const meta = {
  id: "regret_min",
  name: "Regret Minimization",
  category: "Career & life design",
  blurb: "Project to age 80. Look back. Which choice would you regret not taking?",
} as const;

export const schema = z.object({
  framework: z.literal("regret_min"),
  category: z.string(),
  title: z.string(),
  options: z.array(z.object({
    name: z.string(),
    regretIfTaken: z.number().int().min(1).max(10),
    regretIfNotTaken: z.number().int().min(1).max(10),
    eightyYrThought: z.string(),
  })).min(2).max(6),
  recommendation: z.string(),
});
export type RegretMin = z.infer<typeof schema>;

export const sample: RegretMin = {
  framework: "regret_min",
  category: meta.category,
  title: "Take the moonshot job, or the safe one?",
  options: [
    { name: "Moonshot", regretIfTaken: 2, regretIfNotTaken: 8, eightyYrThought: "glad I tried." },
    { name: "Safe job", regretIfTaken: 6, regretIfNotTaken: 3, eightyYrThought: "what if?" },
  ],
  recommendation: "Moonshot has 6× regret-asymmetry. Take it; the floor is recoverable, the ceiling isn't.",
};

export function View({ data, onUpdate }: { data: RegretMin; onUpdate?: (d: RegretMin) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: RegretMin) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<RegretMin["options"][number]>) =>
    upd({ ...s, options: s.options.map((o, j) => j === i ? { ...o, ...patch } : o) });
  const add = () => upd({ ...s, options: [...s.options, { name: "Option", regretIfTaken: 5, regretIfNotTaken: 5, eightyYrThought: "" }] });
  const rm = (i: number) => upd({ ...s, options: s.options.filter((_, j) => j !== i) });

  // Pick option that minimizes max regret across both branches
  const scored = s.options.map((o, i) => ({ ...o, i, asymmetry: o.regretIfNotTaken - o.regretIfTaken }));
  const best = scored.reduce((a, x) => x.asymmetry > a.asymmetry ? x : a, scored[0]!);

  return (
    <div className="border border-ink bg-paper">
      <div className="p-4 border-b border-rule bg-paper-deep font-serif italic text-[14px] text-ink-muted">
        &ldquo;Project yourself to 80. Look back. Which choice will you regret?&rdquo;
      </div>
      {scored.map((o) => {
        const isBest = o.i === best.i;
        return (
          <div key={o.i} data-testid={`regret-option-${o.i}`}
            className={`p-4 border-b border-rule ${isBest ? "bg-vermilion/5" : ""}`}>
            <div className="flex items-center gap-2">
              <input value={o.name} onChange={(e) => set(o.i, { name: e.target.value })}
                className={`font-serif text-[16px] font-medium bg-transparent border-none outline-none flex-1 ${isBest ? "text-vermilion" : "text-ink"}`} />
              <button onClick={() => rm(o.i)} aria-label="remove" className="text-ink-muted hover:text-vermilion">×</button>
            </div>
            <input value={o.eightyYrThought} onChange={(e) => set(o.i, { eightyYrThought: e.target.value })}
              placeholder="At 80 you say: …"
              className="block w-full mt-1 font-serif italic text-[14px] text-ink-muted bg-transparent border-b border-rule outline-none focus:border-vermilion" />
            <div className="grid grid-cols-2 gap-4 mt-3">
              <label>
                <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Regret if taken</span>
                <input type="range" min={1} max={10} value={o.regretIfTaken}
                  onChange={(e) => set(o.i, { regretIfTaken: Number(e.target.value) })}
                  data-testid={`regret-${o.i}-taken`}
                  aria-label={`regret if taken for ${o.name}`}
                  className="block w-full" />
                <span className="font-code text-[11px] text-ink-muted">{o.regretIfTaken}/10</span>
              </label>
              <label>
                <span className="font-code text-[10px] tracking-[0.22em] uppercase text-vermilion font-medium">Regret if NOT taken</span>
                <input type="range" min={1} max={10} value={o.regretIfNotTaken}
                  onChange={(e) => set(o.i, { regretIfNotTaken: Number(e.target.value) })}
                  data-testid={`regret-${o.i}-not`}
                  aria-label={`regret if not taken for ${o.name}`}
                  className="block w-full" />
                <span className="font-code text-[11px] text-vermilion">{o.regretIfNotTaken}/10</span>
              </label>
            </div>
          </div>
        );
      })}
      <button onClick={add} className="font-serif italic text-[13px] text-ink-muted hover:text-vermilion px-4 py-2 w-full text-left">+ option</button>
      <div className="p-4 border-t border-rule bg-paper-deep">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Lowest 80-year regret</span>
        <span className="ml-2 font-serif font-medium text-vermilion text-[15px]" data-testid="regret-best">{best.name}</span>
      </div>
    </div>
  );
}
