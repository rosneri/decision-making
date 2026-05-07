"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, Range, AddButton, RemoveButton, HeaderBand } from "@/components/ui";
import { meta, schema, sample, type PreMortem } from "./data";
export { meta, schema, sample };
export type { PreMortem };

export function View({ data, onUpdate }: { data: PreMortem; onUpdate?: (d: PreMortem) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: PreMortem) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<PreMortem["risks"][number]>) =>
    upd({ ...s, risks: s.risks.map((r, j) => j === i ? { ...r, ...patch } : r) });
  const add = () => upd({ ...s, risks: [...s.risks, { cause: "", likelihood: 3, impact: 3 }] });
  const rm = (i: number) => upd({ ...s, risks: s.risks.filter((_, j) => j !== i) });

  return (
    <Card>
      <HeaderBand label="Scenario" accent={false}>
        <InlineText
          value={s.scenario}
          onChange={(v) => upd({ ...s, scenario: v })}
          italic
          size="lg"
          className="block w-full mt-1"
        />
      </HeaderBand>
      <div className="overflow-x-auto"><table className="w-full min-w-[420px]">
        <thead>
          <tr>
            <th className="text-left px-3 py-2 border-b border-rule"><MicroLabel>Postmortem cause</MicroLabel></th>
            <th className="text-center px-3 py-2 border-b border-rule"><MicroLabel>Lik</MicroLabel></th>
            <th className="text-center px-3 py-2 border-b border-rule"><MicroLabel>Imp</MicroLabel></th>
            <th className="text-center px-3 py-2 border-b border-rule w-16"><MicroLabel>!</MicroLabel></th>
            <th className="border-b border-rule" />
          </tr>
        </thead>
        <tbody>
          {s.risks.map((r, i) => {
            const score = r.likelihood * r.impact;
            const danger = score >= 12;
            return (
              <tr key={i} className="border-b border-rule" data-testid={`risk-row-${i}`}>
                <td className="px-3 py-2">
                  <InlineText
                    value={r.cause}
                    onChange={(v) => set(i, { cause: v })}
                    italic
                    size="sm"
                    className={danger ? "text-vermilion" : ""}
                  />
                </td>
                {(["likelihood", "impact"] as const).map((k) => (
                  <td key={k} className="px-3 py-2 text-center">
                    <Range
                      value={r[k]}
                      onChange={(v) => set(i, { [k]: v })}
                      min={1}
                      max={5}
                      testId={`risk-${i}-${k}`}
                      ariaLabel={`${k} for ${r.cause}`}
                      className="w-20"
                    />
                    <div className="font-code text-[11px] text-ink-muted">{r[k]}</div>
                  </td>
                ))}
                <td className="px-3 py-2 text-center">
                  {danger && <span className="text-vermilion font-medium" data-testid={`risk-${i}-danger`}>!</span>}
                </td>
                <td className="px-3 py-2 text-right">
                  <RemoveButton onClick={() => rm(i)} ariaLabel="remove" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table></div>
      <AddButton onClick={add} className="px-3 py-2 w-full text-left">+ another cause</AddButton>
    </Card>
  );
}
