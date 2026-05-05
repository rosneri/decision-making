"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, AddButton, RemoveButton } from "@/components/ui";
import { meta, schema, sample, type Ach, cycle } from "./data";
export { meta, schema, sample };
export type { Ach };

export function View({ data, onUpdate }: { data: Ach; onUpdate?: (d: Ach) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Ach) => { setS(n); onUpdate?.(n); };
  const setHyp = (i: number, v: string) =>
    upd({ ...s, hypotheses: s.hypotheses.map((h, j) => j === i ? v : h) });
  const setEv = (i: number, patch: Partial<Ach["evidence"][number]>) =>
    upd({ ...s, evidence: s.evidence.map((e, j) => j === i ? { ...e, ...patch } : e) });
  const cycleCell = (i: number, j: number) => {
    const ev = s.evidence[i]!;
    const next = [...ev.consistency];
    next[j] = cycle(next[j] ?? "?");
    setEv(i, { consistency: next });
  };
  const addEv = () =>
    upd({ ...s, evidence: [...s.evidence, { text: "new evidence", consistency: s.hypotheses.map(() => "?") }] });
  const rmEv = (i: number) => upd({ ...s, evidence: s.evidence.filter((_, j) => j !== i) });

  const inconsist = s.hypotheses.map((_, j) =>
    s.evidence.reduce((a, e) => a + (e.consistency[j] === "-" ? 1 : 0), 0)
  );
  const minIdx = inconsist.indexOf(Math.min(...inconsist));

  return (
    <Card className="overflow-x-auto">
      <table className="w-full" data-testid="ach-table">
        <thead>
          <tr>
            <th className="text-left px-3 py-2 border-b border-rule"><MicroLabel>Evidence \ Hypothesis</MicroLabel></th>
            {s.hypotheses.map((h, j) => (
              <th key={j} className="px-2 py-2 border-b border-rule">
                <InlineText
                  value={h}
                  onChange={(v) => setHyp(j, v)}
                  italic
                  size="sm"
                  fullWidth={false}
                  className={`text-center w-28 ${j === minIdx ? "text-vermilion font-medium" : ""}`}
                />
              </th>
            ))}
            <th className="border-b border-rule" />
          </tr>
        </thead>
        <tbody>
          {s.evidence.map((e, i) => (
            <tr key={i} className="border-b border-rule">
              <td className="px-3 py-1">
                <InlineText value={e.text} onChange={(v) => setEv(i, { text: v })} italic size="sm" />
              </td>
              {s.hypotheses.map((_, j) => {
                const v = e.consistency[j] ?? "?";
                return (
                  <td key={j} className="text-center p-1">
                    <button onClick={() => cycleCell(i, j)}
                      data-testid={`ach-cell-${i}-${j}`}
                      aria-label={`evidence ${i + 1} hyp ${j + 1}: ${v}`}
                      className={`w-8 h-8 border font-code font-medium ${v === "-" ? "bg-paper-deep border-rule text-ink-muted" : v === "+" ? `border-ink ${j === minIdx ? "text-vermilion" : "text-ink"}` : "border-rule text-ink-muted"}`}>
                      {v}
                    </button>
                  </td>
                );
              })}
              <td className="px-2">
                <RemoveButton onClick={() => rmEv(i)} ariaLabel="remove" />
              </td>
            </tr>
          ))}
          <tr>
            <td className="px-3 py-2"><MicroLabel accent bold>Inconsistencies</MicroLabel></td>
            {inconsist.map((n, j) => (
              <td key={j} className="text-center font-code text-[14px] font-medium" data-testid={`ach-inconsist-${j}`}>
                <span className={j === minIdx ? "text-vermilion" : "text-ink"}>{n}</span>
              </td>
            ))}
            <td />
          </tr>
        </tbody>
      </table>
      <AddButton onClick={addEv} className="px-3 py-2 border-t border-rule w-full text-left">+ add evidence</AddButton>
    </Card>
  );
}
