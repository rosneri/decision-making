"use client";
import { useState } from "react";
import { z } from "zod";

const COND = ["capability", "credibility", "communication"] as const;
type Cond = (typeof COND)[number];

export const meta = {
  id: "deterrence",
  name: "Deterrence",
  category: "Diplomatic & geopolitical",
  blurb: "Capability, credibility, communication — all three required, or the threat fails.",
} as const;

export const schema = z.object({
  framework: z.literal("deterrence"),
  category: z.string(),
  title: z.string(),
  conditions: z.record(z.enum(COND), z.object({
    state: z.enum(["yes", "weak", "no"]),
    note: z.string(),
  })),
  recommendation: z.string(),
});
export type Deterrence = z.infer<typeof schema>;

export const sample: Deterrence = {
  framework: "deterrence",
  category: meta.category,
  title: "Will the threat actually deter the rival?",
  conditions: {
    capability: { state: "yes", note: "we can retaliate" },
    credibility: { state: "weak", note: "past inaction has broken the signal" },
    communication: { state: "yes", note: "they got the message" },
  },
  recommendation: "Credibility is the weak link. Deterrence will fail until past inaction is repaired with a smaller, visible commitment.",
};

const META: Record<Cond, { label: string; q: string }> = {
  capability: { label: "Capability", q: "can we actually retaliate?" },
  credibility: { label: "Credibility", q: "do they believe we will?" },
  communication: { label: "Communication", q: "did they get the signal?" },
};

const cycleState = (v: "yes" | "weak" | "no"): "yes" | "weak" | "no" =>
  v === "yes" ? "weak" : v === "weak" ? "no" : "yes";

export function View({ data, onUpdate }: { data: Deterrence; onUpdate?: (d: Deterrence) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Deterrence) => { setS(n); onUpdate?.(n); };
  const set = (c: Cond, patch: Partial<Deterrence["conditions"][Cond]>) =>
    upd({ ...s, conditions: { ...s.conditions, [c]: { ...s.conditions[c]!, ...patch } } });

  const weakest = COND.find((c) => s.conditions[c]!.state !== "yes");
  const willHold = !weakest;

  return (
    <div className="border border-ink bg-paper">
      <ul className="divide-y divide-rule">
        {COND.map((c) => {
          const cd = s.conditions[c]!;
          const failing = cd.state !== "yes";
          return (
            <li key={c} data-testid={`deterrence-${c}`}
              className={`p-4 grid grid-cols-[140px_1fr_120px] gap-3 items-center ${failing && c === weakest ? "bg-vermilion/5" : ""}`}>
              <div>
                <div className="font-serif text-[15px] font-medium text-ink">{META[c].label}</div>
                <div className="font-serif italic text-[12px] text-ink-muted">{META[c].q}</div>
              </div>
              <input value={cd.note} onChange={(e) => set(c, { note: e.target.value })}
                className="font-serif italic text-[14px] bg-transparent border-b border-rule outline-none focus:border-vermilion text-ink" />
              <button onClick={() => set(c, { state: cycleState(cd.state) })}
                data-testid={`deterrence-${c}-state`}
                className={`font-code text-[11px] tracking-[0.22em] uppercase font-medium border px-2 py-1 ${
                  cd.state === "yes" ? "border-ink text-ink" : cd.state === "weak" ? "border-vermilion text-vermilion bg-vermilion/10" : "border-vermilion text-paper bg-vermilion"
                }`}>
                {cd.state === "yes" ? "✓ yes" : cd.state === "weak" ? "weak" : "✗ no"}
              </button>
            </li>
          );
        })}
      </ul>
      <div className={`p-4 border-t border-ink text-center font-code text-[12px] tracking-[0.22em] uppercase font-medium ${willHold ? "bg-paper-deep text-ink" : "bg-vermilion text-paper"}`}
        data-testid="deterrence-verdict">
        {willHold ? "Deterrence will hold" : `Will fail · weak link: ${META[weakest!].label}`}
      </div>
    </div>
  );
}
