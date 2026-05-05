"use client";
import { useState } from "react";
import { z } from "zod";

const ROLES = ["recommend", "agree", "perform", "input", "decide"] as const;
type Role = (typeof ROLES)[number];

export const meta = {
  id: "rapid",
  name: "RAPID",
  category: "Group & organizational",
  blurb: "Recommend, Agree, Perform, Input, Decide — assign exactly one Decider.",
} as const;

export const schema = z.object({
  framework: z.literal("rapid"),
  category: z.string(),
  title: z.string(),
  assignments: z.array(z.object({
    role: z.enum(ROLES),
    who: z.string(),
    note: z.string(),
  })).min(5).max(20),
  recommendation: z.string(),
});
export type Rapid = z.infer<typeof schema>;

export const sample: Rapid = {
  framework: "rapid",
  category: meta.category,
  title: "Who actually decides on the pricing change?",
  assignments: [
    { role: "recommend", who: "Priya · PM", note: "drafts the proposal" },
    { role: "agree", who: "Legal", note: "must say yes" },
    { role: "perform", who: "Eng team", note: "ships it" },
    { role: "input", who: "Sales · CS", note: "consulted" },
    { role: "decide", who: "Maya · VP", note: "single accountable" },
  ],
  recommendation: "Maya owns the call. Get Legal's sign-off before announcing; Sales/CS provide context, not vetoes.",
};

const META: Record<Role, { letter: string; word: string }> = {
  recommend: { letter: "R", word: "Recommend" },
  agree: { letter: "A", word: "Agree" },
  perform: { letter: "P", word: "Perform" },
  input: { letter: "I", word: "Input" },
  decide: { letter: "D", word: "Decide" },
};

export function View({ data, onUpdate }: { data: Rapid; onUpdate?: (d: Rapid) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Rapid) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<Rapid["assignments"][number]>) =>
    upd({ ...s, assignments: s.assignments.map((a, j) => j === i ? { ...a, ...patch } : a) });
  const add = () => upd({ ...s, assignments: [...s.assignments, { role: "input", who: "", note: "" }] });
  const rm = (i: number) => upd({ ...s, assignments: s.assignments.filter((_, j) => j !== i) });

  const decideCount = s.assignments.filter((a) => a.role === "decide").length;

  return (
    <div className="border border-ink bg-paper">
      {decideCount !== 1 && (
        <div className="bg-vermilion/10 border-b border-vermilion px-4 py-2 font-code text-[11px] tracking-[0.18em] uppercase text-vermilion" data-testid="rapid-warning">
          warning · exactly one Decide required (currently {decideCount})
        </div>
      )}
      <ul className="divide-y divide-rule">
        {s.assignments.map((a, i) => {
          const isDecider = a.role === "decide";
          return (
            <li key={i} data-testid={`rapid-row-${i}`}
              className={`flex items-center gap-3 p-4 ${isDecider ? "bg-vermilion/5" : ""}`}>
              <div className={`w-10 h-10 grid place-items-center font-serif font-medium text-[20px] ${isDecider ? "bg-vermilion text-paper" : "bg-ink text-paper"}`}>
                {META[a.role].letter}
              </div>
              <div className="flex-1 min-w-0">
                <select value={a.role} onChange={(e) => set(i, { role: e.target.value as Role })}
                  className={`font-code text-[10px] tracking-[0.22em] uppercase font-medium bg-transparent border-none outline-none cursor-pointer ${isDecider ? "text-vermilion" : "text-ink-muted"}`}
                  aria-label={`role for row ${i}`}>
                  {ROLES.map((r) => <option key={r} value={r}>{META[r].word}</option>)}
                </select>
                <input value={a.who} onChange={(e) => set(i, { who: e.target.value })}
                  placeholder="Who"
                  className="block w-full bg-transparent border-none outline-none font-serif text-[16px] text-ink" />
              </div>
              <input value={a.note} onChange={(e) => set(i, { note: e.target.value })}
                placeholder="role note"
                className="hidden md:block w-40 font-serif italic text-[13px] text-ink-muted bg-transparent border-b border-rule outline-none text-right" />
              <button onClick={() => rm(i)} aria-label="remove" className="text-ink-muted hover:text-vermilion">×</button>
            </li>
          );
        })}
      </ul>
      <button onClick={add} className="font-serif italic text-[13px] text-ink-muted hover:text-vermilion px-4 py-2 border-t border-rule w-full text-left">+ add role</button>
    </div>
  );
}
