"use client";
import { useState } from "react";
import { meta, schema, sample, type DesignThinking, STAGES, META } from "./data";
export { meta, schema, sample };
export type { DesignThinking };

export function View({ data, onUpdate }: { data: DesignThinking; onUpdate?: (d: DesignThinking) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: DesignThinking) => { setS(n); onUpdate?.(n); };

  return (
    <div className="border border-ink bg-paper">
      <div className="grid grid-cols-5 divide-x divide-rule">
        {STAGES.map((k, i) => {
          const isCurrent = s.current === k;
          return (
            <button key={k} onClick={() => upd({ ...s, current: k })}
              data-testid={`dt-tab-${k}`}
              className={`p-4 text-left ${isCurrent ? "bg-vermilion/5" : ""}`}>
              <span className={`font-code text-[10px] tracking-[0.22em] uppercase font-medium ${isCurrent ? "text-vermilion" : "text-ink-muted"}`}>
                0{i + 1}
              </span>
              <div className={`font-serif text-[15px] font-medium mt-1 ${isCurrent ? "text-vermilion" : "text-ink"}`}>{META[k].label}</div>
            </button>
          );
        })}
      </div>
      <div className="p-4 border-t border-rule">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">{META[s.current].label} notes</span>
        <textarea value={s.notes[s.current] ?? ""}
          onChange={(e) => upd({ ...s, notes: { ...s.notes, [s.current]: e.target.value } })}
          data-testid="dt-current-notes"
          className="block w-full mt-1 font-serif text-[14px] bg-transparent border-t border-rule pt-2 outline-none focus:border-vermilion resize-none text-ink"
          rows={4} />
      </div>
    </div>
  );
}
