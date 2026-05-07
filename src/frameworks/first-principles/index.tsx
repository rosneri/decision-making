"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, AddButton, RemoveButton } from "@/components/ui";
import { meta, schema, sample, type FirstPrinciples } from "./data";
export { meta, schema, sample };
export type { FirstPrinciples };

export function View({ data, onUpdate }: { data: FirstPrinciples; onUpdate?: (d: FirstPrinciples) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: FirstPrinciples) => { setS(n); onUpdate?.(n); };
  const setQ = (i: number, patch: Partial<FirstPrinciples["questions"][number]>) =>
    upd({ ...s, questions: s.questions.map((q, j) => j === i ? { ...q, ...patch } : q) });
  const setTruth = (i: number, v: string) =>
    upd({ ...s, truths: s.truths.map((t, j) => j === i ? v : t) });
  const addQ = () => upd({ ...s, questions: [...s.questions, { q: "Why?", answer: "" }] });
  const addTruth = () => upd({ ...s, truths: [...s.truths, ""] });
  const rmQ = (i: number) => upd({ ...s, questions: s.questions.filter((_, j) => j !== i) });
  const rmTruth = (i: number) => upd({ ...s, truths: s.truths.filter((_, j) => j !== i) });

  return (
    <Card>
      <div className="border-b border-rule p-5 bg-paper-deep">
        <MicroLabel>Assumption</MicroLabel>
        <InlineText
          value={s.assumption}
          onChange={(v) => upd({ ...s, assumption: v })}
          italic
          size="lg"
          className="block w-full mt-1 text-[18px]"
        />
      </div>
      <div className="grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-y-0 sm:divide-x divide-rule">
        {s.questions.map((q, i) => (
          <div key={i} className="p-5 group relative">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-serif font-medium text-vermilion text-[20px]">↓{i + 1}.</span>
              <MicroLabel>Ask</MicroLabel>
              <RemoveButton onClick={() => rmQ(i)} ariaLabel="remove question" showOnHover className="ml-auto" />
            </div>
            <InlineText value={q.q} onChange={(v) => setQ(i, { q: v })} italic />
            <textarea
              value={q.answer}
              onChange={(e) => setQ(i, { answer: e.target.value })}
              placeholder="…"
              className="w-full mt-2 bg-transparent border-t border-rule pt-2 resize-none outline-none font-serif text-[14px] text-ink-muted"
              rows={3}
            />
          </div>
        ))}
      </div>
      <AddButton onClick={addQ} className="px-5 py-2 border-t border-rule w-full text-left">+ ask another</AddButton>
      <div className="bg-vermilion text-paper p-5 border-t border-ink">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase font-medium">Irreducible truths →</span>
        <ul className="mt-2 space-y-1">
          {s.truths.map((t, i) => (
            <li key={i} className="flex items-center gap-2 group">
              <span className="font-code text-[11px] opacity-70">·{String(i + 1).padStart(2, "0")}</span>
              <input
                value={t}
                onChange={(e) => setTruth(i, e.target.value)}
                className="flex-1 bg-transparent border-none outline-none font-serif text-[15px] text-paper placeholder:text-paper/50"
                placeholder="A truth that can't be reduced."
              />
              <button
                onClick={() => rmTruth(i)}
                aria-label="remove truth"
                className="opacity-0 group-hover:opacity-100 text-paper/70 hover:text-paper"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
        <button onClick={addTruth} className="mt-2 font-serif italic text-[13px] text-paper/80 hover:text-paper">+ add</button>
      </div>
    </Card>
  );
}
