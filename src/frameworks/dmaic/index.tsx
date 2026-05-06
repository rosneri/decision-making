"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText } from "@/components/ui";
import { meta, schema, sample, type Dmaic, PHASES, META } from "./data";
export { meta, schema, sample };
export type { Dmaic };

export function View({ data, onUpdate }: { data: Dmaic; onUpdate?: (d: Dmaic) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Dmaic) => { setS(n); onUpdate?.(n); };
  const idx = PHASES.indexOf(s.current);

  return (
    <Card>
      <div className="border-b border-rule p-4">
        <MicroLabel>Problem</MicroLabel>
        <InlineText value={s.problem} onChange={(v) => upd({ ...s, problem: v })} className="block w-full mt-1 font-serif text-[15px]" />
      </div>
      <div className="grid grid-cols-5 border-b border-rule">
        {PHASES.map((p, i) => {
          const done = i < idx;
          const active = i === idx;
          return (
            <button
              key={p}
              data-testid={`dmaic-tab-${p}`}
              onClick={() => upd({ ...s, current: p })}
              className={`p-3 border-r last:border-r-0 border-rule font-code text-[10px] tracking-[0.22em] uppercase ${active ? "bg-vermilion/10 text-vermilion border-b-2 border-b-vermilion" : done ? "text-ink-muted" : "text-ink-muted/50"}`}
            >
              {p} · {META[p].word}
            </button>
          );
        })}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 divide-x divide-rule">
        {PHASES.map((p) => {
          const active = p === s.current;
          return (
            <div key={p} data-testid={`dmaic-${p}`} className={`p-4 ${active ? "bg-vermilion/5" : ""}`}>
              <MicroLabel accent={active} bold={active}>{p}. {META[p].word}</MicroLabel>
              <p className="font-serif italic text-[12px] text-ink-muted mt-0.5">{META[p].q}</p>
              <textarea
                value={s.phases[p]}
                onChange={(e) => upd({ ...s, phases: { ...s.phases, [p]: e.target.value } })}
                className="mt-2 w-full font-serif text-[13px] bg-transparent border-t border-rule pt-2 outline-none focus:border-vermilion text-ink resize-none"
                rows={6}
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
