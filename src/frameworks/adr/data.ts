import { z } from "zod";


export const STATUSES = ["proposed", "accepted", "deprecated", "superseded"] as const;
export type Status = (typeof STATUSES)[number];

export const meta = {
  id: "adr",
  name: "Architecture Decision Record",
  category: "Engineering & systems",
  blurb: "Capture context, decision, consequences, and alternatives — once, durably.",
} as const;

export const schema = z.object({
  framework: z.literal("adr"),
  category: z.string(),
  title: z.string(),
  number: z.string(),
  date: z.string(),
  status: z.enum(STATUSES),
  context: z.string(),
  decision: z.string(),
  consequences: z.string(),
  alternatives: z.array(z.string()).min(0).max(10),
  recommendation: z.string(),
});
export type Adr = z.infer<typeof schema>;

export const sample: Adr = {
  framework: "adr",
  category: meta.category,
  title: "Postgres or DynamoDB for the new service?",
  number: "0042",
  date: "2026-05-04",
  status: "accepted",
  context: "Orders service needs strong consistency on a sub-200k tps tier with rich query needs.",
  decision: "Use Postgres 16; row-level transactions matter more than horizontal scale at this stage.",
  consequences: "+ ACID, mature tooling. − vertical scale ceiling at ~200k tps.",
  alternatives: ["DynamoDB", "Cassandra", "CockroachDB"],
  recommendation: "Accept Postgres now; reopen this ADR if tps approaches the ceiling.",
};

export function getMetrics(d: Adr) {
  return [
    { k: "ADR", v: d.number ? `#${d.number}` : "—" },
    { k: "Status", v: d.status },
  ];
}
