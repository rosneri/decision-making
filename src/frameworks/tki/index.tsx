"use client";
import { useState } from "react";
import { Card, MicroLabel, Range } from "@/components/ui";
import { meta, schema, sample, type Tki, MODES, ANCHORS, dist } from "./data";
export { meta, schema, sample };
export type { Tki };

export function View({ data, onUpdate }: { data: Tki; onUpdate?: (d: Tki) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Tki) => { setS(n); onUpdate?.(n); };

  const point = { x: s.cooperativeness, y: s.assertiveness };
  const closest = MODES.reduce((b, m) => dist(ANCHORS[m], point) < dist(ANCHORS[b], point) ? m : b, MODES[0]);

  return (
    <Card>
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-rule">
        <label>
          <MicroLabel>Assertiveness</MicroLabel>
          <Range
            value={s.assertiveness}
            onChange={(v) => upd({ ...s, assertiveness: v })}
            min={0}
            max={10}
            step={0.1}
            testId="tki-assertiveness"
            ariaLabel="assertiveness"
            className="block w-full"
          />
          <span className="font-code text-[12px] text-ink-muted">{s.assertiveness.toFixed(1)}</span>
        </label>
        <label>
          <MicroLabel>Cooperativeness</MicroLabel>
          <Range
            value={s.cooperativeness}
            onChange={(v) => upd({ ...s, cooperativeness: v })}
            min={0}
            max={10}
            step={0.1}
            testId="tki-coop"
            ariaLabel="cooperativeness"
            className="block w-full"
          />
          <span className="font-code text-[12px] text-ink-muted">{s.cooperativeness.toFixed(1)}</span>
        </label>
      </div>
      <div className="relative mx-auto mt-4 mb-12 w-[280px] h-[280px] border-2 border-ink" data-testid="tki-canvas">
        {MODES.map((m) => {
          const isClosest = m === closest;
          return (
            <div
              key={m}
              className="absolute -translate-x-1/2 -translate-y-1/2 grid place-items-center"
              style={{ left: `${ANCHORS[m].x * 10}%`, top: `${100 - ANCHORS[m].y * 10}%` }}
            >
              <span className={`w-14 h-14 rounded-full overflow-hidden grid place-items-center font-serif text-[10px] leading-tight text-center break-all font-medium border-[1.5px] px-1 ${isClosest ? "bg-vermilion/10 border-vermilion text-vermilion" : "bg-paper border-ink text-ink"}`}>
                {m}
              </span>
            </div>
          );
        })}
        <div
          className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 bg-vermilion rounded-full border border-paper"
          style={{ left: `${s.cooperativeness * 10}%`, top: `${100 - s.assertiveness * 10}%` }}
          data-testid="tki-marker"
        />
      </div>
      <div className="p-4 border-t border-rule bg-paper-deep text-center">
        <MicroLabel>Closest mode</MicroLabel>
        <span className="ml-2 font-serif font-medium text-vermilion text-[16px]" data-testid="tki-closest">{closest}</span>
      </div>
    </Card>
  );
}
