"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, RemoveButton, AddButton } from "@/components/ui";
import { meta, schema, sample, rpn, type Fmea } from "./data";
export { meta, schema, sample };
export type { Fmea };

export function View({ data, onUpdate }: { data: Fmea; onUpdate?: (d: Fmea) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Fmea) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<Fmea["modes"][number]>) =>
    upd({ ...s, modes: s.modes.map((m, j) => j === i ? { ...m, ...patch } : m) });

  const ranked = s.modes.map((m, i) => ({ m, i, rpn: rpn(m) })).sort((a, b) => b.rpn - a.rpn);
  const topRpn = ranked[0]?.rpn ?? 0;

  return (
    <Card>
      <div className="border-b border-rule p-4">
        <MicroLabel>System</MicroLabel>
        <InlineText value={s.system} onChange={(v) => upd({ ...s, system: v })} className="block w-full mt-1 font-medium text-[16px]" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-rule">
              <th className="p-2 text-left font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Mode</th>
              <th className="p-2 text-left font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Effect</th>
              <th className="p-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted" title="severity">S</th>
              <th className="p-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted" title="occurrence">O</th>
              <th className="p-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted" title="detection">D</th>
              <th className="p-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">RPN</th>
              <th className="p-2 text-left font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Mitigation</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {ranked.map(({ m, i, rpn: r }) => {
              const isTop = r === topRpn;
              return (
                <tr key={i} data-testid={`fmea-row-${i}`} className={`border-b border-rule group ${isTop ? "bg-vermilion/5" : ""}`}>
                  <td className="p-2"><InlineText value={m.mode} onChange={(v) => set(i, { mode: v })} /></td>
                  <td className="p-2"><InlineText value={m.effect} onChange={(v) => set(i, { effect: v })} /></td>
                  {(["severity", "occurrence", "detection"] as const).map((k) => (
                    <td key={k} className="p-2">
                      <input
                        type="number" min={1} max={10}
                        value={m[k]}
                        onChange={(e) => set(i, { [k]: Math.max(1, Math.min(10, Number(e.target.value) || 1)) })}
                        data-testid={`fmea-${k[0]}-${i}`}
                        className="w-[44px] font-code text-[13px] text-center bg-transparent border-b border-rule outline-none"
                      />
                    </td>
                  ))}
                  <td className="p-2 text-center">
                    <span data-testid={`fmea-rpn-${i}`} className={`font-serif font-medium text-[16px] ${isTop ? "text-vermilion" : ""}`}>{r}</span>
                  </td>
                  <td className="p-2"><InlineText value={m.mitigation} onChange={(v) => set(i, { mitigation: v })} italic size="sm" className="text-ink-muted" /></td>
                  <td className="p-2"><RemoveButton onClick={() => upd({ ...s, modes: s.modes.filter((_, j) => j !== i) })} showOnHover /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="p-3">
        <AddButton onClick={() => upd({ ...s, modes: [...s.modes, { mode: "", effect: "", severity: 5, occurrence: 5, detection: 5, mitigation: "" }] })}>
          + add failure mode
        </AddButton>
      </div>
    </Card>
  );
}
