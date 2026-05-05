"use client";
import { useState } from "react";
import { z } from "zod";

const STAGES = ["observe", "orient", "decide", "act"] as const;
type Stage = (typeof STAGES)[number];

export const meta = {
  id: "ooda",
  name: "OODA Loop",
  category: "Military & intelligence",
  blurb: "Observe, Orient, Decide, Act — faster than the adversary wins.",
} as const;

export const schema = z.object({
  framework: z.literal("ooda"),
  category: z.string(),
  title: z.string(),
  notes: z.object({
    observe: z.string(),
    orient: z.string(),
    decide: z.string(),
    act: z.string(),
  }),
  current: z.enum(STAGES),
  recommendation: z.string(),
});
export type Ooda = z.infer<typeof schema>;

export const sample: Ooda = {
  framework: "ooda",
  category: meta.category,
  title: "Competitor just dropped a clone of our flagship.",
  notes: {
    observe: "competitor shipped, 8% of our trial signups now mention it",
    orient: "they undercut on price; quality unknown",
    decide: "",
    act: "",
  },
  current: "orient",
  recommendation: "Get more signal: ship a deep comparison page in 48h. Then decide on price vs. positioning move.",
};

const STAGE_META: Record<Stage, { letter: string; label: string; note: string }> = {
  observe: { letter: "O", label: "Observe", note: "what just changed?" },
  orient: { letter: "O", label: "Orient", note: "what does it mean?" },
  decide: { letter: "D", label: "Decide", note: "pick the move" },
  act: { letter: "A", label: "Act", note: "ship the response" },
};

export function View({ data, onUpdate }: { data: Ooda; onUpdate?: (d: Ooda) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Ooda) => { setS(n); onUpdate?.(n); };
  const setNote = (k: Stage, v: string) =>
    upd({ ...s, notes: { ...s.notes, [k]: v } });

  return (
    <div className="border border-ink bg-paper">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-rule">
        {STAGES.map((k) => {
          const isCurrent = s.current === k;
          return (
            <button key={k} onClick={() => upd({ ...s, current: k })}
              data-testid={`ooda-${k}`}
              className={`p-4 text-left flex flex-col gap-2 ${isCurrent ? "bg-vermilion/5" : ""}`}>
              <div className={`w-12 h-12 rounded-full grid place-items-center font-serif font-medium text-[22px] ${isCurrent ? "bg-vermilion text-paper" : "border-[1.5px] border-ink text-ink"}`}>
                {STAGE_META[k].letter}
              </div>
              <span className={`font-code text-[10px] tracking-[0.22em] uppercase font-medium ${isCurrent ? "text-vermilion" : "text-ink-muted"}`}>
                {STAGE_META[k].label}
              </span>
              <span className="font-serif italic text-[12px] text-ink-muted">{STAGE_META[k].note}</span>
            </button>
          );
        })}
      </div>
      <div className="p-4 border-t border-rule">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">{STAGE_META[s.current].label} notes</span>
        <textarea value={s.notes[s.current] ?? ""} onChange={(e) => setNote(s.current, e.target.value)}
          data-testid="ooda-current-notes"
          className="block w-full mt-1 font-serif text-[14px] bg-transparent border-t border-rule pt-2 outline-none focus:border-vermilion resize-none text-ink"
          rows={3} />
      </div>
    </div>
  );
}
