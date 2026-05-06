import { z } from "zod";

export const meta = {
  id: "fmea",
  name: "FMEA",
  category: "Engineering & systems",
  blurb: "For each failure: severity × occurrence × detection. Attack the highest RPNs first.",
} as const;

export const schema = z.object({
  framework: z.literal("fmea"),
  category: z.string(),
  title: z.string(),
  system: z.string(),
  modes: z.array(z.object({
    mode: z.string(),
    effect: z.string(),
    severity: z.number().int().min(1).max(10),
    occurrence: z.number().int().min(1).max(10),
    detection: z.number().int().min(1).max(10),
    mitigation: z.string(),
  })).min(2).max(20),
  recommendation: z.string(),
});
export type Fmea = z.infer<typeof schema>;

export const sample: Fmea = {
  framework: "fmea",
  category: meta.category,
  title: "FMEA — checkout payment subsystem",
  system: "Stripe checkout flow",
  modes: [
    { mode: "API timeout", effect: "Order lost; revenue impact", severity: 9, occurrence: 4, detection: 3, mitigation: "Idempotent retries + dead-letter queue" },
    { mode: "Webhook duplicate", effect: "Double-charge", severity: 10, occurrence: 3, detection: 6, mitigation: "Idempotency key on PaymentIntent" },
    { mode: "3DS failure", effect: "Cart abandon", severity: 5, occurrence: 6, detection: 2, mitigation: "Retry path with bank fallback" },
    { mode: "Currency mismatch", effect: "Refund + complaint", severity: 7, occurrence: 2, detection: 4, mitigation: "Schema validation at boundary" },
  ],
  recommendation: "Webhook duplicate (RPN=180) and API timeout (RPN=108) are top risks. Idempotency keys are the highest-leverage fix.",
};

export function rpn(m: Fmea["modes"][number]) {
  return m.severity * m.occurrence * m.detection;
}

export function getMetrics(d: Fmea) {
  const top = d.modes.map((m) => ({ m, rpn: rpn(m) })).sort((a, b) => b.rpn - a.rpn)[0];
  return [
    { k: "Top RPN", v: String(top?.rpn ?? 0) },
    { k: "Mode", v: top?.m.mode ?? "" },
  ];
}
