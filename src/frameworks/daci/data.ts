import { z } from "zod";

export const ROLES = ["driver", "approver", "contributors", "informed"] as const;
export type Role = (typeof ROLES)[number];

export const meta = {
  id: "daci",
  name: "DACI",
  category: "Group & organizational",
  blurb: "One Driver, one Approver, many Contributors and Informed. Roles, not committees.",
} as const;

export const schema = z.object({
  framework: z.literal("daci"),
  category: z.string(),
  title: z.string(),
  decision: z.string(),
  driver: z.string(),
  approver: z.string(),
  contributors: z.array(z.string()).min(1).max(10),
  informed: z.array(z.string()).min(0).max(20),
  deadline: z.string(),
  recommendation: z.string(),
});
export type Daci = z.infer<typeof schema>;

export const sample: Daci = {
  framework: "daci",
  category: meta.category,
  title: "Pick the Q3 pricing model",
  decision: "Choose between usage-based vs. seat-based pricing for Q3 launch",
  driver: "Maya (PM)",
  approver: "Hugo (CEO)",
  contributors: ["Finance", "Sales", "Product Marketing", "Eng Lead"],
  informed: ["Customer Success", "Board", "Existing customers"],
  deadline: "2026-06-01",
  recommendation: "Single Driver (Maya) coordinates; single Approver (Hugo) decides. Avoid committee paralysis.",
};

export function getMetrics(d: Daci) {
  return [
    { k: "Driver", v: d.driver },
    { k: "Approver", v: d.approver },
    { k: "By", v: d.deadline },
  ];
}
