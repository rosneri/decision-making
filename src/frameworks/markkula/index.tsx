"use client";
import { useState } from "react";
import { meta, schema, sample, type Markkula, LENSES, type Lens, META } from "./data";
export { meta, schema, sample };
export type { Markkula };

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
