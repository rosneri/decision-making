"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, InlineNumber, AddButton, RemoveButton, DotMeter } from "@/components/ui";
import { meta, schema, sample, type Ria } from "./data";
export { meta, schema, sample };
export type { Ria };

export function View({ data, onUpdate }: { data: Ria; onUpdate?: (d: Ria) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Ria) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<Ria["stakeholders"][number]>) =>
    upd({ ...s, stakeholders: s.stakeholders.map((x, j) => j === i ? { ...x, ...patch } : x) });
  const add = () => upd({ ...s, stakeholders: [...s.stakeholders, { name: "stakeholder", netImpact: 0, power: 3 }] });
  const rm = (i: number) => upd({ ...s, stakeholders: s.stakeholders.filter((_, j) => j !== i) });

  const sum = s.stakeholders.reduce((a, x) => a + x.netImpact, 0);
  const need = s.stakeholders.filter((x) => x.netImpact < 0 && x.power >= 3);
  const max = Math.max(...s.stakeholders.map((x) => Math.abs(x.netImpact)), 1);

  return (
    <Card>
      <div className="overflow-x-auto"><ul className="divide-y divide-rule min-w-[480px]">
        {s.stakeholders.map((x, i) => {
          const concern = x.netImpact < 0 && x.power >= 3;
          return (
            <li
              key={i}
              data-testid={`ria-row-${i}`}
              className={`p-3 grid grid-cols-[1fr_70px_2fr_70px_30px] gap-3 items-center ${concern ? "bg-vermilion/5" : ""}`}
            >
              <InlineText
                value={x.name}
                onChange={(v) => set(i, { name: v })}
                italic
                size="sm"
                className={concern ? "text-vermilion" : ""}
              />
              <DotMeter
                value={x.power}
                onChange={(n) => set(i, { power: n })}
                variant="bar"
                accent={concern}
                ariaLabel={`power ${x.name}`}
              />
              <div className="relative h-6 border border-rule">
                <div className="absolute inset-y-0 left-1/2 border-l border-dashed border-rule" />
                <div
                  className={`absolute inset-y-0 ${x.netImpact < 0 ? "bg-vermilion" : "bg-ink"}`}
                  style={{
                    left: x.netImpact < 0 ? `${50 - (Math.abs(x.netImpact) / max) * 50}%` : "50%",
                    width: `${(Math.abs(x.netImpact) / max) * 50}%`,
                  }}
                />
              </div>
              <InlineNumber
                value={x.netImpact}
                onChange={(v) => set(i, { netImpact: v })}
                size="sm"
                width="w-16"
                accent={x.netImpact < 0}
                testId={`ria-impact-${i}`}
                className="text-right border-b border-rule"
              />
              <RemoveButton onClick={() => rm(i)} ariaLabel="remove" />
            </li>
          );
        })}
      </ul></div>
      <AddButton onClick={add} className="px-3 py-2 border-t border-rule w-full text-left">+ stakeholder</AddButton>
      <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-rule">
        <div className="p-4">
          <MicroLabel>Net benefit</MicroLabel>
          <div className={`font-serif font-medium text-[24px] mt-1 ${sum >= 0 ? "text-ink" : "text-vermilion"}`} data-testid="ria-net">
            {sum >= 0 ? "+" : ""}{sum}
          </div>
        </div>
        <div className="p-4 bg-vermilion/5 border-l border-vermilion">
          <MicroLabel accent bold>Needs mitigation</MicroLabel>
          <div className="font-serif text-[14px] text-vermilion mt-1" data-testid="ria-mitigate">
            {need.length === 0 ? "—" : need.map((x) => x.name).join(" · ")}
          </div>
        </div>
      </div>
    </Card>
  );
}
