"use client";
import { useState } from "react";
import { Card, MicroLabel, PhaseTabs } from "@/components/ui";
import { meta, schema, sample, type DesignThinking, STAGES, META } from "./data";
export { meta, schema, sample };
export type { DesignThinking };

export function View({ data, onUpdate }: { data: DesignThinking; onUpdate?: (d: DesignThinking) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: DesignThinking) => { setS(n); onUpdate?.(n); };

  return (
    <Card>
      <PhaseTabs
        active={s.current}
        onSelect={(k) => upd({ ...s, current: k })}
        items={STAGES.map((k, i) => ({
          key: k,
          label: `0${i + 1}`,
          sub: META[k].label,
          testId: `dt-tab-${k}`,
        }))}
      />
      <div className="p-4 border-t border-rule">
        <MicroLabel>{META[s.current].label} notes</MicroLabel>
        <textarea
          value={s.notes[s.current] ?? ""}
          onChange={(e) => upd({ ...s, notes: { ...s.notes, [s.current]: e.target.value } })}
          data-testid="dt-current-notes"
          className="block w-full mt-1 font-serif text-[14px] bg-transparent border-t border-rule pt-2 outline-none focus:border-vermilion resize-none text-ink"
          rows={4}
        />
      </div>
    </Card>
  );
}
