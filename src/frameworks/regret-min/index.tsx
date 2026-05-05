"use client";
import { useState } from "react";
import { Card, MicroLabel, RangeField, InlineText, AddButton, RemoveButton } from "@/components/ui";
import { meta, schema, sample, type RegretMin } from "./data";
export { meta, schema, sample };
export type { RegretMin };

export function View({ data, onUpdate }: { data: RegretMin; onUpdate?: (d: RegretMin) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: RegretMin) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<RegretMin["options"][number]>) =>
    upd({ ...s, options: s.options.map((o, j) => j === i ? { ...o, ...patch } : o) });
  const add = () => upd({ ...s, options: [...s.options, { name: "Option", regretIfTaken: 5, regretIfNotTaken: 5, eightyYrThought: "" }] });
  const rm = (i: number) => upd({ ...s, options: s.options.filter((_, j) => j !== i) });

  const scored = s.options.map((o, i) => ({ ...o, i, asymmetry: o.regretIfNotTaken - o.regretIfTaken }));
  const best = scored.reduce((a, x) => x.asymmetry > a.asymmetry ? x : a, scored[0]!);

  return (
    <Card>
      <div className="p-4 border-b border-rule bg-paper-deep font-serif italic text-[14px] text-ink-muted">
        &ldquo;Project yourself to 80. Look back. Which choice will you regret?&rdquo;
      </div>
      {scored.map((o) => {
        const isBest = o.i === best.i;
        return (
          <div key={o.i} data-testid={`regret-option-${o.i}`} className={`p-4 border-b border-rule ${isBest ? "bg-vermilion/5" : ""}`}>
            <div className="flex items-center gap-2">
              <InlineText
                value={o.name}
                onChange={(v) => set(o.i, { name: v })}
                className={`text-[16px] font-medium ${isBest ? "text-vermilion" : ""}`}
              />
              <RemoveButton onClick={() => rm(o.i)} ariaLabel="remove" />
            </div>
            <InlineText
              value={o.eightyYrThought}
              onChange={(v) => set(o.i, { eightyYrThought: v })}
              placeholder="At 80 you say: …"
              italic
              size="sm"
              className="block w-full mt-1 text-ink-muted border-b border-rule"
            />
            <div className="grid grid-cols-2 gap-4 mt-3">
              <RangeField
                label="Regret if taken"
                min={1}
                max={10}
                value={o.regretIfTaken}
                onChange={(v) => set(o.i, { regretIfTaken: v })}
                ariaLabel={`regret if taken for ${o.name}`}
                testId={`regret-${o.i}-taken`}
              />
              <RangeField
                label="Regret if NOT taken"
                accent
                min={1}
                max={10}
                value={o.regretIfNotTaken}
                onChange={(v) => set(o.i, { regretIfNotTaken: v })}
                ariaLabel={`regret if not taken for ${o.name}`}
                testId={`regret-${o.i}-not`}
              />
            </div>
          </div>
        );
      })}
      <AddButton onClick={add} className="px-4 py-2 w-full text-left">+ option</AddButton>
      <div className="p-4 border-t border-rule bg-paper-deep">
        <MicroLabel>Lowest 80-year regret</MicroLabel>
        <span className="ml-2 font-serif font-medium text-vermilion text-[15px]" data-testid="regret-best">{best.name}</span>
      </div>
    </Card>
  );
}
