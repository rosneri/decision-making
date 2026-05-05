"use client";

import { useState } from "react";
import type { DecisionMatrix } from "@/lib/schemas";

export function DecisionMatrixView({ data }: { data: DecisionMatrix }) {
  const [matrix, setMatrix] = useState(data);

  const setScore = (oi: number, ci: number, value: number) => {
    setMatrix((m) => {
      const options = m.options.map((o, i) =>
        i === oi
          ? { ...o, scores: o.scores.map((s, j) => (j === ci ? value : s)) }
          : o
      );
      return { ...m, options };
    });
  };

  const setWeight = (ci: number, value: number) => {
    setMatrix((m) => ({
      ...m,
      criteria: m.criteria.map((c, i) =>
        i === ci ? { ...c, weight: value } : c
      ),
    }));
  };

  const totals = matrix.options.map((o) =>
    o.scores.reduce(
      (sum, s, i) => sum + s * (matrix.criteria[i]?.weight ?? 0),
      0
    )
  );
  const max = Math.max(...totals, 1);
  const winnerIdx = totals.indexOf(Math.max(...totals));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">{matrix.title}</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Decision Matrix — adjust weights and scores to see results update.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 dark:bg-neutral-900">
            <tr>
              <th className="text-left px-3 py-2">Option</th>
              {matrix.criteria.map((c, i) => (
                <th key={i} className="px-2 py-2 text-center min-w-[110px]">
                  <div className="font-medium text-xs leading-tight">
                    {c.name}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 justify-center">
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={c.weight}
                      onChange={(e) => setWeight(i, Number(e.target.value))}
                      className="w-14"
                    />
                    <span className="text-[10px] text-neutral-500 tabular-nums">
                      w{c.weight}
                    </span>
                  </div>
                </th>
              ))}
              <th className="px-3 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {matrix.options.map((o, oi) => (
              <tr
                key={oi}
                className={
                  oi === winnerIdx
                    ? "bg-emerald-50 dark:bg-emerald-950/30"
                    : "border-t border-neutral-100 dark:border-neutral-900"
                }
              >
                <td className="px-3 py-2 font-medium">
                  {o.name}
                  {oi === winnerIdx && (
                    <span className="ml-2 text-xs text-emerald-700 dark:text-emerald-400">
                      ★ winner
                    </span>
                  )}
                </td>
                {o.scores.map((s, ci) => (
                  <td key={ci} className="px-2 py-2">
                    <div className="flex items-center gap-1.5">
                      <input
                        type="range"
                        min={0}
                        max={10}
                        value={s}
                        onChange={(e) =>
                          setScore(oi, ci, Number(e.target.value))
                        }
                        className="flex-1 min-w-0"
                      />
                      <span className="text-[10px] w-4 text-right tabular-nums">
                        {s}
                      </span>
                    </div>
                  </td>
                ))}
                <td className="px-2 py-2 text-right font-mono whitespace-nowrap">
                  <div className="flex items-center gap-2 justify-end">
                    <div className="h-2 w-16 bg-neutral-200 dark:bg-neutral-800 rounded shrink-0">
                      <div
                        className="h-2 rounded bg-emerald-500"
                        style={{ width: `${(totals[oi] / max) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs">{totals[oi]}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
