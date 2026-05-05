"use client";
import { useState } from "react";
import { z } from "zod";

export const meta = {
  id: "rpd",
  name: "Recognition-Primed",
  category: "Crisis & emergency",
  blurb: "Match to a known pattern, mentally simulate the first workable course, execute.",
} as const;

export const schema = z.object({
  framework: z.literal("rpd"),
  category: z.string(),
  title: z.string(),
  pattern: z.string(),
  course: z.string(),
  checks: z.array(z.object({
    item: z.string(),
    state: z.enum(["yes", "no", "unknown"]),
  })).min(1).max(20),
  recommendation: z.string(),
});
export type Rpd = z.infer<typeof schema>;

export const sample: Rpd = {
  framework: "rpd",
  category: meta.category,
  title: "Engine fire. 90 seconds to call it.",
  pattern: "this looks like the 2019 fire on flight 47",
  course: "divert to KSAN — closest field with rescue, 14 min to ground",
  checks: [
    { item: "runway long enough", state: "yes" },
    { item: "fuel margin OK", state: "yes" },
    { item: "crosswind 22kt", state: "unknown" },
  ],
  recommendation: "All blocking checks are green or marginal. Execute.",
};

const cycleState = (v: "yes" | "no" | "unknown"): "yes" | "no" | "unknown" =>
  v === "yes" ? "no" : v === "no" ? "unknown" : "yes";

export function View({ data, onUpdate }: { data: Rpd; onUpdate?: (d: Rpd) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Rpd) => { setS(n); onUpdate?.(n); };
  const setCheck = (i: number, patch: Partial<Rpd["checks"][number]>) =>
    upd({ ...s, checks: s.checks.map((c, j) => j === i ? { ...c, ...patch } : c) });
  const addCheck = () => upd({ ...s, checks: [...s.checks, { item: "", state: "unknown" }] });
  const rmCheck = (i: number) => upd({ ...s, checks: s.checks.filter((_, j) => j !== i) });

  const blocked = s.checks.some((c) => c.state === "no");
  const allYes = s.checks.every((c) => c.state === "yes");

  return (
    <div className="border border-ink bg-paper">
      <div className="p-4 border-b border-vermilion bg-vermilion/5">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-vermilion font-medium">Pattern · match</span>
        <input value={s.pattern} onChange={(e) => upd({ ...s, pattern: e.target.value })}
          data-testid="rpd-pattern"
          className="block w-full mt-1 font-serif italic text-[15px] bg-transparent border-none outline-none text-ink" />
      </div>
      <div className="p-4 border-b border-rule">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">First workable course</span>
        <input value={s.course} onChange={(e) => upd({ ...s, course: e.target.value })}
          className="block w-full mt-1 font-serif text-[16px] bg-transparent border-none outline-none text-ink" />
      </div>
      <div className="p-4">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Will it work?</span>
        <ul className="mt-3 space-y-1">
          {s.checks.map((c, i) => (
            <li key={i} className="flex items-center gap-3 group" data-testid={`rpd-check-${i}`}>
              <button onClick={() => setCheck(i, { state: cycleState(c.state) })}
                aria-label={`toggle ${c.item}: ${c.state}`}
                className={`w-7 h-7 grid place-items-center font-serif text-[18px] font-medium border-[1.5px] ${c.state === "yes" ? "border-ink text-ink" : c.state === "no" ? "border-vermilion text-vermilion bg-vermilion/10" : "border-rule text-ink-muted"}`}>
                {c.state === "yes" ? "✓" : c.state === "no" ? "✗" : "?"}
              </button>
              <input value={c.item} onChange={(e) => setCheck(i, { item: e.target.value })}
                className="flex-1 font-serif text-[14px] bg-transparent border-b border-rule outline-none focus:border-vermilion text-ink" />
              <button onClick={() => rmCheck(i)} aria-label="remove"
                className="opacity-0 group-hover:opacity-100 text-ink-muted hover:text-vermilion">×</button>
            </li>
          ))}
        </ul>
        <button onClick={addCheck} className="mt-2 font-serif italic text-[13px] text-ink-muted hover:text-vermilion">+ check</button>
      </div>
      <div className={`p-3 border-t border-ink text-center font-code text-[12px] tracking-[0.22em] uppercase font-medium ${blocked ? "bg-paper-deep text-ink-muted" : "bg-vermilion text-paper"}`} data-testid="rpd-verdict">
        {blocked ? "Hold — find another course" : allYes ? "Execute" : "Execute (with risk noted)"}
      </div>
    </div>
  );
}
