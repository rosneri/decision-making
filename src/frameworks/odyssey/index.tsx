"use client";
import { useState } from "react";
import { z } from "zod";

export const meta = {
  id: "odyssey",
  name: "Odyssey Plans",
  category: "Career & life design",
  blurb: "Sketch three radically different five-year plans, then prototype the most magnetic.",
} as const;

export const schema = z.object({
  framework: z.literal("odyssey"),
  category: z.string(),
  title: z.string(),
  plans: z.array(z.object({
    title: z.string(),
    note: z.string(),
    trajectory: z.array(z.number().min(0).max(10)).min(2).max(12),
    resources: z.number().int().min(1).max(5),
    likeability: z.number().int().min(1).max(5),
    confidence: z.number().int().min(1).max(5),
  })).min(2).max(5),
  preferred: z.number().int().min(0).max(2),
  recommendation: z.string(),
});
export type Odyssey = z.infer<typeof schema>;

export const sample: Odyssey = {
  framework: "odyssey",
  category: meta.category,
  title: "What should the next five years look like?",
  plans: [
    { title: "Plan A · the path I'm on", note: "promoted to staff", trajectory: [3, 4, 4, 5, 4, 5], resources: 4, likeability: 3, confidence: 4 },
    { title: "Plan B · a real alternative", note: "found a startup", trajectory: [3, 3, 5, 5, 6, 6], resources: 2, likeability: 5, confidence: 3 },
    { title: "Plan C · what if money/status didn't matter?", note: "teach + write", trajectory: [3, 4, 4, 4, 5, 6], resources: 3, likeability: 4, confidence: 3 },
  ],
  preferred: 1,
  recommendation: "Plan B has the steepest likeability gradient. Talk to 3 people doing it before committing.",
};

export function View({ data, onUpdate }: { data: Odyssey; onUpdate?: (d: Odyssey) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Odyssey) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<Odyssey["plans"][number]>) =>
    upd({ ...s, plans: s.plans.map((p, j) => j === i ? { ...p, ...patch } : p) });

  return (
    <div className="border border-ink bg-paper divide-y divide-rule">
      {s.plans.map((p, i) => {
        const isPreferred = i === s.preferred;
        return (
          <div key={i} data-testid={`odyssey-plan-${i}`}
            className={`p-4 ${isPreferred ? "bg-vermilion/5" : ""}`}>
            <div className="flex items-center gap-2">
              <input value={p.title} onChange={(e) => set(i, { title: e.target.value })}
                className={`font-serif text-[16px] font-medium bg-transparent border-none outline-none flex-1 ${isPreferred ? "text-vermilion" : "text-ink"}`} />
              <button onClick={() => upd({ ...s, preferred: i })}
                data-testid={`odyssey-prefer-${i}`}
                className={`font-code text-[10px] tracking-[0.22em] uppercase font-medium ${isPreferred ? "text-vermilion" : "text-ink-muted hover:text-ink"}`}>
                {isPreferred ? "★ preferred" : "set preferred"}
              </button>
            </div>
            <input value={p.note} onChange={(e) => set(i, { note: e.target.value })}
              className="block w-full mt-1 font-serif italic text-[13px] text-ink-muted bg-transparent border-none outline-none" />
            <svg viewBox="0 0 240 30" className="w-full h-10 mt-2">
              <path d={p.trajectory.map((y, x) => `${x === 0 ? "M" : "L"} ${x * 40 + 10} ${30 - y * 3}`).join(" ")}
                stroke={isPreferred ? "var(--vermilion)" : "var(--ink)"} strokeWidth={1.5} fill="none" />
              {p.trajectory.map((y, x) => (
                <circle key={x} cx={x * 40 + 10} cy={30 - y * 3} r={2} fill={isPreferred ? "var(--vermilion)" : "var(--ink)"} />
              ))}
            </svg>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {(["resources", "likeability", "confidence"] as const).map((k) => (
                <label key={k}>
                  <span className="font-code text-[10px] tracking-[0.18em] uppercase text-ink-muted">{k}</span>
                  <input type="range" min={1} max={5} value={p[k]}
                    onChange={(e) => set(i, { [k]: Number(e.target.value) })}
                    aria-label={`${k} for ${p.title}`} className="block w-full" />
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
