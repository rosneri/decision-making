"use client";
import { useState } from "react";
import { z } from "zod";

export const meta = {
  id: "jtbd",
  name: "Jobs-to-be-Done",
  category: "Product & UX",
  blurb: "When __, I want to __, so I can __ — the job, not the persona.",
} as const;

export const schema = z.object({
  framework: z.literal("jtbd"),
  category: z.string(),
  title: z.string(),
  when: z.string(),
  want: z.string(),
  soThat: z.string(),
  competitors: z.array(z.string()).min(0).max(8),
  recommendation: z.string(),
});
export type Jtbd = z.infer<typeof schema>;

export const sample: Jtbd = {
  framework: "jtbd",
  category: meta.category,
  title: "Why do people buy our protein bars?",
  when: "I'm rushing between meetings",
  want: "to eat something filling without leaving my desk",
  soThat: "I don't crash before 4pm",
  competitors: ["coffee", "granola", "skipping it"],
  recommendation: "Compete on convenience and energy, not protein content. The granola aisle is the real rival.",
};

export function View({ data, onUpdate }: { data: Jtbd; onUpdate?: (d: Jtbd) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Jtbd) => { setS(n); onUpdate?.(n); };
  const setComp = (i: number, v: string) =>
    upd({ ...s, competitors: s.competitors.map((c, j) => j === i ? v : c) });
  const addComp = () => upd({ ...s, competitors: [...s.competitors, ""] });
  const rmComp = (i: number) => upd({ ...s, competitors: s.competitors.filter((_, j) => j !== i) });

  return (
    <div className="border border-ink bg-paper">
      <div className="p-6 border-b border-rule bg-paper-deep">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-vermilion font-medium">Job statement</span>
        <p className="mt-2 font-serif text-[18px] leading-[1.4] text-ink">
          When <input value={s.when} onChange={(e) => upd({ ...s, when: e.target.value })}
            data-testid="jtbd-when"
            className="font-serif italic bg-transparent border-b border-rule outline-none focus:border-vermilion px-1 min-w-[120px]" />,
          I want <input value={s.want} onChange={(e) => upd({ ...s, want: e.target.value })}
            data-testid="jtbd-want"
            className="font-serif italic bg-transparent border-b border-rule outline-none focus:border-vermilion px-1 min-w-[200px]" />,
          so I can <input value={s.soThat} onChange={(e) => upd({ ...s, soThat: e.target.value })}
            data-testid="jtbd-sothat"
            className="font-serif italic bg-transparent border-b border-rule outline-none focus:border-vermilion px-1 min-w-[180px]" />.
        </p>
      </div>
      <div className="grid grid-cols-3 divide-x divide-rule">
        {[
          { h: "When", body: "context · trigger", val: s.when },
          { h: "Want", body: "functional outcome", val: s.want },
          { h: "So that", body: "deeper why · emotional", val: s.soThat, accent: true },
        ].map((c) => (
          <div key={c.h} className={`p-4 ${c.accent ? "bg-vermilion/5" : ""}`}>
            <span className={`font-code text-[10px] tracking-[0.22em] uppercase font-medium ${c.accent ? "text-vermilion" : "text-ink-muted"}`}>{c.h}</span>
            <p className="mt-1 font-serif italic text-[13px] text-ink-muted">{c.body}</p>
            <p className="mt-2 font-serif text-[14px] text-ink">{c.val || "—"}</p>
          </div>
        ))}
      </div>
      <div className="p-4 border-t border-rule">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Competing on the job</span>
        <div className="mt-2 flex gap-2 flex-wrap items-center">
          {s.competitors.map((c, i) => (
            <span key={i} className="border border-rule px-2 py-1 flex items-center gap-1 group">
              <input value={c} onChange={(e) => setComp(i, e.target.value)}
                className="font-serif italic text-[14px] bg-transparent border-none outline-none w-24" />
              <button onClick={() => rmComp(i)} aria-label="remove competitor"
                className="opacity-0 group-hover:opacity-100 text-ink-muted hover:text-vermilion">×</button>
            </span>
          ))}
          <button onClick={addComp} className="font-serif italic text-[13px] text-ink-muted hover:text-vermilion">+ add</button>
        </div>
      </div>
    </div>
  );
}
