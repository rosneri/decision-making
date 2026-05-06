"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, EditableList } from "@/components/ui";
import { meta, schema, sample, type FourNobleTruths, META } from "./data";
export { meta, schema, sample };
export type { FourNobleTruths };

export function View({ data, onUpdate }: { data: FourNobleTruths; onUpdate?: (d: FourNobleTruths) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: FourNobleTruths) => { setS(n); onUpdate?.(n); };

  const text = (k: "dukkha" | "samudaya" | "nirodha", num: number) => (
    <div key={k} data-testid={`fnt-${k}`} className="border-b border-rule p-4 grid grid-cols-[40px_1fr] gap-4">
      <span className="font-serif font-medium text-[28px] text-vermilion">{num}.</span>
      <div>
        <MicroLabel bold>{META[k].word}</MicroLabel>
        <p className="font-serif italic text-[12px] text-ink-muted mt-0.5">{META[k].q}</p>
        <textarea
          value={s.truths[k]}
          onChange={(e) => upd({ ...s, truths: { ...s.truths, [k]: e.target.value } })}
          className="mt-2 w-full font-serif text-[14px] bg-transparent border-t border-rule pt-2 outline-none focus:border-vermilion text-ink resize-none"
          rows={3}
        />
      </div>
    </div>
  );

  return (
    <Card>
      <div className="border-b border-rule p-4">
        <MicroLabel>Situation</MicroLabel>
        <InlineText value={s.situation} onChange={(v) => upd({ ...s, situation: v })} className="block w-full mt-1 font-serif text-[15px]" />
      </div>
      {text("dukkha", 1)}
      {text("samudaya", 2)}
      {text("nirodha", 3)}
      <div data-testid="fnt-magga" className="p-4 grid grid-cols-[40px_1fr] gap-4 bg-vermilion/5">
        <span className="font-serif font-medium text-[28px] text-vermilion">4.</span>
        <div>
          <MicroLabel accent bold>{META.magga.word}</MicroLabel>
          <p className="font-serif italic text-[12px] text-ink-muted mt-0.5">{META.magga.q}</p>
          <div className="mt-2">
            <EditableList
              items={s.truths.magga}
              testIdPrefix="fnt-magga-step"
              indexStyle="numeric"
              onChangeItem={(i, v) => upd({ ...s, truths: { ...s.truths, magga: s.truths.magga.map((x, j) => j === i ? v : x) } })}
              onRemove={(i) => upd({ ...s, truths: { ...s.truths, magga: s.truths.magga.filter((_, j) => j !== i) } })}
              onAdd={() => upd({ ...s, truths: { ...s.truths, magga: [...s.truths.magga, ""] } })}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
