"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, Range, AddButton, RemoveButton } from "@/components/ui";
import { meta, schema, sample, type Veil } from "./data";
export { meta, schema, sample };
export type { Veil };

export function View({ data, onUpdate }: { data: Veil; onUpdate?: (d: Veil) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Veil) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<Veil["seats"][number]>) =>
    upd({ ...s, seats: s.seats.map((x, j) => j === i ? { ...x, ...patch } : x) });
  const add = () => upd({ ...s, seats: [...s.seats, { who: "someone", impact: "", score: 0 }] });
  const rm = (i: number) => upd({ ...s, seats: s.seats.filter((_, j) => j !== i) });

  const worst = s.seats.reduce((a, x) => x.score < a.score ? x : a, s.seats[0]!);

  return (
    <Card>
      <div className="p-4 bg-paper-deep border-b border-rule">
        <MicroLabel>Scenario</MicroLabel>
        <InlineText
          value={s.scenario}
          onChange={(v) => upd({ ...s, scenario: v })}
          italic
          className="block w-full mt-1"
        />
      </div>
      <div className="grid grid-cols-1 divide-y sm:grid-cols-2 sm:divide-y-0 sm:divide-x divide-rule">
        {s.seats.map((seat, i) => {
          const isWorst = seat === worst;
          return (
            <div
              key={i}
              data-testid={`seat-${i}`}
              className={`p-4 border-b border-rule ${isWorst ? "bg-vermilion/5 border-l-4 border-l-vermilion" : ""}`}
            >
              <InlineText
                value={seat.who}
                onChange={(v) => set(i, { who: v })}
                className="font-medium"
              />
              <InlineText
                value={seat.impact}
                onChange={(v) => set(i, { impact: v })}
                italic
                size="sm"
                className={`block w-full mt-1 ${isWorst ? "text-vermilion" : "text-ink-muted"}`}
              />
              <div className="mt-2 flex items-center gap-2">
                <Range
                  value={seat.score}
                  onChange={(v) => set(i, { score: v })}
                  min={-5}
                  max={5}
                  testId={`seat-${i}-score`}
                  ariaLabel={`score for ${seat.who}`}
                  className="flex-1"
                />
                <span className={`font-code text-[12px] w-8 text-right ${seat.score < 0 ? "text-vermilion" : "text-ink"}`}>
                  {seat.score > 0 ? "+" : ""}{seat.score}
                </span>
                <RemoveButton onClick={() => rm(i)} ariaLabel="remove" />
              </div>
            </div>
          );
        })}
      </div>
      <AddButton onClick={add} className="px-4 py-2 border-t border-rule w-full text-left">+ another seat</AddButton>
      <div className="p-4 border-t border-rule bg-paper-deep">
        <MicroLabel>Worst-off seat</MicroLabel>
        <p className="mt-1 font-serif text-[15px] text-ink">
          <span className="font-medium">{worst.who}</span> · <span className="italic text-ink-muted">{worst.impact}</span> · <span className="text-vermilion font-medium" data-testid="veil-worst-score">{worst.score}</span>
        </p>
      </div>
    </Card>
  );
}
