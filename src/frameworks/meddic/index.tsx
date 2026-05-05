"use client";
import { useState } from "react";
import { z } from "zod";

const KEYS = ["metrics", "economic_buyer", "decision_criteria", "decision_process", "identify_pain", "champion"] as const;
type Key = (typeof KEYS)[number];

export const meta = {
  id: "meddic",
  name: "MEDDIC",
  category: "Sales & marketing",
  blurb: "Six qualifiers. The empty box is your real risk.",
} as const;

export const schema = z.object({
  framework: z.literal("meddic"),
  category: z.string(),
  title: z.string(),
  cells: z.object({
    metrics: z.object({ answer: z.string(), confirmed: z.boolean() }),
    economic_buyer: z.object({ answer: z.string(), confirmed: z.boolean() }),
    decision_criteria: z.object({ answer: z.string(), confirmed: z.boolean() }),
    decision_process: z.object({ answer: z.string(), confirmed: z.boolean() }),
    identify_pain: z.object({ answer: z.string(), confirmed: z.boolean() }),
    champion: z.object({ answer: z.string(), confirmed: z.boolean() }),
  }),
  recommendation: z.string(),
});
export type Meddic = z.infer<typeof schema>;

export const sample: Meddic = {
  framework: "meddic",
  category: meta.category,
  title: "Will the Acme deal close this quarter?",
  cells: {
    metrics: { answer: "save 2 FTE / quarter", confirmed: true },
    economic_buyer: { answer: "VP Eng — met once", confirmed: true },
    decision_criteria: { answer: "uptime 99.95", confirmed: true },
    decision_process: { answer: "Q3 review", confirmed: false },
    identify_pain: { answer: "incidents costing $200k/mo", confirmed: true },
    champion: { answer: "Priya · staff eng", confirmed: true },
  },
  recommendation: "Decision process is the gap. Get a written timeline before forecasting close-quarter.",
};

const META: Record<Key, { letter: string; word: string }> = {
  metrics: { letter: "M", word: "Metrics" },
  economic_buyer: { letter: "E", word: "Econ. Buyer" },
  decision_criteria: { letter: "D", word: "Decision Criteria" },
  decision_process: { letter: "D", word: "Decision Process" },
  identify_pain: { letter: "I", word: "Identify Pain" },
  champion: { letter: "C", word: "Champion" },
};

export function View({ data, onUpdate }: { data: Meddic; onUpdate?: (d: Meddic) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Meddic) => { setS(n); onUpdate?.(n); };
  const set = (k: Key, patch: Partial<Meddic["cells"][Key]>) =>
    upd({ ...s, cells: { ...s.cells, [k]: { ...s.cells[k]!, ...patch } } });

  const open = KEYS.filter((k) => !s.cells[k]!.confirmed);

  return (
    <div className="border border-ink bg-paper">
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-rule">
        {KEYS.map((k) => {
          const c = s.cells[k]!;
          const danger = !c.confirmed;
          return (
            <div key={k} data-testid={`meddic-${k}`}
              className={`p-4 border-b border-rule flex items-center gap-3 ${danger ? "bg-vermilion/5" : ""}`}>
              <div className={`w-9 h-9 grid place-items-center font-serif font-medium text-[18px] text-paper ${danger ? "bg-vermilion" : "bg-ink"}`}>
                {META[k].letter}
              </div>
              <div className="flex-1 min-w-0">
                <span className={`font-code text-[10px] tracking-[0.22em] uppercase font-medium ${danger ? "text-vermilion" : "text-ink-muted"}`}>{META[k].word}</span>
                <input value={c.answer} onChange={(e) => set(k, { answer: e.target.value })}
                  placeholder="—"
                  className="block w-full mt-0.5 font-serif text-[14px] bg-transparent border-none outline-none text-ink" />
              </div>
              <button onClick={() => set(k, { confirmed: !c.confirmed })}
                data-testid={`meddic-${k}-confirm`}
                aria-pressed={c.confirmed}
                aria-label={`toggle ${k} confirmed`}
                className={`font-serif font-bold text-[18px] ${c.confirmed ? "text-ink" : "text-vermilion"}`}>
                {c.confirmed ? "✓" : "?"}
              </button>
            </div>
          );
        })}
      </div>
      <div className="p-4 border-t border-rule bg-paper-deep">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Open</span>
        <span className="ml-2 font-serif text-[14px] text-vermilion font-medium" data-testid="meddic-open">
          {open.length === 0 ? "all confirmed" : open.map((k) => META[k].word).join(" · ")}
        </span>
      </div>
    </div>
  );
}
