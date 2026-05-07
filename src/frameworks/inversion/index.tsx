"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, AddButton, RemoveButton } from "@/components/ui";
import { meta, schema, sample, type Inversion } from "./data";
export { meta, schema, sample };
export type { Inversion };

export function View({ data, onUpdate }: { data: Inversion; onUpdate?: (d: Inversion) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Inversion) => { setS(n); onUpdate?.(n); };
  const setMode = (i: number, v: string) =>
    upd({ ...s, failureModes: s.failureModes.map((m, j) => j === i ? v : m) });
  const add = () => upd({ ...s, failureModes: [...s.failureModes, ""] });
  const rm = (i: number) => upd({ ...s, failureModes: s.failureModes.filter((_, j) => j !== i) });

  return (
    <Card className="grid grid-cols-1 sm:grid-cols-2">
      <div className="p-6 opacity-50 border-r border-rule">
        <MicroLabel>Forward</MicroLabel>
        <p className="font-serif italic text-[15px] text-ink mt-1">how could it succeed?</p>
        <InlineText
          value={s.forwardGoal}
          onChange={(v) => upd({ ...s, forwardGoal: v })}
          className="w-full mt-3 border-b border-rule py-1"
        />
        <p className="font-serif italic text-[12px] text-ink-muted mt-3">(set this aside — flip the question.)</p>
      </div>
      <div className="p-6 relative">
        <span className="absolute -left-3 top-6 bg-paper px-1 font-code text-[10px] tracking-[0.22em] text-vermilion font-medium">Flip ↺</span>
        <MicroLabel accent bold>Invert</MicroLabel>
        <p className="font-serif italic text-[15px] text-ink mt-1">how could it fail?</p>
        <ul className="mt-3 space-y-1">
          {s.failureModes.map((m, i) => (
            <li key={i} className="flex items-center gap-2 group border-b border-rule pb-1">
              <span className="font-code text-[11px] text-vermilion w-6">·{String(i + 1).padStart(2, "0")}</span>
              <InlineText
                value={m}
                onChange={(v) => setMode(i, v)}
                placeholder="A way it fails."
                ariaLabel={`failure ${i + 1}`}
                size="sm"
              />
              <span className="font-serif text-vermilion">✗</span>
              <RemoveButton onClick={() => rm(i)} ariaLabel="remove failure" showOnHover />
            </li>
          ))}
        </ul>
        <AddButton onClick={add} className="mt-3">+ add</AddButton>
        <p className="mt-4 font-serif italic text-[13px] text-ink border-t border-rule pt-2">
          ∴ avoid these and you&apos;ve already won.
        </p>
      </div>
    </Card>
  );
}
