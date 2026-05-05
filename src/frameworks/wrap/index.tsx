"use client";
import { useState } from "react";
import { Card, InlineText } from "@/components/ui";
import { meta, schema, sample, type Wrap, STEPS, type Step, META } from "./data";
export { meta, schema, sample };
export type { Wrap };

export function View({ data, onUpdate }: { data: Wrap; onUpdate?: (d: Wrap) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Wrap) => { setS(n); onUpdate?.(n); };
  const set = (k: Step, patch: Partial<Wrap["steps"][Step]>) =>
    upd({ ...s, steps: { ...s.steps, [k]: { ...s.steps[k], ...patch } } });

  return (
    <Card className="divide-y divide-rule">
      {STEPS.map((k) => {
        const step = s.steps[k];
        const isCurrent = s.current === k;
        return (
          <div
            key={k}
            data-testid={`wrap-step-${k}`}
            className={`p-4 flex items-center gap-4 ${isCurrent ? "bg-vermilion/5 border-l-4 border-l-vermilion" : ""}`}
          >
            <button
              onClick={() => set(k, { done: !step.done })}
              aria-label={`toggle ${META[k].word} done`}
              aria-pressed={step.done}
              className={`w-10 h-10 grid place-items-center font-serif font-medium text-[18px] rounded-full border-[1.5px] ${
                step.done ? "bg-ink text-paper border-ink" : isCurrent ? "border-vermilion text-vermilion" : "border-ink text-ink"
              }`}
            >
              {step.done ? "✓" : k}
            </button>
            <div className="flex-1">
              <div className="font-serif text-[16px] font-medium text-ink">{META[k].word}</div>
              <InlineText
                value={step.notes}
                onChange={(v) => set(k, { notes: v })}
                placeholder={META[k].desc}
                italic
                size="sm"
                className="block w-full mt-1 text-ink-muted border-b border-rule py-0.5"
              />
            </div>
            <button
              onClick={() => upd({ ...s, current: k })}
              data-testid={`wrap-set-current-${k}`}
              className={`font-code text-[10px] tracking-[0.22em] uppercase font-medium ${
                isCurrent ? "text-vermilion" : "text-ink-muted hover:text-ink"
              }`}
            >
              {isCurrent ? "→ here" : step.done ? "done" : "next"}
            </button>
          </div>
        );
      })}
    </Card>
  );
}
