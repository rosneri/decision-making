"use client";
import { useState } from "react";
import { z } from "zod";

export const meta = {
  id: "veil_of_ignorance",
  name: "Veil of Ignorance",
  category: "Ethical & moral",
  blurb: "You don't know which seat you'll wake up in. Would you still choose this?",
} as const;

export const schema = z.object({
  framework: z.literal("veil_of_ignorance"),
  category: z.string(),
  title: z.string(),
  scenario: z.string(),
  seats: z.array(z.object({
    who: z.string(),
    impact: z.string(),
    score: z.number().int().min(-5).max(5),
  })).min(1).max(20),
  recommendation: z.string(),
});
export type Veil = z.infer<typeof schema>;

export const sample: Veil = {
  framework: "veil_of_ignorance",
  category: meta.category,
  title: "Should we restructure and lay off 15%?",
  scenario: "You don't know which seat you'll wake up in.",
  seats: [
    { who: "the CEO", impact: "+$2M bonus", score: 5 },
    { who: "a tenured eng", impact: "no change", score: 0 },
    { who: "a contractor", impact: "lose contract", score: -4 },
    { who: "a junior PM", impact: "promoted", score: 3 },
    { who: "a customer", impact: "price up 8%", score: -1 },
    { who: "a future hire", impact: "fewer roles", score: -2 },
  ],
  recommendation: "Worst-off (contractors) take a -4. If you couldn't bear that seat, redesign the change before announcing it.",
};

export function View({ data, onUpdate }: { data: Veil; onUpdate?: (d: Veil) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Veil) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<Veil["seats"][number]>) =>
    upd({ ...s, seats: s.seats.map((x, j) => j === i ? { ...x, ...patch } : x) });
  const add = () => upd({ ...s, seats: [...s.seats, { who: "someone", impact: "", score: 0 }] });
  const rm = (i: number) => upd({ ...s, seats: s.seats.filter((_, j) => j !== i) });

  const worst = s.seats.reduce((a, x) => x.score < a.score ? x : a, s.seats[0]!);

  return (
    <div className="border border-ink bg-paper">
      <div className="p-4 bg-paper-deep border-b border-rule">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Scenario</span>
        <input value={s.scenario} onChange={(e) => upd({ ...s, scenario: e.target.value })}
          className="block w-full mt-1 font-serif italic text-[15px] text-ink bg-transparent border-none outline-none" />
      </div>
      <div className="grid grid-cols-2 divide-x divide-rule">
        {s.seats.map((seat, i) => {
          const isWorst = seat === worst;
          return (
            <div key={i} data-testid={`seat-${i}`}
              className={`p-4 border-b border-rule ${isWorst ? "bg-vermilion/5 border-l-4 border-l-vermilion" : ""}`}>
              <input value={seat.who} onChange={(e) => set(i, { who: e.target.value })}
                className="font-serif text-[15px] font-medium text-ink bg-transparent border-none outline-none w-full" />
              <input value={seat.impact} onChange={(e) => set(i, { impact: e.target.value })}
                className={`block w-full mt-1 font-serif italic text-[13px] bg-transparent border-none outline-none ${isWorst ? "text-vermilion" : "text-ink-muted"}`} />
              <div className="mt-2 flex items-center gap-2">
                <input type="range" min={-5} max={5} value={seat.score}
                  onChange={(e) => set(i, { score: Number(e.target.value) })}
                  data-testid={`seat-${i}-score`}
                  aria-label={`score for ${seat.who}`} className="flex-1" />
                <span className={`font-code text-[12px] w-8 text-right ${seat.score < 0 ? "text-vermilion" : "text-ink"}`}>{seat.score > 0 ? "+" : ""}{seat.score}</span>
                <button onClick={() => rm(i)} aria-label="remove" className="text-ink-muted hover:text-vermilion">×</button>
              </div>
            </div>
          );
        })}
      </div>
      <button onClick={add} className="font-serif italic text-[13px] text-ink-muted hover:text-vermilion px-4 py-2 border-t border-rule w-full text-left">+ another seat</button>
      <div className="p-4 border-t border-rule bg-paper-deep">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Worst-off seat</span>
        <p className="mt-1 font-serif text-[15px] text-ink">
          <span className="font-medium">{worst.who}</span> · <span className="italic text-ink-muted">{worst.impact}</span> · <span className="text-vermilion font-medium" data-testid="veil-worst-score">{worst.score}</span>
        </p>
      </div>
    </div>
  );
}
