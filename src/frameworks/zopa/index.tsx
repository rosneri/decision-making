"use client";
import { useState } from "react";
import { Card, MicroLabel, InlineText } from "@/components/ui";
import { meta, schema, sample, zopa, type Zopa } from "./data";
export { meta, schema, sample };
export type { Zopa };

export function View({ data, onUpdate }: { data: Zopa; onUpdate?: (d: Zopa) => void }) {
  const [s, setS] = useState(data);
  const upd = (n: Zopa) => { setS(n); onUpdate?.(n); };
  const z = zopa(s);
  const min = Math.min(s.buyer.target, s.seller.target, z.lo, z.hi);
  const max = Math.max(s.buyer.target, s.seller.target, z.lo, z.hi);
  const span = Math.max(1, max - min);
  const pos = (v: number) => `${((v - min) / span) * 100}%`;

  return (
    <Card>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-rule">
        <div data-testid="zopa-buyer" className="p-4">
          <MicroLabel>Buyer</MicroLabel>
          <InlineText value={s.buyer.name} onChange={(v) => upd({ ...s, buyer: { ...s.buyer, name: v } })} className="block w-full mt-1 font-medium" />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label>
              <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">target</span>
              <input
                type="number"
                value={s.buyer.target}
                onChange={(e) => upd({ ...s, buyer: { ...s.buyer, target: Number(e.target.value) || 0 } })}
                data-testid="zopa-buyer-target"
                className="block w-full font-code text-[14px] bg-transparent border-b border-rule outline-none"
              />
            </label>
            <label>
              <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">walk-away (max)</span>
              <input
                type="number"
                value={s.buyer.walkaway}
                onChange={(e) => upd({ ...s, buyer: { ...s.buyer, walkaway: Number(e.target.value) || 0 } })}
                data-testid="zopa-buyer-walk"
                className="block w-full font-code text-[14px] bg-transparent border-b border-rule outline-none"
              />
            </label>
          </div>
        </div>
        <div data-testid="zopa-seller" className="p-4">
          <MicroLabel>Seller</MicroLabel>
          <InlineText value={s.seller.name} onChange={(v) => upd({ ...s, seller: { ...s.seller, name: v } })} className="block w-full mt-1 font-medium" />
          <div className="mt-3 grid grid-cols-2 gap-3">
            <label>
              <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">target</span>
              <input
                type="number"
                value={s.seller.target}
                onChange={(e) => upd({ ...s, seller: { ...s.seller, target: Number(e.target.value) || 0 } })}
                data-testid="zopa-seller-target"
                className="block w-full font-code text-[14px] bg-transparent border-b border-rule outline-none"
              />
            </label>
            <label>
              <span className="font-code text-[10px] tracking-[0.22em] uppercase text-ink-muted">walk-away (min)</span>
              <input
                type="number"
                value={s.seller.walkaway}
                onChange={(e) => upd({ ...s, seller: { ...s.seller, walkaway: Number(e.target.value) || 0 } })}
                data-testid="zopa-seller-walk"
                className="block w-full font-code text-[14px] bg-transparent border-b border-rule outline-none"
              />
            </label>
          </div>
        </div>
      </div>
      <div className="border-t border-rule p-6">
        <MicroLabel accent bold>Zone of Possible Agreement</MicroLabel>
        <div className="relative mt-4 h-12 border-t border-b border-rule">
          {z.exists && (
            <div
              data-testid="zopa-zone"
              className="absolute inset-y-0 bg-vermilion/20 border-x border-vermilion"
              style={{ left: pos(z.lo), width: `calc(${pos(z.hi)} - ${pos(z.lo)})` }}
            />
          )}
          <div className="absolute -top-2 -translate-x-1/2 font-code text-[10px] text-ink-muted" style={{ left: pos(s.buyer.target) }}>
            ▼ buyer
          </div>
          <div className="absolute -bottom-5 -translate-x-1/2 font-code text-[10px] text-ink-muted" style={{ left: pos(s.seller.target) }}>
            ▲ seller
          </div>
        </div>
        <p className="mt-6 font-serif text-[16px] text-center" data-testid="zopa-summary">
          {z.exists
            ? <>ZOPA: <span className="text-vermilion font-medium">{s.unit}{z.lo.toLocaleString()}</span> – <span className="text-vermilion font-medium">{s.unit}{z.hi.toLocaleString()}</span></>
            : <span className="text-ink-muted">No overlap — no deal at price alone.</span>}
        </p>
      </div>
    </Card>
  );
}
