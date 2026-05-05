"use client";
import { useState } from "react";
import { z } from "zod";

export const meta = {
  id: "first_principles",
  name: "First Principles",
  category: "Mental models",
  blurb: "Strip an assumption down to what's actually true, then rebuild.",
} as const;

export const schema = z.object({
  framework: z.literal("first_principles"),
  category: z.string(),
  title: z.string(),
  assumption: z.string(),
  questions: z.array(z.object({ q: z.string(), answer: z.string() })).min(1).max(6),
  truths: z.array(z.string()).min(1).max(6),
  recommendation: z.string(),
});
export type FirstPrinciples = z.infer<typeof schema>;

export const sample: FirstPrinciples = {
  framework: "first_principles",
  category: meta.category,
  title: "Why does our onboarding take six weeks?",
  assumption: "New hires need 6 weeks of training",
  questions: [
    { q: "What's actually true?", answer: "Most ramp time is spent waiting on env access" },
    { q: "What can be measured?", answer: "Time-to-first-PR averages 18 days" },
    { q: "What if we removed it?", answer: "Self-serve onboarding cuts week one to a day" },
  ],
  truths: ["env access is the real bottleneck", "shadowing > slides", "context lives in code, not docs"],
  recommendation: "Replace the 6-week curriculum with a self-serve env + a buddy. Measure time-to-first-PR weekly.",
};

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
    <div className="border border-ink bg-paper">
      <div className="border-b border-rule p-5 bg-paper-deep">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Assumption</span>
        <input value={s.assumption} onChange={(e) => upd({ ...s, assumption: e.target.value })}
          className="block w-full mt-1 bg-transparent border-none outline-none font-serif italic text-[18px] text-ink" />
      </div>
      <div className="grid grid-cols-3 divide-x divide-rule">
        {s.questions.map((q, i) => (
          <div key={i} className="p-5 group relative">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-serif font-medium text-vermilion text-[20px]">↓{i + 1}.</span>
              <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Ask</span>
              <button onClick={() => rmQ(i)} aria-label="remove question"
                className="ml-auto opacity-0 group-hover:opacity-100 text-ink-muted hover:text-vermilion">×</button>
            </div>
            <input value={q.q} onChange={(e) => setQ(i, { q: e.target.value })}
              className="w-full bg-transparent border-none outline-none font-serif text-[15px] italic text-ink" />
            <textarea value={q.answer} onChange={(e) => setQ(i, { answer: e.target.value })}
              placeholder="…"
              className="w-full mt-2 bg-transparent border-t border-rule pt-2 resize-none outline-none font-serif text-[14px] text-ink-muted" rows={3} />
          </div>
        ))}
      </div>
      <button onClick={addQ} className="px-5 py-2 font-serif italic text-[13px] text-ink-muted hover:text-vermilion border-t border-rule w-full text-left">+ ask another</button>
      <div className="bg-vermilion text-paper p-5 border-t border-ink">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase font-medium">Irreducible truths →</span>
        <ul className="mt-2 space-y-1">
          {s.truths.map((t, i) => (
            <li key={i} className="flex items-center gap-2 group">
              <span className="font-code text-[11px] opacity-70">·{String(i + 1).padStart(2, "0")}</span>
              <input value={t} onChange={(e) => setTruth(i, e.target.value)}
                className="flex-1 bg-transparent border-none outline-none font-serif text-[15px] text-paper placeholder:text-paper/50" placeholder="A truth that can't be reduced." />
              <button onClick={() => rmTruth(i)} aria-label="remove truth"
                className="opacity-0 group-hover:opacity-100 text-paper/70 hover:text-paper">×</button>
            </li>
          ))}
        </ul>
        <button onClick={addTruth} className="mt-2 font-serif italic text-[13px] text-paper/80 hover:text-paper">+ add</button>
      </div>
    </div>
  );
}
