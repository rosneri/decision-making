"use client";
import { useState } from "react";
import { z } from "zod";

const CATS = ["must", "performance", "delighter", "indifferent"] as const;
type Cat = (typeof CATS)[number];

export const meta = {
  id: "kano",
  name: "Kano Model",
  category: "Product & UX",
  blurb: "Sort features into must-haves, performance, delighters, indifferent.",
} as const;

export const schema = z.object({
  framework: z.literal("kano"),
  category: z.string(),
  title: z.string(),
  features: z.array(z.object({
    name: z.string(),
    category: z.enum(CATS),
  })).min(1).max(20),
  recommendation: z.string(),
});
export type Kano = z.infer<typeof schema>;

export const sample: Kano = {
  framework: "kano",
  category: meta.category,
  title: "Which features actually make customers love us?",
  features: [
    { name: "login works", category: "must" },
    { name: "data exports", category: "must" },
    { name: "faster search", category: "performance" },
    { name: "rich filters", category: "performance" },
    { name: "handwritten welcome card", category: "delighter" },
    { name: "obscure setting toggle", category: "indifferent" },
  ],
  recommendation: "Don't waste a quarter polishing indifferents. Fix the must-haves; budget 20% for one delighter.",
};

const CAT_META: Record<Cat, { label: string; color: string }> = {
  must: { label: "Must-have", color: "border-ink text-ink" },
  performance: { label: "Performance", color: "border-ink-muted text-ink-muted" },
  delighter: { label: "Delighter", color: "border-vermilion text-vermilion" },
  indifferent: { label: "Indifferent", color: "border-rule text-ink-muted" },
};

export function View({ data, onUpdate }: { data: Kano; onUpdate?: (d: Kano) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Kano) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<Kano["features"][number]>) =>
    upd({ ...s, features: s.features.map((f, j) => j === i ? { ...f, ...patch } : f) });
  const add = () => upd({ ...s, features: [...s.features, { name: "feature", category: "performance" }] });
  const rm = (i: number) => upd({ ...s, features: s.features.filter((_, j) => j !== i) });

  return (
    <div className="border border-ink bg-paper">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-rule">
        {CATS.map((c) => {
          const items = s.features.map((f, i) => ({ f, i })).filter(({ f }) => f.category === c);
          return (
            <div key={c} data-testid={`kano-bucket-${c}`} className="p-4 min-h-[180px]">
              <span className={`font-code text-[10px] tracking-[0.22em] uppercase font-medium ${CAT_META[c].color.split(" ")[1]}`}>
                {CAT_META[c].label}
              </span>
              <ul className="mt-2 space-y-1">
                {items.map(({ f, i }) => (
                  <li key={i} className="flex items-center gap-1 group">
                    <span className="font-serif text-[14px] text-ink flex-1">{f.name}</span>
                    <button onClick={() => rm(i)} aria-label="remove"
                      className="opacity-0 group-hover:opacity-100 text-ink-muted hover:text-vermilion">×</button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
      <div className="border-t border-rule p-4">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">All features</span>
        <ul className="mt-2 space-y-1">
          {s.features.map((f, i) => (
            <li key={i} className="flex items-center gap-2">
              <input value={f.name} onChange={(e) => set(i, { name: e.target.value })}
                className="flex-1 font-serif italic text-[14px] bg-transparent border-b border-rule outline-none focus:border-vermilion py-0.5" />
              <select value={f.category} onChange={(e) => set(i, { category: e.target.value as Cat })}
                aria-label={`category for ${f.name}`}
                className="font-code text-[10px] tracking-[0.18em] uppercase bg-transparent border border-rule px-2 py-1">
                {CATS.map((c) => <option key={c} value={c}>{CAT_META[c].label}</option>)}
              </select>
              <button onClick={() => rm(i)} aria-label="remove" className="text-ink-muted hover:text-vermilion">×</button>
            </li>
          ))}
        </ul>
        <button onClick={add} className="mt-3 font-serif italic text-[13px] text-ink-muted hover:text-vermilion">+ add feature</button>
      </div>
    </div>
  );
}
