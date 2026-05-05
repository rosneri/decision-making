"use client";
import { useState } from "react";
import { z } from "zod";

export const meta = {
  id: "inversion",
  name: "Inversion",
  category: "Mental models",
  blurb: "Stop asking how to succeed. Ask how this fails — then avoid that.",
} as const;

export const schema = z.object({
  framework: z.literal("inversion"),
  category: z.string(),
  title: z.string(),
  forwardGoal: z.string(),
  failureModes: z.array(z.string()).min(1).max(10),
  recommendation: z.string(),
});
export type Inversion = z.infer<typeof schema>;

export const sample: Inversion = {
  framework: "inversion",
  category: meta.category,
  title: "How do I make this product launch succeed?",
  forwardGoal: "Make the launch a success",
  failureModes: ["pricing too high", "wrong audience", "onboarding slips", "support overwhelmed"],
  recommendation: "Pre-empt each failure mode: anchor pricing to a known band, run a 50-customer beta, and staff support up by 2× for week one.",
};

export function View({ data, onUpdate }: { data: Inversion; onUpdate?: (d: Inversion) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Inversion) => { setS(n); onUpdate?.(n); };
  const setMode = (i: number, v: string) =>
    upd({ ...s, failureModes: s.failureModes.map((m, j) => j === i ? v : m) });
  const add = () => upd({ ...s, failureModes: [...s.failureModes, ""] });
  const rm = (i: number) => upd({ ...s, failureModes: s.failureModes.filter((_, j) => j !== i) });

  return (
    <div className="border border-ink bg-paper grid grid-cols-2">
      <div className="p-6 opacity-50 border-r border-rule">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Forward</span>
        <p className="font-serif italic text-[15px] text-ink mt-1">how could it succeed?</p>
        <input value={s.forwardGoal} onChange={(e) => upd({ ...s, forwardGoal: e.target.value })}
          className="w-full mt-3 bg-transparent border-b border-rule outline-none font-serif text-[15px] text-ink py-1" />
        <p className="font-serif italic text-[12px] text-ink-muted mt-3">(set this aside — flip the question.)</p>
      </div>
      <div className="p-6 relative">
        <span className="absolute -left-3 top-6 bg-paper px-1 font-code text-[10px] tracking-[0.22em] text-vermilion font-medium">Flip ↺</span>
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-vermilion font-medium">Invert</span>
        <p className="font-serif italic text-[15px] text-ink mt-1">how could it fail?</p>
        <ul className="mt-3 space-y-1">
          {s.failureModes.map((m, i) => (
            <li key={i} className="flex items-center gap-2 group border-b border-rule pb-1">
              <span className="font-code text-[11px] text-vermilion w-6">·{String(i + 1).padStart(2, "0")}</span>
              <input value={m} onChange={(e) => setMode(i, e.target.value)}
                placeholder="A way it fails." aria-label={`failure ${i + 1}`}
                className="flex-1 bg-transparent border-none outline-none font-serif text-[14px] text-ink placeholder:text-ink-muted placeholder:italic" />
              <span className="font-serif text-vermilion">✗</span>
              <button onClick={() => rm(i)} aria-label="remove failure"
                className="opacity-0 group-hover:opacity-100 text-ink-muted hover:text-vermilion">×</button>
            </li>
          ))}
        </ul>
        <button onClick={add} className="mt-3 font-serif italic text-[13px] text-ink-muted hover:text-vermilion">+ add</button>
        <p className="mt-4 font-serif italic text-[13px] text-ink border-t border-rule pt-2">
          ∴ avoid these and you&apos;ve already won.
        </p>
      </div>
    </div>
  );
}
