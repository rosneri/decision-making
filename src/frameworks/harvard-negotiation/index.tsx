"use client";
import { useState } from "react";
import { z } from "zod";

export const meta = {
  id: "harvard_negotiation",
  name: "Principled Negotiation",
  category: "Negotiation & conflict",
  blurb: "Separate people from problem; focus on interests; invent options; insist on objective criteria.",
} as const;

export const schema = z.object({
  framework: z.literal("harvard_negotiation"),
  category: z.string(),
  title: z.string(),
  positions: z.array(z.string()).min(0).max(10),
  interests: z.array(z.string()).min(0).max(10),
  options: z.array(z.string()).min(0).max(10),
  criteria: z.array(z.string()).min(0).max(10),
  recommendation: z.string(),
});
export type Harvard = z.infer<typeof schema>;

export const sample: Harvard = {
  framework: "harvard_negotiation",
  category: meta.category,
  title: "Tenant wants to break the lease — what's the deal?",
  positions: ["I want out, no penalty", "you owe 6 months rent"],
  interests: ["moving for a job", "need to refill quickly"],
  options: ["tenant helps find replacement → 1 month penalty + deposit refund"],
  criteria: ["local market vacancy rate", "comparable lease-break clauses"],
  recommendation: "Move from positions to interests first. The replacement-finder option satisfies both interests at fair cost.",
};

type Section = "positions" | "interests" | "options" | "criteria";

const META: Record<Section, { label: string; sub: string; accent: boolean }> = {
  positions: { label: "Positions", sub: "what they say", accent: false },
  interests: { label: "Interests", sub: "why they say it", accent: true },
  options: { label: "Options", sub: "mutual gain ideas", accent: true },
  criteria: { label: "Objective criteria", sub: "external standards", accent: false },
};

export function View({ data, onUpdate }: { data: Harvard; onUpdate?: (d: Harvard) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Harvard) => { setS(n); onUpdate?.(n); };
  const setItem = (sec: Section, i: number, v: string) =>
    upd({ ...s, [sec]: s[sec].map((x, j) => j === i ? v : x) });
  const add = (sec: Section) => upd({ ...s, [sec]: [...s[sec], ""] });
  const rm = (sec: Section, i: number) => upd({ ...s, [sec]: s[sec].filter((_, j) => j !== i) });

  return (
    <div className="border border-ink bg-paper grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-rule">
      {(Object.keys(META) as Section[]).map((sec) => (
        <div key={sec} className={`p-4 ${META[sec].accent ? "bg-vermilion/5" : ""}`} data-testid={`hn-${sec}`}>
          <span className={`font-code text-[10px] tracking-[0.22em] uppercase font-medium ${META[sec].accent ? "text-vermilion" : "text-ink-muted"}`}>
            {META[sec].label} · <span className="italic font-normal">{META[sec].sub}</span>
          </span>
          <ul className="mt-3 space-y-1">
            {s[sec].map((x, i) => (
              <li key={i} className="flex items-center gap-2 group border-b border-rule pb-1">
                <input value={x} onChange={(e) => setItem(sec, i, e.target.value)}
                  className="flex-1 font-serif text-[14px] bg-transparent border-none outline-none text-ink" />
                <button onClick={() => rm(sec, i)} aria-label="remove"
                  className="opacity-0 group-hover:opacity-100 text-ink-muted hover:text-vermilion">×</button>
              </li>
            ))}
          </ul>
          <button onClick={() => add(sec)} className="mt-2 font-serif italic text-[13px] text-ink-muted hover:text-vermilion">+ add</button>
        </div>
      ))}
    </div>
  );
}
