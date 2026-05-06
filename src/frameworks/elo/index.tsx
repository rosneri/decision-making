"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText, RemoveButton, AddButton } from "@/components/ui";
import { meta, schema, sample, ratingsAfter, type Elo } from "./data";
export { meta, schema, sample };
export type { Elo };

export function View({ data, onUpdate }: { data: Elo; onUpdate?: (d: Elo) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Elo) => { setS(n); onUpdate?.(n); };
  const finals = ratingsAfter(s);

  return (
    <Card>
      <div className="border-b border-rule p-4 flex items-center gap-4">
        <MicroLabel>K-factor</MicroLabel>
        <input
          type="number" min={8} max={64}
          value={s.k}
          onChange={(e) => upd({ ...s, k: Math.max(8, Math.min(64, Number(e.target.value) || 32)) })}
          data-testid="elo-k"
          className="w-[60px] font-code text-[14px] bg-transparent border-b border-rule outline-none"
        />
        <span className="font-serif italic text-[12px] text-ink-muted">larger K = larger rating swings</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-rule">
        <div className="p-4">
          <MicroLabel bold>Players</MicroLabel>
          <table className="w-full mt-2">
            <thead>
              <tr className="border-b border-rule">
                <th className="p-1 text-left font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Name</th>
                <th className="p-1 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Start</th>
                <th className="p-1 font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">After</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {s.players.map((p, i) => {
                const delta = finals[i]! - p.rating;
                return (
                  <tr key={i} data-testid={`elo-player-${i}`} className="border-b border-rule group">
                    <td className="p-1"><InlineText value={p.name} onChange={(v) => upd({ ...s, players: s.players.map((x, j) => j === i ? { ...x, name: v } : x) })} /></td>
                    <td className="p-1 text-center">
                      <input
                        type="number"
                        value={p.rating}
                        onChange={(e) => upd({ ...s, players: s.players.map((x, j) => j === i ? { ...x, rating: Number(e.target.value) || 0 } : x) })}
                        data-testid={`elo-rating-${i}`}
                        className="w-[64px] font-code text-[13px] text-center bg-transparent border-b border-rule outline-none"
                      />
                    </td>
                    <td className="p-1 text-center">
                      <span data-testid={`elo-final-${i}`} className="font-serif font-medium text-[14px]">{finals[i]}</span>
                      <span className={`ml-1 font-code text-[10px] ${delta > 0 ? "text-vermilion" : delta < 0 ? "text-ink-muted" : "text-ink-muted"}`}>
                        {delta > 0 ? `+${delta}` : delta}
                      </span>
                    </td>
                    <td className="p-1"><RemoveButton onClick={() => upd({ ...s, players: s.players.filter((_, j) => j !== i) })} showOnHover /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-2">
            <AddButton onClick={() => upd({ ...s, players: [...s.players, { name: "New", rating: 1500 }] })}>+ player</AddButton>
          </div>
        </div>
        <div className="p-4">
          <MicroLabel bold>Matches</MicroLabel>
          <ul className="list-none mt-2 space-y-1">
            {s.matches.map((m, i) => (
              <li key={i} data-testid={`elo-match-${i}`} className="flex items-center gap-2 group">
                <span className="font-code text-[10px] text-ink-muted w-[22px]">·{String(i + 1).padStart(2, "0")}</span>
                <select
                  value={m.a}
                  onChange={(e) => upd({ ...s, matches: s.matches.map((x, j) => j === i ? { ...x, a: Number(e.target.value) } : x) })}
                  className="font-code text-[12px] bg-transparent border-b border-rule outline-none"
                >
                  {s.players.map((p, j) => (<option key={j} value={j}>{p.name}</option>))}
                </select>
                <span className="font-serif italic text-[12px] text-ink-muted">vs</span>
                <select
                  value={m.b}
                  onChange={(e) => upd({ ...s, matches: s.matches.map((x, j) => j === i ? { ...x, b: Number(e.target.value) } : x) })}
                  className="font-code text-[12px] bg-transparent border-b border-rule outline-none"
                >
                  {s.players.map((p, j) => (<option key={j} value={j}>{p.name}</option>))}
                </select>
                <select
                  value={m.result}
                  onChange={(e) => upd({ ...s, matches: s.matches.map((x, j) => j === i ? { ...x, result: e.target.value as "A" | "B" | "draw" } : x) })}
                  data-testid={`elo-result-${i}`}
                  className="font-code text-[10px] tracking-[0.22em] uppercase ml-auto bg-transparent border-b border-rule outline-none"
                >
                  <option value="A">A wins</option>
                  <option value="draw">draw</option>
                  <option value="B">B wins</option>
                </select>
                <RemoveButton onClick={() => upd({ ...s, matches: s.matches.filter((_, j) => j !== i) })} showOnHover />
              </li>
            ))}
          </ul>
          <div className="mt-2">
            <AddButton onClick={() => upd({ ...s, matches: [...s.matches, { a: 0, b: 1, result: "A" }] })}>+ match</AddButton>
          </div>
        </div>
      </div>
    </Card>
  );
}
