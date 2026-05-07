"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, AddButton, RemoveButton } from "@/components/ui";
import { meta, schema, sample, type Jtbd } from "./data";
export { meta, schema, sample };
export type { Jtbd };

export function View({ data, onUpdate }: { data: Jtbd; onUpdate?: (d: Jtbd) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Jtbd) => { setS(n); onUpdate?.(n); };
  const setComp = (i: number, v: string) =>
    upd({ ...s, competitors: s.competitors.map((c, j) => j === i ? v : c) });
  const addComp = () => upd({ ...s, competitors: [...s.competitors, ""] });
  const rmComp = (i: number) => upd({ ...s, competitors: s.competitors.filter((_, j) => j !== i) });

  const fillIn = "font-serif italic bg-transparent border-b border-rule outline-none focus:border-vermilion px-1";

  return (
    <Card>
      <div className="p-6 border-b border-rule bg-paper-deep">
        <MicroLabel accent bold>Job statement</MicroLabel>
        <p className="mt-2 font-serif text-[18px] leading-[1.4] text-ink">
          When <input value={s.when} onChange={(e) => upd({ ...s, when: e.target.value })} data-testid="jtbd-when" className={`${fillIn} min-w-[120px]`} />,
          I want <input value={s.want} onChange={(e) => upd({ ...s, want: e.target.value })} data-testid="jtbd-want" className={`${fillIn} min-w-[200px]`} />,
          so I can <input value={s.soThat} onChange={(e) => upd({ ...s, soThat: e.target.value })} data-testid="jtbd-sothat" className={`${fillIn} min-w-[180px]`} />.
        </p>
      </div>
      <div className="grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-y-0 sm:divide-x divide-rule">
        {[
          { h: "When", body: "context · trigger", val: s.when },
          { h: "Want", body: "functional outcome", val: s.want },
          { h: "So that", body: "deeper why · emotional", val: s.soThat, accent: true },
        ].map((c) => (
          <div key={c.h} className={`p-4 ${c.accent ? "bg-vermilion/5" : ""}`}>
            <MicroLabel accent={c.accent} bold>{c.h}</MicroLabel>
            <p className="mt-1 font-serif italic text-[13px] text-ink-muted">{c.body}</p>
            <p className="mt-2 font-serif text-[14px] text-ink">{c.val || "—"}</p>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-rule">
        <MicroLabel>Competing on the job</MicroLabel>
        <div className="mt-2 flex gap-2 flex-wrap items-center">
          {s.competitors.map((c, i) => (
            <span key={i} className="border border-rule px-2 py-1 flex items-center gap-1 group">
              <InlineText value={c} onChange={(v) => setComp(i, v)} italic size="sm" fullWidth={false} className="w-24" />
              <RemoveButton onClick={() => rmComp(i)} ariaLabel="remove competitor" showOnHover />
            </span>
          ))}
          <AddButton onClick={addComp}>+ add</AddButton>
        </div>
      </div>
    </Card>
  );
}
