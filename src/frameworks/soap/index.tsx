"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, EditableList } from "@/components/ui";
import { meta, schema, sample, type Soap, META } from "./data";
export { meta, schema, sample };
export type { Soap };

export function View({ data, onUpdate }: { data: Soap; onUpdate?: (d: Soap) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Soap) => { setS(n); onUpdate?.(n); };

  const text = (k: "subjective" | "objective" | "assessment", letter: "S" | "O" | "A") => (
    <div data-testid={`soap-${letter}`} className="border-b border-rule p-4 grid grid-cols-[60px_1fr] gap-4">
      <span className="font-serif font-medium text-[36px] text-vermilion">{letter}</span>
      <div>
        <MicroLabel bold>{META[letter].word}</MicroLabel>
        <p className="font-serif italic text-[12px] text-ink-muted mt-0.5">{META[letter].q}</p>
        <textarea
          value={s[k]}
          onChange={(e) => upd({ ...s, [k]: e.target.value })}
          className="mt-2 w-full font-serif text-[14px] bg-transparent border-t border-rule pt-2 outline-none focus:border-vermilion text-ink resize-none"
          rows={3}
        />
      </div>
    </div>
  );

  return (
    <Card>
      <div className="border-b border-rule p-4">
        <MicroLabel>Patient</MicroLabel>
        <InlineText value={s.patient} onChange={(v) => upd({ ...s, patient: v })} className="block w-full mt-1 font-medium text-[16px]" />
      </div>
      {text("subjective", "S")}
      {text("objective", "O")}
      {text("assessment", "A")}
      <div data-testid="soap-P" className="p-4 grid grid-cols-[60px_1fr] gap-4 bg-vermilion/5">
        <span className="font-serif font-medium text-[36px] text-vermilion">P</span>
        <div>
          <MicroLabel accent bold>{META.P.word}</MicroLabel>
          <p className="font-serif italic text-[12px] text-ink-muted mt-0.5">{META.P.q}</p>
          <div className="mt-2">
            <EditableList
              items={s.plan}
              testIdPrefix="soap-plan"
              indexStyle="numeric"
              onChangeItem={(i, v) => upd({ ...s, plan: s.plan.map((x, j) => j === i ? v : x) })}
              onRemove={(i) => upd({ ...s, plan: s.plan.filter((_, j) => j !== i) })}
              onAdd={() => upd({ ...s, plan: [...s.plan, ""] })}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
