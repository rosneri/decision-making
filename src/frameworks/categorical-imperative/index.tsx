"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText } from "@/components/ui";
import { meta, schema, sample, type CategoricalImperative, TESTS, META } from "./data";
export { meta, schema, sample };
export type { CategoricalImperative };

export function View({ data, onUpdate }: { data: CategoricalImperative; onUpdate?: (d: CategoricalImperative) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: CategoricalImperative) => { setS(n); onUpdate?.(n); };
  const passes = TESTS.filter((t) => s.tests[t].passes).length;
  const ok = passes === 3;

  return (
    <Card>
      <div className="border-b border-rule p-4">
        <MicroLabel>Maxim · the rule you&apos;d act on</MicroLabel>
        <InlineText
          value={s.maxim}
          onChange={(v) => upd({ ...s, maxim: v })}
          className="block w-full mt-1 font-serif italic text-[18px]"
        />
        <p className={`mt-2 font-code text-[10px] tracking-[0.22em] uppercase ${ok ? "text-vermilion" : "text-ink-muted"}`} data-testid="ci-summary">
          {passes}/3 tests passed · {ok ? "permissible" : "impermissible"}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-rule">
        {TESTS.map((t) => {
          const slot = s.tests[t];
          return (
            <div key={t} data-testid={`ci-${t}`} className={`p-4 ${slot.passes ? "" : "bg-vermilion/5"}`}>
              <MicroLabel accent={!slot.passes} bold>{META[t].label}</MicroLabel>
              <p className="font-serif italic text-[12px] text-ink-muted mt-0.5">{META[t].q}</p>
              <textarea
                value={slot.analysis}
                onChange={(e) => upd({ ...s, tests: { ...s.tests, [t]: { ...slot, analysis: e.target.value } } })}
                className="mt-2 w-full font-serif text-[14px] bg-transparent border-t border-rule pt-2 outline-none focus:border-vermilion text-ink resize-none"
                rows={5}
              />
              <button
                onClick={() => upd({ ...s, tests: { ...s.tests, [t]: { ...slot, passes: !slot.passes } } })}
                data-testid={`ci-toggle-${t}`}
                className={`mt-2 font-code text-[10px] tracking-[0.22em] uppercase px-3 py-1 border ${slot.passes ? "border-rule text-ink-muted" : "border-vermilion text-vermilion bg-vermilion/10"}`}
              >
                {slot.passes ? "passes" : "fails"}
              </button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
