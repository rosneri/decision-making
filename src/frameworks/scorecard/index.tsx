"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, RemoveButton, AddButton, HeaderBand } from "@/components/ui";
import { meta, schema, sample, type Scorecard } from "./data";
export { meta, schema, sample };
export type { Scorecard };

export function View({ data, onUpdate }: { data: Scorecard; onUpdate?: (d: Scorecard) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Scorecard) => { setS(n); onUpdate?.(n); };
  const setOut = (i: number, v: string) => upd({ ...s, outcomes: s.outcomes.map((x, j) => j === i ? v : x) });
  const setComp = (i: number, v: string) => upd({ ...s, competencies: s.competencies.map((x, j) => j === i ? v : x) });
  const addOut = () => upd({ ...s, outcomes: [...s.outcomes, ""] });
  const addComp = () => upd({ ...s, competencies: [...s.competencies, ""] });
  const rmOut = (i: number) => upd({ ...s, outcomes: s.outcomes.filter((_, j) => j !== i) });
  const rmComp = (i: number) => upd({ ...s, competencies: s.competencies.filter((_, j) => j !== i) });

  return (
    <Card>
      <HeaderBand label="Mission">
        <InlineText
          value={s.mission}
          onChange={(v) => upd({ ...s, mission: v })}
          testId="scorecard-mission"
          italic
          size="lg"
          className="block w-full mt-1"
        />
      </HeaderBand>
      <div className="p-4 border-b border-rule">
        <MicroLabel>Outcomes · 12 months</MicroLabel>
        <ul className="mt-2 space-y-1">
          {s.outcomes.map((o, i) => (
            <li key={i} className="flex items-center gap-2 group border-b border-rule pb-1">
              <span className="font-code text-[11px] text-vermilion w-6">{i + 1}.</span>
              <InlineText value={o} onChange={(v) => setOut(i, v)} size="sm" />
              <RemoveButton onClick={() => rmOut(i)} ariaLabel="remove outcome" showOnHover />
            </li>
          ))}
        </ul>
        <AddButton onClick={addOut} className="mt-2">+ outcome</AddButton>
      </div>
      <div className="p-4">
        <MicroLabel>Competencies</MicroLabel>
        <div className="mt-2 flex gap-2 flex-wrap items-center">
          {s.competencies.map((c, i) => (
            <span key={i} className="border border-rule px-2 py-1 flex items-center gap-1 group">
              <InlineText
                value={c}
                onChange={(v) => setComp(i, v)}
                italic
                size="sm"
                fullWidth={false}
                className="w-28"
              />
              <RemoveButton onClick={() => rmComp(i)} ariaLabel="remove competency" showOnHover />
            </span>
          ))}
          <AddButton onClick={addComp}>+ add</AddButton>
        </div>
      </div>
    </Card>
  );
}
