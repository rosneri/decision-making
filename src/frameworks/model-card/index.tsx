"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, HeaderBand } from "@/components/ui";
import { meta, schema, sample, type ModelCard, FIELDS } from "./data";
export { meta, schema, sample };
export type { ModelCard };

export function View({ data, onUpdate }: { data: ModelCard; onUpdate?: (d: ModelCard) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: ModelCard) => { setS(n); onUpdate?.(n); };
  const set = (k: keyof ModelCard["fields"], v: string) =>
    upd({ ...s, fields: { ...s.fields, [k]: v } });

  return (
    <Card>
      <HeaderBand label="Model">
        <InlineText
          value={s.modelName}
          onChange={(v) => upd({ ...s, modelName: v })}
          testId="mc-model-name"
          className="block w-full mt-1 font-medium text-[20px]"
        />
        <InlineText
          value={s.modelMeta}
          onChange={(v) => upd({ ...s, modelMeta: v })}
          italic
          size="sm"
          className="block w-full mt-1 text-ink-muted"
        />
      </HeaderBand>
      <ul className="divide-y divide-rule">
        {FIELDS.map((f) => (
          <li key={f.k} data-testid={`mc-${f.k}`} className={`p-3 ${f.accent ? "bg-vermilion/5" : ""}`}>
            <MicroLabel accent={f.accent} bold>{f.label}</MicroLabel>
            <textarea
              value={s.fields[f.k]}
              onChange={(e) => set(f.k, e.target.value)}
              className={`block w-full mt-1 font-serif text-[14px] bg-transparent border-l-2 border-rule pl-3 outline-none focus:border-vermilion resize-none ${f.accent ? "text-vermilion" : "text-ink"}`}
              rows={2}
            />
          </li>
        ))}
      </ul>
    </Card>
  );
}
