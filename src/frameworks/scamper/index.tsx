"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, EditableList } from "@/components/ui";
import { meta, schema, sample, type Scamper, PROMPTS, PROMPT_META } from "./data";
export { meta, schema, sample };
export type { Scamper };

export function View({ data, onUpdate }: { data: Scamper; onUpdate?: (d: Scamper) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Scamper) => { setS(n); onUpdate?.(n); };

  return (
    <Card>
      <div className="border-b border-rule p-4">
        <MicroLabel>Subject</MicroLabel>
        <InlineText value={s.subject} onChange={(v) => upd({ ...s, subject: v })} className="block w-full mt-1 font-medium text-[16px]" />
      </div>
      <div>
        {PROMPTS.map((p) => (
          <div key={p} data-testid={`scamper-${p}`} className="border-b border-rule p-4 grid grid-cols-[60px_1fr] gap-4">
            <div>
              <span className="font-serif font-medium text-[36px] text-vermilion">{p}</span>
            </div>
            <div>
              <MicroLabel bold>{PROMPT_META[p].word}</MicroLabel>
              <p className="font-serif italic text-[12px] text-ink-muted mt-0.5">{PROMPT_META[p].q}</p>
              <div className="mt-2">
                <EditableList
                  items={s.ideas[p]}
                  testIdPrefix={`scamper-${p}-idea`}
                  onChangeItem={(i, v) => upd({ ...s, ideas: { ...s.ideas, [p]: s.ideas[p].map((x, j) => j === i ? v : x) } })}
                  onRemove={(i) => upd({ ...s, ideas: { ...s.ideas, [p]: s.ideas[p].filter((_, j) => j !== i) } })}
                  onAdd={() => upd({ ...s, ideas: { ...s.ideas, [p]: [...s.ideas[p], ""] } })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
