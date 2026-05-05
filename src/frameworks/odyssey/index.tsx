"use client";
import { useState } from "react";
import { meta, schema, sample, type Odyssey } from "./data";
export { meta, schema, sample };
export type { Odyssey };

export function View({ data, onUpdate }: { data: Odyssey; onUpdate?: (d: Odyssey) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Odyssey) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<Odyssey["plans"][number]>) =>
    upd({ ...s, plans: s.plans.map((p, j) => j === i ? { ...p, ...patch } : p) });

  return (
    <div className="border border-ink bg-paper divide-y divide-rule">
      {s.plans.map((p, i) => {
        const isPreferred = i === s.preferred;
        return (
          <div key={i} data-testid={`odyssey-plan-${i}`}
            className={`p-4 ${isPreferred ? "bg-vermilion/5" : ""}`}>
            <div className="flex items-center gap-2">
              <input value={p.title} onChange={(e) => set(i, { title: e.target.value })}
                className={`font-serif text-[16px] font-medium bg-transparent border-none outline-none flex-1 ${isPreferred ? "text-vermilion" : "text-ink"}`} />
              <button onClick={() => upd({ ...s, preferred: i })}
                data-testid={`odyssey-prefer-${i}`}
                className={`font-code text-[10px] tracking-[0.22em] uppercase font-medium ${isPreferred ? "text-vermilion" : "text-ink-muted hover:text-ink"}`}>
                {isPreferred ? "★ preferred" : "set preferred"}
              </button>
            </div>
            <input value={p.note} onChange={(e) => set(i, { note: e.target.value })}
              className="block w-full mt-1 font-serif italic text-[13px] text-ink-muted bg-transparent border-none outline-none" />
            <svg viewBox="0 0 240 30" className="w-full h-10 mt-2">
              <path d={p.trajectory.map((y, x) => `${x === 0 ? "M" : "L"} ${x * 40 + 10} ${30 - y * 3}`).join(" ")}
                stroke={isPreferred ? "var(--vermilion)" : "var(--ink)"} strokeWidth={1.5} fill="none" />
              {p.trajectory.map((y, x) => (
                <circle key={x} cx={x * 40 + 10} cy={30 - y * 3} r={2} fill={isPreferred ? "var(--vermilion)" : "var(--ink)"} />
              ))}
            </svg>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {(["resources", "likeability", "confidence"] as const).map((k) => (
                <label key={k}>
                  <span className="font-code text-[10px] tracking-[0.18em] uppercase text-ink-muted">{k}</span>
                  <input type="range" min={1} max={5} value={p[k]}
                    onChange={(e) => set(i, { [k]: Number(e.target.value) })}
                    aria-label={`${k} for ${p.title}`} className="block w-full" />
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
