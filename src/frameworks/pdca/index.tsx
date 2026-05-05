"use client";
import { useState } from "react";
import { z } from "zod";

const PHASES = ["P", "D", "C", "A"] as const;
type Phase = (typeof PHASES)[number];

export const meta = {
  id: "pdca",
  name: "PDCA Cycle",
  category: "Operations & quality",
  blurb: "Plan, Do, Check, Act — small loops that compound improvement.",
} as const;

export const schema = z.object({
  framework: z.literal("pdca"),
  category: z.string(),
  title: z.string(),
  cycleNumber: z.number().int().min(1),
  phases: z.object({
    P: z.string(), D: z.string(), C: z.string(), A: z.string(),
  }),
  current: z.enum(PHASES),
  recommendation: z.string(),
});
export type Pdca = z.infer<typeof schema>;

export const sample: Pdca = {
  framework: "pdca",
  category: meta.category,
  title: "Bug rate keeps climbing. Where do we start?",
  cycleNumber: 3,
  phases: {
    P: "hypothesis: tests miss async edge cases",
    D: "added 12 contract tests on top async paths",
    C: "still seeing 38% of bugs in async code",
    A: "adopt: contract tests; adjust: add chaos test next cycle",
  },
  current: "A",
  recommendation: "Take the 'A' lesson into cycle 4: chaos-testing async paths is the next experiment.",
};

const META: Record<Phase, { word: string; note: string }> = {
  P: { word: "Plan", note: "hypothesis" },
  D: { word: "Do", note: "small test" },
  C: { word: "Check", note: "measure" },
  A: { word: "Act", note: "adopt or adjust" },
};

export function View({ data, onUpdate }: { data: Pdca; onUpdate?: (d: Pdca) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Pdca) => { setS(n); onUpdate?.(n); };

  const advance = () => {
    const i = PHASES.indexOf(s.current);
    if (i === PHASES.length - 1) {
      upd({ ...s, current: "P", cycleNumber: s.cycleNumber + 1 });
    } else {
      upd({ ...s, current: PHASES[i + 1]! });
    }
  };

  return (
    <div className="border border-ink bg-paper">
      <div className="border-b border-rule p-4 flex items-center justify-between">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">
          Cycle <span className="text-vermilion font-medium" data-testid="pdca-cycle-number">{s.cycleNumber}</span>
        </span>
        <button onClick={advance} data-testid="pdca-advance"
          className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted hover:text-vermilion border border-rule px-3 py-1">
          Advance →
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-rule">
        {PHASES.map((k) => {
          const isCurrent = s.current === k;
          return (
            <div key={k} data-testid={`pdca-phase-${k}`}
              className={`p-4 flex flex-col gap-2 ${isCurrent ? "bg-vermilion/5" : ""}`}>
              <div className="flex items-baseline gap-2">
                <span className={`font-serif font-medium text-[28px] ${isCurrent ? "text-vermilion" : "text-ink"}`}>{k}.</span>
                <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">{META[k].word}</span>
              </div>
              <span className="font-serif italic text-[12px] text-ink-muted">{META[k].note}</span>
              <textarea value={s.phases[k]} onChange={(e) => upd({ ...s, phases: { ...s.phases, [k]: e.target.value } })}
                className="mt-1 w-full font-serif text-[14px] bg-transparent border-t border-rule pt-2 outline-none focus:border-vermilion text-ink resize-none"
                rows={4} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
