"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText } from "@/components/ui";
import { meta, schema, sample, type Aida, META } from "./data";
export { meta, schema, sample };
export type { Aida };

const STEPS: Array<{ key: "attention" | "interest" | "desire" | "action"; letter: "A" | "I" | "D" | "Action" }> = [
  { key: "attention", letter: "A" },
  { key: "interest", letter: "I" },
  { key: "desire", letter: "D" },
  { key: "action", letter: "Action" },
];

export function View({ data, onUpdate }: { data: Aida; onUpdate?: (d: Aida) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Aida) => { setS(n); onUpdate?.(n); };

  return (
    <Card>
      <div className="border-b border-rule p-4">
        <MicroLabel>Audience</MicroLabel>
        <InlineText value={s.audience} onChange={(v) => upd({ ...s, audience: v })} className="block w-full mt-1 font-medium text-[16px]" />
      </div>
      <div>
        {STEPS.map(({ key, letter }, idx) => {
          const last = idx === STEPS.length - 1;
          return (
            <div key={key} data-testid={`aida-${letter}`} className={`border-b border-rule p-4 grid grid-cols-[60px_1fr] gap-4 ${last ? "bg-vermilion/5" : ""}`}>
              <div className={`font-serif font-medium text-[36px] ${last ? "text-vermilion" : "text-ink"}`}>
                {letter[0]}
              </div>
              <div>
                <MicroLabel accent={last} bold>{META[letter].word}</MicroLabel>
                <p className="font-serif italic text-[12px] text-ink-muted mt-0.5">{META[letter].q}</p>
                <textarea
                  value={s[key]}
                  onChange={(e) => upd({ ...s, [key]: e.target.value })}
                  className="mt-2 w-full font-serif text-[14px] bg-transparent border-t border-rule pt-2 outline-none focus:border-vermilion text-ink resize-none"
                  rows={3}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
