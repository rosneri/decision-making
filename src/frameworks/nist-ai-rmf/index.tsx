"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, EditableList } from "@/components/ui";
import { meta, schema, sample, type NistAiRmf, FUNCTIONS, META } from "./data";
export { meta, schema, sample };
export type { NistAiRmf };

const RISKS = ["low", "medium", "high"] as const;

export function View({ data, onUpdate }: { data: NistAiRmf; onUpdate?: (d: NistAiRmf) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: NistAiRmf) => { setS(n); onUpdate?.(n); };

  return (
    <Card>
      <div className="border-b border-rule p-4 flex items-center justify-between gap-4">
        <div className="flex-1">
          <MicroLabel>System</MicroLabel>
          <InlineText
            value={s.system}
            onChange={(v) => upd({ ...s, system: v })}
            className="block w-full mt-1 font-medium text-[16px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <MicroLabel>Risk</MicroLabel>
          {RISKS.map((r) => (
            <button
              key={r}
              data-testid={`rmf-risk-${r}`}
              onClick={() => upd({ ...s, riskLevel: r })}
              className={`font-code text-[10px] tracking-[0.22em] uppercase px-2 py-1 border ${s.riskLevel === r ? "border-vermilion text-vermilion bg-vermilion/5" : "border-rule text-ink-muted hover:text-vermilion"}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-y divide-rule">
        {FUNCTIONS.map((f) => (
          <div key={f} data-testid={`rmf-fn-${f}`} className="p-4">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-serif font-medium text-[20px] text-vermilion">{f}</span>
              <span className="font-serif italic text-[12px] text-ink-muted">{META[f].note}</span>
            </div>
            <EditableList
              items={s.functions[f]}
              testIdPrefix={`rmf-${f.toLowerCase()}`}
              onChangeItem={(i, v) => upd({ ...s, functions: { ...s.functions, [f]: s.functions[f].map((x, j) => j === i ? v : x) } })}
              onRemove={(i) => upd({ ...s, functions: { ...s.functions, [f]: s.functions[f].filter((_, j) => j !== i) } })}
              onAdd={() => upd({ ...s, functions: { ...s.functions, [f]: [...s.functions[f], ""] } })}
              placeholder="control"
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
