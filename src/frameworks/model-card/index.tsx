"use client";
import { useState } from "react";
import { meta, schema, sample, type ModelCard, FIELDS } from "./data";
export { meta, schema, sample };
export type { ModelCard };

export function View({ data, onUpdate }: { data: ModelCard; onUpdate?: (d: ModelCard) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: ModelCard) => { setS(n); onUpdate?.(n); };
  const set = (k: keyof ModelCard["fields"], v: string) =>
    upd({ ...s, fields: { ...s.fields, [k]: v } });

  return (
    <div className="border border-ink bg-paper">
      <div className="p-4 border-b border-vermilion bg-vermilion/5">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-vermilion font-medium">Model</span>
        <input value={s.modelName} onChange={(e) => upd({ ...s, modelName: e.target.value })}
          data-testid="mc-model-name"
          className="block w-full mt-1 font-serif font-medium text-[20px] bg-transparent border-none outline-none text-ink" />
        <input value={s.modelMeta} onChange={(e) => upd({ ...s, modelMeta: e.target.value })}
          className="block w-full mt-1 font-serif italic text-[13px] text-ink-muted bg-transparent border-none outline-none" />
      </div>
      <ul className="divide-y divide-rule">
        {FIELDS.map((f) => (
          <li key={f.k} data-testid={`mc-${f.k}`} className={`p-3 ${f.accent ? "bg-vermilion/5" : ""}`}>
            <span className={`font-code text-[10px] tracking-[0.22em] uppercase font-medium ${f.accent ? "text-vermilion" : "text-ink-muted"}`}>{f.label}</span>
            <textarea value={s.fields[f.k]} onChange={(e) => set(f.k, e.target.value)}
              className={`block w-full mt-1 font-serif text-[14px] bg-transparent border-l-2 border-rule pl-3 outline-none focus:border-vermilion resize-none ${f.accent ? "text-vermilion" : "text-ink"}`}
              rows={2} />
          </li>
        ))}
      </ul>
    </div>
  );
}
