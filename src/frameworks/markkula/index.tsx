"use client";
import { useState } from "react";
import { z } from "zod";

const LENSES = ["utilitarian", "rights", "justice", "commonGood", "virtue"] as const;
type Lens = (typeof LENSES)[number];

export const meta = {
  id: "markkula",
  name: "Markkula Framework",
  category: "Ethical & moral",
  blurb: "Five ethical lenses. The weakest one is your real risk.",
} as const;

export const schema = z.object({
  framework: z.literal("markkula"),
  category: z.string(),
  title: z.string(),
  scores: z.record(z.enum(LENSES), z.number().int().min(0).max(5)),
  notes: z.record(z.enum(LENSES), z.string()),
  recommendation: z.string(),
});
export type Markkula = z.infer<typeof schema>;

export const sample: Markkula = {
  framework: "markkula",
  category: meta.category,
  title: "Use facial recognition for store entry?",
  scores: { utilitarian: 4, rights: 2, justice: 2, commonGood: 4, virtue: 3 },
  notes: {
    utilitarian: "shorter lines, less theft",
    rights: "biometric capture without explicit consent",
    justice: "false-match bias hits some demographics harder",
    commonGood: "fewer staff incidents",
    virtue: "is this the kind of business we want to be?",
  },
  recommendation: "Rights and Justice are weak. Don't ship without consent flow + bias audit.",
};

const META: Record<Lens, { label: string; q: string }> = {
  utilitarian: { label: "Utilitarian", q: "greatest good?" },
  rights: { label: "Rights", q: "respects dignity?" },
  justice: { label: "Justice", q: "fair to all?" },
  commonGood: { label: "Common Good", q: "serves community?" },
  virtue: { label: "Virtue", q: "person you want to be?" },
};

export function View({ data, onUpdate }: { data: Markkula; onUpdate?: (d: Markkula) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Markkula) => { setS(n); onUpdate?.(n); };
  const setScore = (l: Lens, v: number) =>
    upd({ ...s, scores: { ...s.scores, [l]: v } });
  const setNote = (l: Lens, v: string) =>
    upd({ ...s, notes: { ...s.notes, [l]: v } });

  const weakest = LENSES.reduce((w, l) => (s.scores[l]! < s.scores[w]! ? l : w), LENSES[0]);

  return (
    <div className="border border-ink bg-paper">
      <ul className="divide-y divide-rule">
        {LENSES.map((l) => {
          const score = s.scores[l]!;
          const isWeak = l === weakest;
          return (
            <li key={l} data-testid={`lens-${l}`}
              className={`p-4 grid grid-cols-[150px_1fr_auto] gap-4 items-center ${isWeak ? "bg-vermilion/5" : ""}`}>
              <div>
                <div className={`font-serif text-[16px] font-medium ${isWeak ? "text-vermilion" : "text-ink"}`}>{META[l].label}</div>
                <div className="font-serif italic text-[12px] text-ink-muted">{META[l].q}</div>
              </div>
              <input value={s.notes[l] ?? ""} onChange={(e) => setNote(l, e.target.value)}
                className="font-serif italic text-[14px] bg-transparent border-b border-rule outline-none focus:border-vermilion text-ink py-1" />
              <div className="flex gap-1" role="group" aria-label={`score for ${l}`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setScore(l, n)}
                    aria-label={`set ${n}`}
                    className={`w-3.5 h-3.5 rounded-full border ${n <= score ? (isWeak ? "bg-vermilion border-vermilion" : "bg-ink border-ink") : "border-rule"}`} />
                ))}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="p-4 border-t border-rule bg-paper-deep">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Weakest lens</span>
        <span className="ml-2 font-serif font-medium text-vermilion text-[15px]" data-testid="markkula-weakest">{META[weakest].label}</span>
      </div>
    </div>
  );
}
