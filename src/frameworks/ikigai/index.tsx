"use client";
import { useState } from "react";
import { Card, MicroLabel, EditableList, InlineText } from "@/components/ui";
import { meta, schema, sample, type Ikigai, PILLARS, META } from "./data";
export { meta, schema, sample };
export type { Ikigai };

export function View({ data, onUpdate }: { data: Ikigai; onUpdate?: (d: Ikigai) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Ikigai) => { setS(n); onUpdate?.(n); };

  return (
    <Card>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-y divide-rule">
        {PILLARS.map((p) => (
          <div key={p} data-testid={`ikigai-pillar-${p}`} className="p-4">
            <MicroLabel>{META[p].label}</MicroLabel>
            <p className="font-serif italic text-[12px] text-ink-muted mt-0.5">{META[p].q}</p>
            <div className="mt-2">
              <EditableList
                items={s[p]}
                testIdPrefix={`ikigai-${p}`}
                onChangeItem={(i, v) => upd({ ...s, [p]: s[p].map((x, j) => j === i ? v : x) })}
                onRemove={(i) => upd({ ...s, [p]: s[p].filter((_, j) => j !== i) })}
                onAdd={() => upd({ ...s, [p]: [...s[p], ""] })}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-rule p-4 bg-vermilion/5">
        <MicroLabel accent bold>Ikigai · the overlap</MicroLabel>
        <InlineText
          value={s.ikigai}
          onChange={(v) => upd({ ...s, ikigai: v })}
          ariaLabel="ikigai"
          className="block w-full mt-2 font-serif text-[20px] text-vermilion font-medium"
        />
      </div>
    </Card>
  );
}
