"use client";
import { useState } from "react";
import { meta, schema, sample, type SixHats, HATS, type Hat, HAT_META } from "./data";
export { meta, schema, sample };
export type { SixHats };

export function View({ data, onUpdate }: { data: SixHats; onUpdate?: (d: SixHats) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: SixHats) => { setS(n); onUpdate?.(n); };
  const list = (h: Hat) => s.hats[h] ?? [];
  const setItem = (h: Hat, i: number, v: string) =>
    upd({ ...s, hats: { ...s.hats, [h]: list(h).map((x, j) => j === i ? v : x) } });
  const addItem = (h: Hat) => upd({ ...s, hats: { ...s.hats, [h]: [...list(h), ""] } });
  const rmItem = (h: Hat, i: number) =>
    upd({ ...s, hats: { ...s.hats, [h]: list(h).filter((_, j) => j !== i) } });

  return (
    <div className="border border-ink bg-paper">
      <div className="border-b border-rule p-3 flex gap-2 flex-wrap">
        {HATS.map((h) => (
          <button key={h} onClick={() => upd({ ...s, active: h })}
            data-testid={`hat-tab-${h}`}
            aria-pressed={s.active === h}
            className={`font-code text-[10px] tracking-[0.22em] uppercase px-3 py-1 border ${s.active === h ? "bg-vermilion text-paper border-vermilion" : "border-rule text-ink-muted hover:border-ink"}`}>
            {HAT_META[h].label} · {HAT_META[h].sub}
          </button>
        ))}
      </div>
      <div className="p-5" data-testid={`hat-panel-${s.active}`}>
        <div className="flex items-baseline gap-3 mb-4">
          <span className="font-serif font-medium text-[28px] text-vermilion">{HAT_META[s.active].label}</span>
          <span className="font-code text-[11px] tracking-[0.22em] uppercase text-ink-muted">{HAT_META[s.active].sub}</span>
        </div>
        <ul className="space-y-2">
          {list(s.active).map((x, i) => (
            <li key={i} className="flex items-center gap-2 group border-b border-rule pb-1">
              <span className="font-code text-[11px] text-ink-muted w-6">·{String(i + 1).padStart(2, "0")}</span>
              <input value={x} onChange={(e) => setItem(s.active, i, e.target.value)}
                className="flex-1 bg-transparent border-none outline-none font-serif text-[15px] text-ink" />
              <button onClick={() => rmItem(s.active, i)} aria-label="remove"
                className="opacity-0 group-hover:opacity-100 text-ink-muted hover:text-vermilion">×</button>
            </li>
          ))}
        </ul>
        <button onClick={() => addItem(s.active)} className="mt-3 font-serif italic text-[13px] text-ink-muted hover:text-vermilion">+ add</button>
      </div>
    </div>
  );
}
