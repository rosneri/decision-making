"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, HeaderBand } from "@/components/ui";
import { meta, schema, sample, type Ics, SECTIONS, type Section, META } from "./data";
export { meta, schema, sample };
export type { Ics };

export function View({ data, onUpdate }: { data: Ics; onUpdate?: (d: Ics) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Ics) => { setS(n); onUpdate?.(n); };
  const set = (k: Section, patch: Partial<Ics["sections"][Section]>) =>
    upd({ ...s, sections: { ...s.sections, [k]: { ...s.sections[k]!, ...patch } } });

  const filled = SECTIONS.filter((k) => s.sections[k]?.chief.trim()).length;

  return (
    <Card>
      <HeaderBand label="Incident commander · single point" align="center">
        <input
          value={s.commander}
          onChange={(e) => upd({ ...s, commander: e.target.value })}
          data-testid="ics-commander"
          className="block w-full mt-1 font-serif font-medium text-[20px] text-center bg-transparent border-none outline-none text-ink"
        />
      </HeaderBand>
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-rule">
        {SECTIONS.map((k) => {
          const sec = s.sections[k]!;
          const empty = !sec.chief.trim();
          return (
            <div key={k} data-testid={`ics-section-${k}`} className={`p-3 ${empty ? "bg-paper-deep" : ""}`}>
              <MicroLabel>{META[k].label}</MicroLabel>
              <input
                value={sec.chief}
                onChange={(e) => set(k, { chief: e.target.value })}
                placeholder="chief"
                className={`block w-full mt-1 font-serif font-medium text-[15px] bg-transparent border-b border-rule outline-none focus:border-vermilion ${empty ? "text-vermilion italic" : "text-ink"}`}
              />
              <InlineText
                value={sec.note}
                onChange={(v) => set(k, { note: v })}
                italic
                size="sm"
                className="block w-full mt-1 text-[12px] text-ink-muted"
              />
            </div>
          );
        })}
      </div>
      <div className="p-3 border-t border-rule font-code text-[11px] text-ink-muted text-center" data-testid="ics-completion">
        {filled} of {SECTIONS.length} sections staffed · span of control 1:{Math.max(1, filled)}
      </div>
    </Card>
  );
}
