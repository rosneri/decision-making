"use client";
import { useState } from "react";
import { meta, schema, sample, type FiveForces, FORCES, type Force, FORCE_META } from "./data";
export { meta, schema, sample };
export type { FiveForces };

export function View({ data, onUpdate }: { data: FiveForces; onUpdate?: (d: FiveForces) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: FiveForces) => { setS(n); onUpdate?.(n); };
  const set = (f: Force, patch: Partial<FiveForces["forces"][Force]>) =>
    upd({ ...s, forces: { ...s.forces, [f]: { ...s.forces[f]!, ...patch } } });

  return (
    <div className="border border-ink bg-paper p-6">
      <ul className="space-y-3">
        {FORCES.map((f) => {
          const force = s.forces[f]!;
          const isCenter = f === "rivalry";
          return (
            <li key={f} data-testid={`force-${f}`}
              className={`flex items-center gap-4 p-3 border ${isCenter ? "border-vermilion bg-vermilion/5" : "border-rule"}`}>
              <span className={`font-code text-[10px] tracking-[0.22em] uppercase font-medium w-40 ${isCenter ? "text-vermilion" : "text-ink-muted"}`}>
                {FORCE_META[f].label}
              </span>
              <input value={force.note} onChange={(e) => set(f, { note: e.target.value })}
                className="flex-1 bg-transparent border-none outline-none font-serif italic text-[14px] text-ink" />
              <div className="flex gap-1" role="group" aria-label={`level for ${f}`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => set(f, { level: n })}
                    aria-label={`set level ${n}`}
                    className={`w-3 h-3 rounded-full border ${n <= force.level ? (isCenter ? "bg-vermilion border-vermilion" : "bg-ink border-ink") : (isCenter ? "border-vermilion" : "border-rule")}`} />
                ))}
              </div>
              <span className="font-code text-[13px] text-ink-muted w-6 text-right">{force.level}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
