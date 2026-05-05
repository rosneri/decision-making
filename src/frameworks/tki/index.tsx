"use client";
import { useState } from "react";
import { z } from "zod";

const MODES = ["compete", "collaborate", "compromise", "avoid", "accommodate"] as const;
type Mode = (typeof MODES)[number];

export const meta = {
  id: "tki",
  name: "Thomas-Kilmann Modes",
  category: "Negotiation & conflict",
  blurb: "Five conflict modes plotted on assertiveness × cooperativeness.",
} as const;

export const schema = z.object({
  framework: z.literal("tki"),
  category: z.string(),
  title: z.string(),
  assertiveness: z.number().min(0).max(10),
  cooperativeness: z.number().min(0).max(10),
  recommendation: z.string(),
});
export type Tki = z.infer<typeof schema>;

export const sample: Tki = {
  framework: "tki",
  category: meta.category,
  title: "Coworker keeps overriding my decisions in meetings.",
  assertiveness: 8,
  cooperativeness: 8,
  recommendation: "High stakes + ongoing relationship → collaborate. Schedule a 1:1, name the pattern, propose a joint protocol.",
};

const ANCHORS: Record<Mode, { x: number; y: number; sub: string }> = {
  compete: { x: 1, y: 9, sub: "I win" },
  collaborate: { x: 9, y: 9, sub: "we both win" },
  compromise: { x: 5, y: 5, sub: "split" },
  avoid: { x: 1, y: 1, sub: "skip it" },
  accommodate: { x: 9, y: 1, sub: "you win" },
};

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

export function View({ data, onUpdate }: { data: Tki; onUpdate?: (d: Tki) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Tki) => { setS(n); onUpdate?.(n); };

  const point = { x: s.cooperativeness, y: s.assertiveness };
  const closest = MODES.reduce((b, m) => dist(ANCHORS[m], point) < dist(ANCHORS[b], point) ? m : b, MODES[0]);

  return (
    <div className="border border-ink bg-paper">
      <div className="p-4 grid grid-cols-2 gap-4 border-b border-rule">
        <label>
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Assertiveness</span>
          <input type="range" min={0} max={10} step={0.1} value={s.assertiveness}
            onChange={(e) => upd({ ...s, assertiveness: Number(e.target.value) })}
            data-testid="tki-assertiveness"
            aria-label="assertiveness"
            className="block w-full" />
          <span className="font-code text-[12px] text-ink-muted">{s.assertiveness.toFixed(1)}</span>
        </label>
        <label>
          <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Cooperativeness</span>
          <input type="range" min={0} max={10} step={0.1} value={s.cooperativeness}
            onChange={(e) => upd({ ...s, cooperativeness: Number(e.target.value) })}
            data-testid="tki-coop"
            aria-label="cooperativeness"
            className="block w-full" />
          <span className="font-code text-[12px] text-ink-muted">{s.cooperativeness.toFixed(1)}</span>
        </label>
      </div>
      <div className="relative mx-auto mt-4 mb-12 w-[280px] h-[280px] border-2 border-ink" data-testid="tki-canvas">
        {MODES.map((m) => {
          const isClosest = m === closest;
          return (
            <div key={m} className="absolute -translate-x-1/2 -translate-y-1/2 grid place-items-center"
              style={{ left: `${ANCHORS[m].x * 10}%`, top: `${100 - ANCHORS[m].y * 10}%` }}>
              <span className={`w-14 h-14 rounded-full grid place-items-center font-serif text-[12px] font-medium border-[1.5px] ${isClosest ? "bg-vermilion/10 border-vermilion text-vermilion" : "bg-paper border-ink text-ink"}`}>
                {m}
              </span>
            </div>
          );
        })}
        <div className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 bg-vermilion rounded-full border border-paper"
          style={{ left: `${s.cooperativeness * 10}%`, top: `${100 - s.assertiveness * 10}%` }}
          data-testid="tki-marker" />
      </div>
      <div className="p-4 border-t border-rule bg-paper-deep text-center">
        <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">Closest mode</span>
        <span className="ml-2 font-serif font-medium text-vermilion text-[16px]" data-testid="tki-closest">{closest}</span>
      </div>
    </div>
  );
}
