"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, Range } from "@/components/ui";
import { meta, schema, sample, type AllisonLenses, LENSES, type Lens, META } from "./data";
export { meta, schema, sample };
export type { AllisonLenses };

export function View({ data, onUpdate }: { data: AllisonLenses; onUpdate?: (d: AllisonLenses) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: AllisonLenses) => { setS(n); onUpdate?.(n); };
  const set = (l: Lens, patch: Partial<AllisonLenses["lenses"][Lens]>) =>
    upd({ ...s, lenses: { ...s.lenses, [l]: { ...s.lenses[l]!, ...patch } } });

  const loudest = LENSES.reduce((w, l) => (s.lenses[l]!.weight > s.lenses[w]!.weight ? l : w), LENSES[0]);

  return (
    <Card className="divide-y divide-rule">
      {LENSES.map((l) => {
        const lens = s.lenses[l]!;
        const isLoud = l === loudest;
        return (
          <div
            key={l}
            data-testid={`allison-${l}`}
            className={`p-4 grid grid-cols-1 sm:grid-cols-[60px_1fr_140px] gap-2 sm:gap-3 items-start sm:items-center ${isLoud ? "bg-vermilion/5" : ""}`}
          >
            <span className={`font-serif font-medium text-[28px] ${isLoud ? "text-vermilion" : "text-ink"}`}>{META[l].roman}.</span>
            <div>
              <div className="font-serif text-[16px] font-medium text-ink">{META[l].label}</div>
              <div className="font-serif italic text-[12px] text-ink-muted">{META[l].q}</div>
              <InlineText
                value={lens.explanation}
                onChange={(v) => set(l, { explanation: v })}
                size="sm"
                className={`block w-full mt-1 border-b border-rule ${isLoud ? "text-vermilion" : ""}`}
              />
            </div>
            <div>
              <MicroLabel>Weight</MicroLabel>
              <Range
                value={lens.weight}
                onChange={(v) => set(l, { weight: v })}
                min={1}
                max={5}
                testId={`allison-${l}-weight`}
                ariaLabel={`weight ${l}`}
                className="block w-full"
              />
            </div>
          </div>
        );
      })}
      <div className="p-4 bg-paper-deep">
        <MicroLabel>Loudest lens</MicroLabel>
        <span className="ml-2 font-serif font-medium text-vermilion text-[15px]" data-testid="allison-loudest">{META[loudest].label}</span>
      </div>
    </Card>
  );
}
