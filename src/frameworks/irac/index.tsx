"use client";
import { useState } from "react";
import { Card, MicroLabel } from "@/components/ui";
import { meta, schema, sample, type Irac, BLOCKS, type Block, META } from "./data";
export { meta, schema, sample };
export type { Irac };

export function View({ data, onUpdate }: { data: Irac; onUpdate?: (d: Irac) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Irac) => { setS(n); onUpdate?.(n); };
  const set = (k: Block, v: string) => upd({ ...s, blocks: { ...s.blocks, [k]: v } });

  return (
    <Card className="divide-y divide-rule">
      {BLOCKS.map((k) => {
        const isApplication = k === "A";
        return (
          <div key={k} data-testid={`irac-${k}`} className={`flex items-stretch ${isApplication ? "bg-vermilion/5" : ""}`}>
            <div className={`w-14 grid place-items-center font-serif font-medium text-[28px] text-paper ${isApplication ? "bg-vermilion" : "bg-ink"}`}>
              {k}
            </div>
            <div className="flex-1 p-4">
              <MicroLabel accent={isApplication} bold>{META[k].word}</MicroLabel>
              <textarea
                value={s.blocks[k]}
                onChange={(e) => set(k, e.target.value)}
                className="block w-full mt-1 font-serif text-[15px] bg-transparent border-none outline-none resize-none text-ink"
                rows={2}
              />
            </div>
          </div>
        );
      })}
    </Card>
  );
}
