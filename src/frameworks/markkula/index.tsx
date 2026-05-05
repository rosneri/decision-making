"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, DotMeter } from "@/components/ui";
import { meta, schema, sample, type Markkula, LENSES, type Lens, META } from "./data";
export { meta, schema, sample };
export type { Markkula };

export function View({ data, onUpdate }: { data: Markkula; onUpdate?: (d: Markkula) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Markkula) => { setS(n); onUpdate?.(n); };
  const setScore = (l: Lens, v: number) => upd({ ...s, scores: { ...s.scores, [l]: v } });
  const setNote = (l: Lens, v: string) => upd({ ...s, notes: { ...s.notes, [l]: v } });

  const weakest = LENSES.reduce((w, l) => (s.scores[l]! < s.scores[w]! ? l : w), LENSES[0]);

  return (
    <Card>
      <ul className="divide-y divide-rule">
        {LENSES.map((l) => {
          const score = s.scores[l]!;
          const isWeak = l === weakest;
          return (
            <li
              key={l}
              data-testid={`lens-${l}`}
              className={`p-4 grid grid-cols-[150px_1fr_auto] gap-4 items-center ${isWeak ? "bg-vermilion/5" : ""}`}
            >
              <div>
                <div className={`font-serif text-[16px] font-medium ${isWeak ? "text-vermilion" : "text-ink"}`}>{META[l].label}</div>
                <div className="font-serif italic text-[12px] text-ink-muted">{META[l].q}</div>
              </div>
              <InlineText
                value={s.notes[l] ?? ""}
                onChange={(v) => setNote(l, v)}
                italic
                size="sm"
                className="border-b border-rule py-1"
              />
              <DotMeter
                value={score}
                onChange={(n) => setScore(l, n)}
                variant="dot"
                accent={isWeak}
                ariaLabel={`score for ${l}`}
              />
            </li>
          );
        })}
      </ul>
      <div className="p-4 border-t border-rule bg-paper-deep">
        <MicroLabel>Weakest lens</MicroLabel>
        <span className="ml-2 font-serif font-medium text-vermilion text-[15px]" data-testid="markkula-weakest">{META[weakest].label}</span>
      </div>
    </Card>
  );
}
