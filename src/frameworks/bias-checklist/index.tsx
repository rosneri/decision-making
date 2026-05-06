"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText } from "@/components/ui";
import { meta, schema, sample, type BiasChecklist } from "./data";
export { meta, schema, sample };
export type { BiasChecklist };

export function View({ data, onUpdate }: { data: BiasChecklist; onUpdate?: (d: BiasChecklist) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: BiasChecklist) => { setS(n); onUpdate?.(n); };
  const setBias = (i: number, patch: Partial<BiasChecklist["biases"][number]>) =>
    upd({ ...s, biases: s.biases.map((b, j) => j === i ? { ...b, ...patch } : b) });

  const hits = s.biases.filter((b) => b.triggered).length;

  return (
    <Card>
      <div className="border-b border-rule p-4">
        <MicroLabel>Decision under examination</MicroLabel>
        <InlineText
          value={s.decision}
          onChange={(v) => upd({ ...s, decision: v })}
          className="block w-full mt-1 font-serif text-[16px]"
        />
        <p className="mt-2 font-code text-[10px] tracking-[0.22em] uppercase text-vermilion" data-testid="bias-summary">
          {hits} / {s.biases.length} biases triggered
        </p>
      </div>
      <ul className="list-none p-0 m-0">
        {s.biases.map((b, i) => (
          <li
            key={i}
            data-testid={`bias-row-${i}`}
            className={`grid grid-cols-[24px_1fr_2fr] gap-3 items-start p-4 border-b border-rule ${b.triggered ? "bg-vermilion/5" : ""}`}
          >
            <button
              onClick={() => setBias(i, { triggered: !b.triggered })}
              data-testid={`bias-toggle-${i}`}
              className={`mt-1 w-5 h-5 border ${b.triggered ? "border-vermilion bg-vermilion text-paper" : "border-rule bg-transparent"} font-code text-[12px] flex items-center justify-center`}
              aria-label={`toggle ${b.name}`}
            >
              {b.triggered ? "✓" : ""}
            </button>
            <div>
              <InlineText value={b.name} onChange={(v) => setBias(i, { name: v })} className={`font-medium ${b.triggered ? "text-vermilion" : ""}`} />
              <p className="font-serif italic text-[12px] text-ink-muted mt-0.5">{b.question}</p>
            </div>
            <InlineText
              value={b.note}
              onChange={(v) => setBias(i, { note: v })}
              placeholder="evidence / why it applies"
              className="block w-full font-serif text-[14px] text-ink-muted"
            />
          </li>
        ))}
      </ul>
    </Card>
  );
}
