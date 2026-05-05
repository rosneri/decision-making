"use client";
import { useState } from "react";
import { z } from "zod";

export const meta = {
  id: "wpa",
  name: "Win Probability Added",
  category: "Sports analytics",
  blurb: "Pick the option that adds more expected win probability — not the one that 'feels' safer.",
} as const;

export const schema = z.object({
  framework: z.literal("wpa"),
  category: z.string(),
  title: z.string(),
  options: z.array(z.object({
    name: z.string(),
    wp: z.number().min(0).max(1),
    note: z.string(),
  })).min(2).max(6),
  recommendation: z.string(),
});
export type Wpa = z.infer<typeof schema>;

export const sample: Wpa = {
  framework: "wpa",
  category: meta.category,
  title: "4th & 2 from your own 38. Punt or go?",
  options: [
    { name: "Punt", wp: 0.41, note: "opp gets ball at own 25" },
    { name: "Go for it", wp: 0.47, note: "0.68 convert × .56 (with FD) + .32 × .28 (turnover)" },
  ],
  recommendation: "Going for it adds +6 WP%. The math says go even though the gut says punt.",
};

export function View({ data, onUpdate }: { data: Wpa; onUpdate?: (d: Wpa) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Wpa) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<Wpa["options"][number]>) =>
    upd({ ...s, options: s.options.map((o, j) => j === i ? { ...o, ...patch } : o) });
  const add = () => upd({ ...s, options: [...s.options, { name: "Option", wp: 0.5, note: "" }] });
  const rm = (i: number) => upd({ ...s, options: s.options.filter((_, j) => j !== i) });

  const best = s.options.reduce((b, o, i) => o.wp > s.options[b]!.wp ? i : b, 0);

  return (
    <div className="border border-ink bg-paper">
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-rule">
        {s.options.map((o, i) => {
          const isBest = i === best;
          return (
            <div key={i} className={`p-4 ${isBest ? "bg-vermilion/5" : ""}`} data-testid={`wpa-option-${i}`}>
              <div className="flex items-center gap-2">
                <input value={o.name} onChange={(e) => set(i, { name: e.target.value })}
                  className={`font-serif text-[16px] font-medium bg-transparent border-none outline-none flex-1 ${isBest ? "text-vermilion" : "text-ink"}`} />
                <button onClick={() => rm(i)} aria-label="remove" className="text-ink-muted hover:text-vermilion">×</button>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">WP</span>
                <input type="number" min={0} max={1} step={0.01} value={o.wp}
                  onChange={(e) => set(i, { wp: Math.max(0, Math.min(1, Number(e.target.value) || 0)) })}
                  data-testid={`wpa-wp-${i}`}
                  className={`font-serif font-medium text-[28px] w-24 bg-transparent border-b border-rule outline-none ${isBest ? "text-vermilion" : "text-ink"}`} />
                <span className={`font-code text-[14px] ${isBest ? "text-vermilion" : "text-ink-muted"}`}>{(o.wp * 100).toFixed(1)}%</span>
              </div>
              <input value={o.note} onChange={(e) => set(i, { note: e.target.value })}
                className="block w-full mt-1 font-serif italic text-[13px] text-ink-muted bg-transparent border-b border-rule outline-none focus:border-vermilion" />
              {isBest && <span className="block mt-2 font-code text-[10px] tracking-[0.22em] uppercase text-vermilion">★ pick</span>}
            </div>
          );
        })}
      </div>
      <button onClick={add} className="font-serif italic text-[13px] text-ink-muted hover:text-vermilion px-3 py-2 border-t border-rule w-full text-left">+ option</button>
    </div>
  );
}
