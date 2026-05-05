"use client";
import { useState } from "react";
import { Card, InlineText, AddButton, RemoveButton } from "@/components/ui";
import { meta, schema, sample, type Rapid, ROLES, type Role, META } from "./data";
export { meta, schema, sample };
export type { Rapid };

export function View({ data, onUpdate }: { data: Rapid; onUpdate?: (d: Rapid) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Rapid) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<Rapid["assignments"][number]>) =>
    upd({ ...s, assignments: s.assignments.map((a, j) => j === i ? { ...a, ...patch } : a) });
  const add = () => upd({ ...s, assignments: [...s.assignments, { role: "input", who: "", note: "" }] });
  const rm = (i: number) => upd({ ...s, assignments: s.assignments.filter((_, j) => j !== i) });

  const decideCount = s.assignments.filter((a) => a.role === "decide").length;

  return (
    <Card>
      {decideCount !== 1 && (
        <div className="bg-vermilion/10 border-b border-vermilion px-4 py-2 font-code text-[11px] tracking-[0.18em] uppercase text-vermilion" data-testid="rapid-warning">
          warning · exactly one Decide required (currently {decideCount})
        </div>
      )}
      <ul className="divide-y divide-rule">
        {s.assignments.map((a, i) => {
          const isDecider = a.role === "decide";
          return (
            <li
              key={i}
              data-testid={`rapid-row-${i}`}
              className={`flex items-center gap-3 p-4 ${isDecider ? "bg-vermilion/5" : ""}`}
            >
              <div className={`w-10 h-10 grid place-items-center font-serif font-medium text-[20px] ${isDecider ? "bg-vermilion text-paper" : "bg-ink text-paper"}`}>
                {META[a.role].letter}
              </div>
              <div className="flex-1 min-w-0">
                <select
                  value={a.role}
                  onChange={(e) => set(i, { role: e.target.value as Role })}
                  className={`font-code text-[10px] tracking-[0.22em] uppercase font-medium bg-transparent border-none outline-none cursor-pointer ${isDecider ? "text-vermilion" : "text-ink-muted"}`}
                  aria-label={`role for row ${i}`}
                >
                  {ROLES.map((r) => <option key={r} value={r}>{META[r].word}</option>)}
                </select>
                <InlineText
                  value={a.who}
                  onChange={(v) => set(i, { who: v })}
                  placeholder="Who"
                  size="lg"
                  className="block w-full"
                />
              </div>
              <InlineText
                value={a.note}
                onChange={(v) => set(i, { note: v })}
                placeholder="role note"
                italic
                size="sm"
                fullWidth={false}
                className="hidden md:block w-40 text-ink-muted text-right border-b border-rule"
              />
              <RemoveButton onClick={() => rm(i)} ariaLabel="remove" />
            </li>
          );
        })}
      </ul>
      <AddButton onClick={add} className="px-4 py-2 border-t border-rule w-full text-left">+ add role</AddButton>
    </Card>
  );
}
