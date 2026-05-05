"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, AddButton, RemoveButton } from "@/components/ui";
import { meta, schema, sample, type Adr, STATUSES, type Status } from "./data";
export { meta, schema, sample };
export type { Adr };

export function View({ data, onUpdate }: { data: Adr; onUpdate?: (d: Adr) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Adr) => { setS(n); onUpdate?.(n); };
  const setAlt = (i: number, v: string) => upd({ ...s, alternatives: s.alternatives.map((a, j) => j === i ? v : a) });
  const addAlt = () => upd({ ...s, alternatives: [...s.alternatives, ""] });
  const rmAlt = (i: number) => upd({ ...s, alternatives: s.alternatives.filter((_, j) => j !== i) });

  const stub = "bg-transparent border-b border-rule outline-none text-ink";

  return (
    <Card className="p-5 font-code text-[13px] leading-[1.6]">
      <div className="flex items-baseline gap-3 border-b border-rule pb-2 flex-wrap">
        <span className="text-ink-muted">ADR-</span>
        <input value={s.number} onChange={(e) => upd({ ...s, number: e.target.value })} className={`w-16 ${stub}`} />
        <span className="text-ink-muted">·</span>
        <input value={s.date} onChange={(e) => upd({ ...s, date: e.target.value })} className={`w-28 ${stub}`} />
        <select
          value={s.status}
          onChange={(e) => upd({ ...s, status: e.target.value as Status })}
          data-testid="adr-status"
          className={`ml-auto bg-transparent border px-2 py-0.5 ${s.status === "accepted" ? "border-vermilion text-vermilion" : "border-rule text-ink-muted"}`}
        >
          {STATUSES.map((x) => <option key={x} value={x}>{x}</option>)}
        </select>
      </div>
      <InlineText
        value={s.title}
        onChange={(v) => upd({ ...s, title: v })}
        className="block w-full mt-3 text-[18px] font-medium"
      />
      {(["context", "decision", "consequences"] as const).map((k) => (
        <div key={k} className="mt-3">
          <span className="text-ink-muted uppercase tracking-[0.18em] text-[10px]">{k}</span>
          <textarea
            value={s[k]}
            onChange={(e) => upd({ ...s, [k]: e.target.value })}
            data-testid={`adr-${k}`}
            className="block w-full mt-1 font-serif text-[14px] bg-transparent border-l-2 border-rule pl-3 py-1 outline-none focus:border-vermilion resize-none text-ink"
            rows={2}
          />
        </div>
      ))}
      <div className="mt-3">
        <MicroLabel className="tracking-[0.18em]">alternatives</MicroLabel>
        <ul className="mt-1 pl-3 border-l-2 border-rule">
          {s.alternatives.map((a, i) => (
            <li key={i} className="flex items-center gap-2 group">
              <InlineText value={a} onChange={(v) => setAlt(i, v)} size="sm" />
              <RemoveButton onClick={() => rmAlt(i)} ariaLabel="remove alternative" showOnHover />
            </li>
          ))}
        </ul>
        <AddButton onClick={addAlt} className="mt-1">+ alternative</AddButton>
      </div>
    </Card>
  );
}
