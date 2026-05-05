"use client";
import { useState } from "react";
import { z } from "zod";

const STATUSES = ["proposed", "accepted", "deprecated", "superseded"] as const;
type Status = (typeof STATUSES)[number];

export const meta = {
  id: "adr",
  name: "Architecture Decision Record",
  category: "Engineering & systems",
  blurb: "Capture context, decision, consequences, and alternatives — once, durably.",
} as const;

export const schema = z.object({
  framework: z.literal("adr"),
  category: z.string(),
  title: z.string(),
  number: z.string(),
  date: z.string(),
  status: z.enum(STATUSES),
  context: z.string(),
  decision: z.string(),
  consequences: z.string(),
  alternatives: z.array(z.string()).min(0).max(10),
  recommendation: z.string(),
});
export type Adr = z.infer<typeof schema>;

export const sample: Adr = {
  framework: "adr",
  category: meta.category,
  title: "Postgres or DynamoDB for the new service?",
  number: "0042",
  date: "2026-05-04",
  status: "accepted",
  context: "Orders service needs strong consistency on a sub-200k tps tier with rich query needs.",
  decision: "Use Postgres 16; row-level transactions matter more than horizontal scale at this stage.",
  consequences: "+ ACID, mature tooling. − vertical scale ceiling at ~200k tps.",
  alternatives: ["DynamoDB", "Cassandra", "CockroachDB"],
  recommendation: "Accept Postgres now; reopen this ADR if tps approaches the ceiling.",
};

export function View({ data, onUpdate }: { data: Adr; onUpdate?: (d: Adr) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Adr) => { setS(n); onUpdate?.(n); };
  const setAlt = (i: number, v: string) => upd({ ...s, alternatives: s.alternatives.map((a, j) => j === i ? v : a) });
  const addAlt = () => upd({ ...s, alternatives: [...s.alternatives, ""] });
  const rmAlt = (i: number) => upd({ ...s, alternatives: s.alternatives.filter((_, j) => j !== i) });

  return (
    <div className="border border-ink bg-paper p-5 font-code text-[13px] leading-[1.6]">
      <div className="flex items-baseline gap-3 border-b border-rule pb-2 flex-wrap">
        <span className="text-ink-muted">ADR-</span>
        <input value={s.number} onChange={(e) => upd({ ...s, number: e.target.value })}
          className="w-16 bg-transparent border-b border-rule outline-none text-ink" />
        <span className="text-ink-muted">·</span>
        <input value={s.date} onChange={(e) => upd({ ...s, date: e.target.value })}
          className="w-28 bg-transparent border-b border-rule outline-none text-ink" />
        <select value={s.status} onChange={(e) => upd({ ...s, status: e.target.value as Status })}
          data-testid="adr-status"
          className={`ml-auto bg-transparent border px-2 py-0.5 ${s.status === "accepted" ? "border-vermilion text-vermilion" : "border-rule text-ink-muted"}`}>
          {STATUSES.map((x) => <option key={x} value={x}>{x}</option>)}
        </select>
      </div>
      <input value={s.title} onChange={(e) => upd({ ...s, title: e.target.value })}
        className="block w-full mt-3 font-serif text-[18px] font-medium bg-transparent border-none outline-none text-ink" />
      {(["context", "decision", "consequences"] as const).map((k) => (
        <div key={k} className="mt-3">
          <span className="text-ink-muted uppercase tracking-[0.18em] text-[10px]">{k}</span>
          <textarea value={s[k]} onChange={(e) => upd({ ...s, [k]: e.target.value })}
            data-testid={`adr-${k}`}
            className="block w-full mt-1 font-serif text-[14px] bg-transparent border-l-2 border-rule pl-3 py-1 outline-none focus:border-vermilion resize-none text-ink"
            rows={2} />
        </div>
      ))}
      <div className="mt-3">
        <span className="text-ink-muted uppercase tracking-[0.18em] text-[10px]">alternatives</span>
        <ul className="mt-1 pl-3 border-l-2 border-rule">
          {s.alternatives.map((a, i) => (
            <li key={i} className="flex items-center gap-2 group">
              <input value={a} onChange={(e) => setAlt(i, e.target.value)}
                className="flex-1 font-serif text-[14px] bg-transparent border-none outline-none text-ink" />
              <button onClick={() => rmAlt(i)} aria-label="remove alternative"
                className="opacity-0 group-hover:opacity-100 text-ink-muted hover:text-vermilion">×</button>
            </li>
          ))}
        </ul>
        <button onClick={addAlt} className="mt-1 font-serif italic text-[13px] text-ink-muted hover:text-vermilion">+ alternative</button>
      </div>
    </div>
  );
}
