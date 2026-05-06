"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText } from "@/components/ui";
import { meta, schema, sample, findNash, type Nash } from "./data";
export { meta, schema, sample };
export type { Nash };

export function View({ data, onUpdate }: { data: Nash; onUpdate?: (d: Nash) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Nash) => { setS(n); onUpdate?.(n); };
  const eqs = findNash(s);
  const isEq = (r: number, c: number) => eqs.some(([er, ec]) => er === r && ec === c);

  const setPayoff = (r: number, c: number, idx: 0 | 1, v: number) => {
    const next = s.payoffs.map((row, ri) => row.map((cell, ci) => {
      if (ri === r && ci === c) {
        const updated: [number, number] = [...cell] as [number, number];
        updated[idx] = v;
        return updated;
      }
      return cell;
    })) as Nash["payoffs"];
    upd({ ...s, payoffs: next });
  };

  return (
    <Card>
      <div className="border-b border-rule p-4 grid grid-cols-2 gap-4">
        <div>
          <MicroLabel>Row player</MicroLabel>
          <InlineText value={s.rowPlayer} onChange={(v) => upd({ ...s, rowPlayer: v })} className="block w-full mt-1 font-medium" />
        </div>
        <div>
          <MicroLabel>Column player</MicroLabel>
          <InlineText value={s.colPlayer} onChange={(v) => upd({ ...s, colPlayer: v })} className="block w-full mt-1 font-medium" />
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th />
            {[0, 1].map((c) => (
              <th key={c} className="p-2 border-b border-rule">
                <MicroLabel>{s.colPlayer}:</MicroLabel>
                <InlineText
                  value={s.colStrategies[c as 0 | 1]}
                  onChange={(v) => upd({ ...s, colStrategies: s.colStrategies.map((x, j) => j === c ? v : x) as [string, string] })}
                  className="font-medium"
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[0, 1].map((r) => (
            <tr key={r}>
              <th className="p-2 border-r border-rule text-left">
                <MicroLabel>{s.rowPlayer}:</MicroLabel>
                <InlineText
                  value={s.rowStrategies[r as 0 | 1]}
                  onChange={(v) => upd({ ...s, rowStrategies: s.rowStrategies.map((x, j) => j === r ? v : x) as [string, string] })}
                  className="font-medium"
                />
              </th>
              {[0, 1].map((c) => {
                const eq = isEq(r, c);
                return (
                  <td
                    key={c}
                    data-testid={`nash-cell-${r}-${c}`}
                    className={`p-3 border border-rule text-center ${eq ? "bg-vermilion/10 border-vermilion" : ""}`}
                  >
                    <div className="flex items-center justify-center gap-2 font-code">
                      <input
                        type="number"
                        value={s.payoffs[r as 0 | 1]![c as 0 | 1]![0]}
                        onChange={(e) => setPayoff(r, c, 0, Number(e.target.value) || 0)}
                        data-testid={`nash-row-payoff-${r}-${c}`}
                        className="w-[44px] text-center bg-transparent border-b border-rule outline-none"
                      />
                      <span className="text-ink-muted">,</span>
                      <input
                        type="number"
                        value={s.payoffs[r as 0 | 1]![c as 0 | 1]![1]}
                        onChange={(e) => setPayoff(r, c, 1, Number(e.target.value) || 0)}
                        data-testid={`nash-col-payoff-${r}-${c}`}
                        className="w-[44px] text-center bg-transparent border-b border-rule outline-none"
                      />
                    </div>
                    {eq && (
                      <div className="mt-1 font-code text-[9px] tracking-[0.22em] uppercase text-vermilion" data-testid={`nash-eq-${r}-${c}`}>
                        Nash
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-4 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted border-t border-rule" data-testid="nash-count">
        {eqs.length === 0 ? "No pure-strategy equilibrium (mixed only)" : `${eqs.length} pure-strategy equilibrium${eqs.length > 1 ? "(s)" : ""}`}
      </div>
    </Card>
  );
}
