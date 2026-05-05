"use client";
import { useState } from "react";
import { z } from "zod";

const STEPS = ["W", "R", "A", "P"] as const;
type Step = (typeof STEPS)[number];

export const meta = {
  id: "wrap",
  name: "WRAP Process",
  category: "Cognitive & behavioral",
  blurb: "Widen options, Reality-test, Attain distance, Prepare to be wrong.",
} as const;

export const schema = z.object({
  framework: z.literal("wrap"),
  category: z.string(),
  title: z.string(),
  steps: z.object({
    W: z.object({ done: z.boolean(), notes: z.string() }),
    R: z.object({ done: z.boolean(), notes: z.string() }),
    A: z.object({ done: z.boolean(), notes: z.string() }),
    P: z.object({ done: z.boolean(), notes: z.string() }),
  }),
  current: z.enum(STEPS),
  recommendation: z.string(),
});
export type Wrap = z.infer<typeof schema>;

export const sample: Wrap = {
  framework: "wrap",
  category: meta.category,
  title: "Should I leave my marriage?",
  steps: {
    W: { done: true, notes: "considered counseling, separation, status quo" },
    R: { done: true, notes: "tested two months apart" },
    A: { done: false, notes: "" },
    P: { done: false, notes: "" },
  },
  current: "A",
  recommendation: "You're at Attain distance — write the letter to your future self before deciding.",
};

const META: Record<Step, { word: string; desc: string }> = {
  W: { word: "Widen", desc: "find more options" },
  R: { word: "Reality-test", desc: "stress your assumptions" },
  A: { word: "Attain distance", desc: "view from a friend's seat" },
  P: { word: "Prepare to be wrong", desc: "tripwires + pre-mortem" },
};

export function View({ data, onUpdate }: { data: Wrap; onUpdate?: (d: Wrap) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Wrap) => { setS(n); onUpdate?.(n); };
  const set = (k: Step, patch: Partial<Wrap["steps"][Step]>) =>
    upd({ ...s, steps: { ...s.steps, [k]: { ...s.steps[k], ...patch } } });

  return (
    <div className="border border-ink bg-paper divide-y divide-rule">
      {STEPS.map((k) => {
        const step = s.steps[k];
        const isCurrent = s.current === k;
        return (
          <div key={k} data-testid={`wrap-step-${k}`}
            className={`p-4 flex items-center gap-4 ${isCurrent ? "bg-vermilion/5 border-l-4 border-l-vermilion" : ""}`}>
            <button onClick={() => set(k, { done: !step.done })}
              aria-label={`toggle ${META[k].word} done`}
              aria-pressed={step.done}
              className={`w-10 h-10 grid place-items-center font-serif font-medium text-[18px] rounded-full border-[1.5px] ${
                step.done ? "bg-ink text-paper border-ink" : isCurrent ? "border-vermilion text-vermilion" : "border-ink text-ink"
              }`}>
              {step.done ? "✓" : k}
            </button>
            <div className="flex-1">
              <div className="font-serif text-[16px] font-medium text-ink">{META[k].word}</div>
              <input value={step.notes} onChange={(e) => set(k, { notes: e.target.value })}
                placeholder={META[k].desc}
                className="block w-full mt-1 font-serif italic text-[13px] text-ink-muted bg-transparent border-b border-rule outline-none focus:border-vermilion py-0.5" />
            </div>
            <button onClick={() => upd({ ...s, current: k })}
              data-testid={`wrap-set-current-${k}`}
              className={`font-code text-[10px] tracking-[0.22em] uppercase font-medium ${
                isCurrent ? "text-vermilion" : "text-ink-muted hover:text-ink"
              }`}>
              {isCurrent ? "→ here" : step.done ? "done" : "next"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
