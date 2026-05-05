"use client";
import { useState } from "react";
import { meta, schema, sample, type Ooda, STAGES, type Stage, STAGE_META } from "./data";
export { meta, schema, sample };
export type { Ooda };

export function View({ data, onUpdate }: { data: Ooda; onUpdate?: (d: Ooda) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Ooda) => { setS(n); onUpdate?.(n); };
  const setNote = (k: Stage, v: string) =>
    upd({ ...s, notes: { ...s.notes, [k]: v } });

  return (
    <div className="border border-ink bg-paper">
      <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-rule">
        {STAGES.map((k) => {
          const isCurrent = s.current === k;
          return (
            <button key={k} onClick={() => upd({ ...s, current: k })}
              data-testid={`ooda-${k}`}
              className={`p-4 text-left flex flex-col gap-2 ${isCurrent ? "bg-vermilion/5" : ""}`}>
              <div className={`w-12 h-12 rounded-full grid place-items-center font-serif font-medium text-[22px] ${isCurrent ? "bg-vermilion text-paper" : "border-[1.5px] border-ink text-ink"}`}>
                {STAGE_META[k].letter}
              </div>
              <span className={`font-code text-[10px] tracking-[0.22em] uppercase font-medium ${isCurrent ? "text-vermilion" : "text-ink-muted"}`}>
                {STAGE_META[k].label}
              </span>
              <span className="font-serif italic text-[12px] text-ink-muted">{STAGE_META[k].note}</span>
            </button>
          );
        })}
      </div>
      <div className="p-4 border-t border-rule">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">{STAGE_META[s.current].label} notes</span>
        <textarea value={s.notes[s.current] ?? ""} onChange={(e) => setNote(s.current, e.target.value)}
          data-testid="ooda-current-notes"
          className="block w-full mt-1 font-serif text-[14px] bg-transparent border-t border-rule pt-2 outline-none focus:border-vermilion resize-none text-ink"
          rows={3} />
      </div>
    </div>
  );
}
