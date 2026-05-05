"use client";
import { useState } from "react";
import { meta, schema, sample, type Stp } from "./data";
export { meta, schema, sample };
export type { Stp };

export function View({ data, onUpdate }: { data: Stp; onUpdate?: (d: Stp) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Stp) => { setS(n); onUpdate?.(n); };
  const setSeg = (i: number, v: string) =>
    upd({ ...s, segments: s.segments.map((x, j) => j === i ? v : x) });
  const addSeg = () => upd({ ...s, segments: [...s.segments, ""] });
  const rmSeg = (i: number) => {
    const next = s.segments.filter((_, j) => j !== i);
    upd({ ...s, segments: next, targetIdx: Math.min(s.targetIdx, Math.max(0, next.length - 1)) });
  };

  return (
    <div className="border border-ink bg-paper grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-rule">
      <div className="p-4">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">S · Segment</span>
        <ul className="mt-3 space-y-2">
          {s.segments.map((seg, i) => {
            const isTarget = i === s.targetIdx;
            return (
              <li key={i} className="flex items-center gap-2 group">
                <button onClick={() => upd({ ...s, targetIdx: i })}
                  data-testid={`stp-seg-${i}`}
                  aria-pressed={isTarget}
                  className={`w-3 h-3 rounded-full border ${isTarget ? "bg-vermilion border-vermilion" : "border-ink"}`} />
                <input value={seg} onChange={(e) => setSeg(i, e.target.value)}
                  className={`flex-1 font-serif text-[14px] bg-transparent border-b border-rule outline-none focus:border-vermilion ${isTarget ? "text-vermilion font-medium" : "text-ink"}`} />
                <button onClick={() => rmSeg(i)} aria-label="remove"
                  className="opacity-0 group-hover:opacity-100 text-ink-muted hover:text-vermilion">×</button>
              </li>
            );
          })}
        </ul>
        <button onClick={addSeg} className="mt-2 font-serif italic text-[13px] text-ink-muted hover:text-vermilion">+ segment</button>
      </div>
      <div className="p-4 bg-vermilion/5">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-vermilion font-medium">T · Target</span>
        <div className="mt-3 font-serif text-[20px] font-medium text-vermilion" data-testid="stp-target">
          {s.segments[s.targetIdx] || "—"}
        </div>
      </div>
      <div className="p-4">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">P · Position</span>
        <textarea value={s.position} onChange={(e) => upd({ ...s, position: e.target.value })}
          data-testid="stp-position"
          className="block w-full mt-3 font-serif italic text-[14px] bg-transparent border-l-2 border-rule pl-3 outline-none focus:border-vermilion resize-none text-ink"
          rows={4} />
      </div>
    </div>
  );
}
