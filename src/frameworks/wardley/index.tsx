"use client";
import { useState } from "react";
import { meta, schema, sample, type Wardley, STAGES } from "./data";
export { meta, schema, sample };
export type { Wardley };

export function View({ data, onUpdate }: { data: Wardley; onUpdate?: (d: Wardley) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Wardley) => { setS(n); onUpdate?.(n); };
  const set = (i: number, patch: Partial<Wardley["nodes"][number]>) =>
    upd({ ...s, nodes: s.nodes.map((n, j) => j === i ? { ...n, ...patch } : n) });
  const add = () => upd({ ...s, nodes: [...s.nodes, { name: "node", visibility: 50, evolution: 50 }] });
  const rm = (i: number) => upd({ ...s, nodes: s.nodes.filter((_, j) => j !== i) });

  return (
    <div className="border border-ink bg-paper">
      <div className="relative h-[320px] border-b border-rule m-4" data-testid="wardley-canvas">
        {[25, 50, 75].map((p) => (
          <div key={p} className="absolute top-0 bottom-0 border-l border-dashed border-rule" style={{ left: `${p}%` }} />
        ))}
        {STAGES.map((l, i) => (
          <span key={l} className="absolute font-code text-[9px] tracking-[0.18em] uppercase text-ink-muted" style={{ bottom: -16, left: `${i * 25 + 2}%` }}>
            {l}
          </span>
        ))}
        <span className="absolute font-code text-[9px] tracking-[0.18em] uppercase text-ink-muted top-2 left-2">Visible ↑</span>
        <span className="absolute font-code text-[9px] tracking-[0.18em] uppercase text-ink-muted bottom-2 left-2">Invisible</span>
        {s.nodes.map((n, i) => (
          <div key={i} data-testid={`wardley-node-${i}`}
            className="absolute flex items-center gap-1.5 group"
            style={{ left: `${n.evolution}%`, top: `${100 - n.visibility}%`, transform: "translate(-50%, -50%)" }}>
            <span className={`w-3 h-3 rounded-full border-[1.5px] ${n.invest ? "bg-vermilion border-vermilion" : "bg-paper border-ink"}`} />
            <span className={`font-code text-[11px] whitespace-nowrap ${n.invest ? "text-vermilion font-medium" : "text-ink"}`}>{n.name}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-rule">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left px-3 py-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Component</th>
              <th className="text-center px-3 py-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Visibility</th>
              <th className="text-center px-3 py-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Evolution</th>
              <th className="text-center px-3 py-2 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Invest</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {s.nodes.map((n, i) => (
              <tr key={i} className="border-t border-rule">
                <td className="px-3 py-2">
                  <input value={n.name} onChange={(e) => set(i, { name: e.target.value })}
                    className="font-serif italic text-[14px] bg-transparent border-none outline-none w-full text-ink" />
                </td>
                <td className="px-3 py-2 text-center">
                  <input type="range" min={0} max={100} value={n.visibility} onChange={(e) => set(i, { visibility: Number(e.target.value) })}
                    aria-label={`visibility ${n.name}`} className="w-24" />
                </td>
                <td className="px-3 py-2 text-center">
                  <input type="range" min={0} max={100} value={n.evolution} onChange={(e) => set(i, { evolution: Number(e.target.value) })}
                    aria-label={`evolution ${n.name}`} className="w-24" />
                </td>
                <td className="px-3 py-2 text-center">
                  <input type="checkbox" checked={!!n.invest} onChange={(e) => set(i, { invest: e.target.checked })}
                    aria-label={`invest in ${n.name}`} />
                </td>
                <td className="px-3 py-2">
                  <button onClick={() => rm(i)} aria-label="remove" className="text-ink-muted hover:text-vermilion">×</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={add} className="font-serif italic text-[13px] text-ink-muted hover:text-vermilion px-3 py-2 border-t border-rule w-full text-left">+ add component</button>
      </div>
    </div>
  );
}
