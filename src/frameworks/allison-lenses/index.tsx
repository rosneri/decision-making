"use client";
import { useState } from "react";
import { meta, schema, sample, type AllisonLenses, LENSES, type Lens, META } from "./data";
export { meta, schema, sample };
export type { AllisonLenses };

export function View({ data, onUpdate }: { data: AllisonLenses; onUpdate?: (d: AllisonLenses) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: AllisonLenses) => { setS(n); onUpdate?.(n); };
  const set = (l: Lens, patch: Partial<AllisonLenses["lenses"][Lens]>) =>
    upd({ ...s, lenses: { ...s.lenses, [l]: { ...s.lenses[l]!, ...patch } } });

  const loudest = LENSES.reduce((w, l) => (s.lenses[l]!.weight > s.lenses[w]!.weight ? l : w), LENSES[0]);

  return (
    <div className="border border-ink bg-paper divide-y divide-rule">
      {LENSES.map((l) => {
        const lens = s.lenses[l]!;
        const isLoud = l === loudest;
        return (
          <div key={l} data-testid={`allison-${l}`}
            className={`p-4 grid grid-cols-[60px_1fr_140px] gap-3 items-center ${isLoud ? "bg-vermilion/5" : ""}`}>
            <span className={`font-serif font-medium text-[28px] ${isLoud ? "text-vermilion" : "text-ink"}`}>{META[l].roman}.</span>
            <div>
              <div className="font-serif text-[16px] font-medium text-ink">{META[l].label}</div>
              <div className="font-serif italic text-[12px] text-ink-muted">{META[l].q}</div>
              <input value={lens.explanation} onChange={(e) => set(l, { explanation: e.target.value })}
                className={`block w-full mt-1 font-serif text-[14px] bg-transparent border-b border-rule outline-none focus:border-vermilion ${isLoud ? "text-vermilion" : "text-ink"}`} />
            </div>
            <div>
              <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Weight</span>
              <input type="range" min={1} max={5} value={lens.weight}
                onChange={(e) => set(l, { weight: Number(e.target.value) })}
                data-testid={`allison-${l}-weight`}
                aria-label={`weight ${l}`} className="block w-full" />
            </div>
          </div>
        );
      })}
      <div className="p-4 bg-paper-deep">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Loudest lens</span>
        <span className="ml-2 font-serif font-medium text-vermilion text-[15px]" data-testid="allison-loudest">{META[loudest].label}</span>
      </div>
    </div>
  );
}
