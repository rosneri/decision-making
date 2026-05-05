"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText } from "@/components/ui";
import { meta, schema, sample, type Meddic, KEYS, type Key, META } from "./data";
export { meta, schema, sample };
export type { Meddic };

export function View({ data, onUpdate }: { data: Meddic; onUpdate?: (d: Meddic) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Meddic) => { setS(n); onUpdate?.(n); };
  const set = (k: Key, patch: Partial<Meddic["cells"][Key]>) =>
    upd({ ...s, cells: { ...s.cells, [k]: { ...s.cells[k]!, ...patch } } });

  const open = KEYS.filter((k) => !s.cells[k]!.confirmed);

  return (
    <Card>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-rule">
        {KEYS.map((k) => {
          const c = s.cells[k]!;
          const danger = !c.confirmed;
          return (
            <div
              key={k}
              data-testid={`meddic-${k}`}
              className={`p-4 border-b border-rule flex items-center gap-3 ${danger ? "bg-vermilion/5" : ""}`}
            >
              <div className={`w-9 h-9 grid place-items-center font-serif font-medium text-[18px] text-paper ${danger ? "bg-vermilion" : "bg-ink"}`}>
                {META[k].letter}
              </div>
              <div className="flex-1 min-w-0">
                <MicroLabel accent={danger} bold>{META[k].word}</MicroLabel>
                <InlineText
                  value={c.answer}
                  onChange={(v) => set(k, { answer: v })}
                  placeholder="—"
                  size="sm"
                  className="block w-full mt-0.5"
                />
              </div>
              <button
                onClick={() => set(k, { confirmed: !c.confirmed })}
                data-testid={`meddic-${k}-confirm`}
                aria-pressed={c.confirmed}
                aria-label={`toggle ${k} confirmed`}
                className={`font-serif font-bold text-[18px] ${c.confirmed ? "text-ink" : "text-vermilion"}`}
              >
                {c.confirmed ? "✓" : "?"}
              </button>
            </div>
          );
        })}
      </div>
      <div className="p-4 border-t border-rule bg-paper-deep">
        <MicroLabel>Open</MicroLabel>
        <span className="ml-2 font-serif text-[14px] text-vermilion font-medium" data-testid="meddic-open">
          {open.length === 0 ? "all confirmed" : open.map((k) => META[k].word).join(" · ")}
        </span>
      </div>
    </Card>
  );
}
