"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, InlineNumber, AddButton, RemoveButton } from "@/components/ui";
import { meta, schema, sample, type Qaly } from "./data";
export { meta, schema, sample };
export type { Qaly };

export function View({ data, onUpdate }: { data: Qaly; onUpdate?: (d: Qaly) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Qaly) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<Qaly["interventions"][number]>) =>
    upd({ ...s, interventions: s.interventions.map((x, j) => j === i ? { ...x, ...patch } : x) });
  const add = () => upd({ ...s, interventions: [...s.interventions, { name: "intervention", cost: 1000, qalyGained: 1 }] });
  const rm = (i: number) => upd({ ...s, interventions: s.interventions.filter((_, j) => j !== i) });

  const scored = s.interventions.map((x, i) => ({
    ...x,
    i,
    perQaly: x.qalyGained > 0 ? x.cost / x.qalyGained : Infinity,
  }));
  const fund = scored.filter((x) => x.perQaly < s.wtpPerQaly);

  const head = "px-3 py-2 border-b border-rule";

  return (
    <Card>
      <div className="p-4 border-b border-rule">
        <label>
          <MicroLabel>WTP threshold ($/QALY)</MicroLabel>
          <input
            type="number"
            min={0}
            value={s.wtpPerQaly}
            onChange={(e) => upd({ ...s, wtpPerQaly: Math.max(0, Number(e.target.value) || 0) })}
            data-testid="qaly-wtp"
            className="block mt-1 font-serif font-medium text-[24px] bg-transparent border-b border-rule outline-none text-ink w-48"
          />
        </label>
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th className={`${head} text-left`}><MicroLabel>Intervention</MicroLabel></th>
            <th className={`${head} text-center`}><MicroLabel>Cost</MicroLabel></th>
            <th className={`${head} text-center`}><MicroLabel>QALY</MicroLabel></th>
            <th className={`${head} text-right`}><MicroLabel>$/QALY</MicroLabel></th>
            <th className="border-b border-rule" />
          </tr>
        </thead>
        <tbody>
          {scored.map((x) => {
            const isFund = x.perQaly < s.wtpPerQaly;
            return (
              <tr key={x.i} className="border-b border-rule" data-testid={`qaly-row-${x.i}`}>
                <td className="px-3 py-2">
                  <InlineText
                    value={x.name}
                    onChange={(v) => set(x.i, { name: v })}
                    italic
                    size="sm"
                    fullWidth={false}
                    className={isFund ? "text-vermilion" : ""}
                  />
                  {isFund && <span className="ml-2 font-code text-[10px] tracking-[0.18em] uppercase text-vermilion">★ fund</span>}
                </td>
                <td className="px-3 py-2 text-center">
                  <InlineNumber
                    value={x.cost}
                    onChange={(v) => set(x.i, { cost: Math.max(0, v) })}
                    min={0}
                    size="sm"
                    width="w-20"
                    className="border-b border-rule"
                  />
                </td>
                <td className="px-3 py-2 text-center">
                  <InlineNumber
                    value={x.qalyGained}
                    onChange={(v) => set(x.i, { qalyGained: Math.max(0, v) })}
                    min={0}
                    step={0.1}
                    size="sm"
                    width="w-16"
                    className="border-b border-rule"
                  />
                </td>
                <td
                  className={`px-3 py-2 text-right font-code text-[13px] font-medium ${isFund ? "text-vermilion" : "text-ink"}`}
                  data-testid={`qaly-perqaly-${x.i}`}
                >
                  ${isFinite(x.perQaly) ? Math.round(x.perQaly).toLocaleString() : "∞"}
                </td>
                <td className="px-3 py-2 text-right">
                  <RemoveButton onClick={() => rm(x.i)} ariaLabel="remove" />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <AddButton onClick={add} className="px-3 py-2 w-full text-left border-t border-rule">+ intervention</AddButton>
      <div className="p-4 border-t border-rule bg-paper-deep">
        <MicroLabel>Funded</MicroLabel>
        <span className="ml-2 font-serif text-[14px] text-vermilion font-medium" data-testid="qaly-funded-count">{fund.length} of {s.interventions.length}</span>
      </div>
    </Card>
  );
}
