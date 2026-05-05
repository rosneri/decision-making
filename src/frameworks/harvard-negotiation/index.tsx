"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, AddButton, RemoveButton, SplitPane } from "@/components/ui";
import { meta, schema, sample, type Harvard, type Section, META } from "./data";
export { meta, schema, sample };
export type { Harvard };

export function View({ data, onUpdate }: { data: Harvard; onUpdate?: (d: Harvard) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Harvard) => { setS(n); onUpdate?.(n); };
  const setItem = (sec: Section, i: number, v: string) =>
    upd({ ...s, [sec]: s[sec].map((x, j) => j === i ? v : x) });
  const add = (sec: Section) => upd({ ...s, [sec]: [...s[sec], ""] });
  const rm = (sec: Section, i: number) => upd({ ...s, [sec]: s[sec].filter((_, j) => j !== i) });

  return (
    <Card>
      <SplitPane>
        {(Object.keys(META) as Section[]).map((sec) => (
        <div key={sec} className={`p-4 ${META[sec].accent ? "bg-vermilion/5" : ""}`} data-testid={`hn-${sec}`}>
          <MicroLabel accent={META[sec].accent} bold>
            {META[sec].label} · <span className="italic font-normal">{META[sec].sub}</span>
          </MicroLabel>
          <ul className="mt-3 space-y-1">
            {s[sec].map((x, i) => (
              <li key={i} className="flex items-center gap-2 group border-b border-rule pb-1">
                <InlineText value={x} onChange={(v) => setItem(sec, i, v)} size="sm" />
                <RemoveButton onClick={() => rm(sec, i)} ariaLabel="remove" showOnHover />
              </li>
            ))}
          </ul>
          <AddButton onClick={() => add(sec)} className="mt-2">+ add</AddButton>
        </div>
        ))}
      </SplitPane>
    </Card>
  );
}
