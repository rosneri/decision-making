"use client";
import { useState } from "react";
import { z } from "zod";

export const meta = {
  id: "stoic",
  name: "Dichotomy of Control",
  category: "Spiritual & philosophical",
  blurb: "Yours · not yours. Act on the first; release the second.",
} as const;

export const schema = z.object({
  framework: z.literal("stoic"),
  category: z.string(),
  title: z.string(),
  yours: z.array(z.string()).min(0).max(20),
  notYours: z.array(z.string()).min(0).max(20),
  recommendation: z.string(),
});
export type Stoic = z.infer<typeof schema>;

export const sample: Stoic = {
  framework: "stoic",
  category: meta.category,
  title: "My layoff was announced. How do I think about this?",
  yours: ["how I respond", "what I learn", "how I treat colleagues", "my next application", "my morning routine"],
  notYours: ["the layoff itself", "the macro economy", "what others say", "whether they liked me", "the timing"],
  recommendation: "Spend mornings on what's yours: applications, reading, exercise. Stop replaying meetings — those are not yours.",
};

type Side = "yours" | "notYours";

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
    <div className="border border-ink bg-paper grid grid-cols-2 divide-x divide-ink">
      <div className="p-4 bg-vermilion/5">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-vermilion font-medium">Yours · act on these</span>
        <ul className="mt-3 space-y-1" data-testid="stoic-yours">
          {s.yours.map((x, i) => (
            <li key={i} className="flex items-center gap-2 group">
              <span className="text-vermilion">•</span>
              <input value={x} onChange={(e) => set("yours", i, e.target.value)}
                className="flex-1 font-serif text-[14px] bg-transparent border-b border-rule outline-none focus:border-vermilion text-ink" />
              <button onClick={() => move("yours", i)} aria-label="move to not yours"
                className="opacity-0 group-hover:opacity-100 font-code text-[10px] text-ink-muted hover:text-vermilion">→</button>
              <button onClick={() => rm("yours", i)} aria-label="remove"
                className="opacity-0 group-hover:opacity-100 text-ink-muted hover:text-vermilion">×</button>
            </li>
          ))}
        </ul>
        <button onClick={() => add("yours")} className="mt-2 font-serif italic text-[13px] text-ink-muted hover:text-vermilion">+ add</button>
      </div>
      <div className="p-4 opacity-70">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Not yours · release these</span>
        <ul className="mt-3 space-y-1" data-testid="stoic-not-yours">
          {s.notYours.map((x, i) => (
            <li key={i} className="flex items-center gap-2 group">
              <span className="text-ink-muted">○</span>
              <input value={x} onChange={(e) => set("notYours", i, e.target.value)}
                className="flex-1 font-serif text-[14px] bg-transparent border-b border-rule outline-none focus:border-vermilion text-ink-muted line-through" />
              <button onClick={() => move("notYours", i)} aria-label="move to yours"
                className="opacity-0 group-hover:opacity-100 font-code text-[10px] text-ink-muted hover:text-vermilion">←</button>
              <button onClick={() => rm("notYours", i)} aria-label="remove"
                className="opacity-0 group-hover:opacity-100 text-ink-muted hover:text-vermilion">×</button>
            </li>
          ))}
        </ul>
        <button onClick={() => add("notYours")} className="mt-2 font-serif italic text-[13px] text-ink-muted hover:text-vermilion">+ add</button>
      </div>
    </div>
  );
}
