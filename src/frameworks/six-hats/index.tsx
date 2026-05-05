"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, AddButton, RemoveButton, PhaseTabs } from "@/components/ui";
import { meta, schema, sample, type SixHats, HATS, type Hat, HAT_META } from "./data";
export { meta, schema, sample };
export type { SixHats };

export function View({ data, onUpdate }: { data: SixHats; onUpdate?: (d: SixHats) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: SixHats) => { setS(n); onUpdate?.(n); };
  const list = (h: Hat) => s.hats[h] ?? [];
  const setItem = (h: Hat, i: number, v: string) =>
    upd({ ...s, hats: { ...s.hats, [h]: list(h).map((x, j) => j === i ? v : x) } });
  const addItem = (h: Hat) => upd({ ...s, hats: { ...s.hats, [h]: [...list(h), ""] } });
  const rmItem = (h: Hat, i: number) =>
    upd({ ...s, hats: { ...s.hats, [h]: list(h).filter((_, j) => j !== i) } });

  return (
    <Card>
      <div className="border-b border-rule p-3">
        <PhaseTabs
          variant="pill"
          active={s.active}
          onSelect={(h) => upd({ ...s, active: h })}
          items={HATS.map((h) => ({
            key: h,
            label: HAT_META[h].label,
            sub: HAT_META[h].sub,
            testId: `hat-tab-${h}`,
          }))}
        />
      </div>
      <div className="p-5" data-testid={`hat-panel-${s.active}`}>
        <div className="flex items-baseline gap-3 mb-4">
          <span className="font-serif font-medium text-[28px] text-vermilion">{HAT_META[s.active].label}</span>
          <MicroLabel>{HAT_META[s.active].sub}</MicroLabel>
        </div>
        <ul className="space-y-2">
          {list(s.active).map((x, i) => (
            <li key={i} className="flex items-center gap-2 group border-b border-rule pb-1">
              <span className="font-code text-[11px] text-ink-muted w-6">·{String(i + 1).padStart(2, "0")}</span>
              <InlineText value={x} onChange={(v) => setItem(s.active, i, v)} />
              <RemoveButton onClick={() => rmItem(s.active, i)} ariaLabel="remove" showOnHover />
            </li>
          ))}
        </ul>
        <AddButton onClick={() => addItem(s.active)} className="mt-3">+ add</AddButton>
      </div>
    </Card>
  );
}
