"use client";
import { useState } from "react";
import { RangeField } from "@/components/ui/Range";
import { ResultPanel } from "@/components/ResultPanel";
import { meta, schema, sample, type RegretMin } from "./data";
export { meta, schema, sample };
export type { RegretMin };

export function View({ data, onUpdate }: { data: RegretMin; onUpdate?: (d: RegretMin) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: RegretMin) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<RegretMin["options"][number]>) =>
    upd({ ...s, options: s.options.map((o, j) => j === i ? { ...o, ...patch } : o) });
  const add = () => upd({ ...s, options: [...s.options, { name: "Option", regretIfTaken: 5, regretIfNotTaken: 5, eightyYrThought: "" }] });
  const rm = (i: number) => upd({ ...s, options: s.options.filter((_, j) => j !== i) });

  // Pick option that minimizes max regret across both branches
  const scored = s.options.map((o, i) => ({ ...o, i, asymmetry: o.regretIfNotTaken - o.regretIfTaken }));
  const best = scored.reduce((a, x) => x.asymmetry > a.asymmetry ? x : a, scored[0]!);

  return (
    <div className="border border-ink bg-paper">
      <div className="p-4 border-b border-rule bg-paper-deep font-serif italic text-[14px] text-ink-muted">
        &ldquo;Project yourself to 80. Look back. Which choice will you regret?&rdquo;
      </div>
      {scored.map((o) => {
        const isBest = o.i === best.i;
        return (
          <div key={o.i} data-testid={`regret-option-${o.i}`}
            className={`p-4 border-b border-rule ${isBest ? "bg-vermilion/5" : ""}`}>
            <div className="flex items-center gap-2">
              <input value={o.name} onChange={(e) => set(o.i, { name: e.target.value })}
                className={`font-serif text-[16px] font-medium bg-transparent border-none outline-none flex-1 ${isBest ? "text-vermilion" : "text-ink"}`} />
              <button onClick={() => rm(o.i)} aria-label="remove" className="text-ink-muted hover:text-vermilion">×</button>
            </div>
            <input value={o.eightyYrThought} onChange={(e) => set(o.i, { eightyYrThought: e.target.value })}
              placeholder="At 80 you say: …"
              className="block w-full mt-1 font-serif italic text-[14px] text-ink-muted bg-transparent border-b border-rule outline-none focus:border-vermilion" />
            <div className="grid grid-cols-2 gap-4 mt-3">
              <RangeField
                label="Regret if taken"
                min={1} max={10}
                value={o.regretIfTaken}
                onChange={(v) => set(o.i, { regretIfTaken: v })}
                ariaLabel={`regret if taken for ${o.name}`}
                testId={`regret-${o.i}-taken`}
              />
              <RangeField
                label="Regret if NOT taken"
                accent
                min={1} max={10}
                value={o.regretIfNotTaken}
                onChange={(v) => set(o.i, { regretIfNotTaken: v })}
                ariaLabel={`regret if not taken for ${o.name}`}
                testId={`regret-${o.i}-not`}
              />
            </div>
          </div>
        );
      })}
      <button onClick={add} className="font-serif italic text-[13px] text-ink-muted hover:text-vermilion px-4 py-2 w-full text-left">+ option</button>
      <ResultPanel
        body={s.recommendation}
        metrics={[
          { k: "Pick", v: best.name, testId: "regret-best" },
          { k: "Asymmetry", v: (best.asymmetry > 0 ? "+" : "") + best.asymmetry },
        ]}
      />
    </div>
  );
}
