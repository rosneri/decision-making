import { z } from "zod";


export const HATS = ["white", "red", "black", "yellow", "green", "blue"] as const;
export type Hat = (typeof HATS)[number];

export const meta = {
  id: "six_hats",
  name: "Six Thinking Hats",
  category: "Group & organizational",
  blurb: "Cycle through six modes — facts, feelings, caution, benefits, creativity, process — one at a time.",
} as const;

export const schema = z.object({
  framework: z.literal("six_hats"),
  category: z.string(),
  title: z.string(),
  hats: z.object({
    white: z.array(z.string()),
    red: z.array(z.string()),
    black: z.array(z.string()),
    yellow: z.array(z.string()),
    green: z.array(z.string()),
    blue: z.array(z.string()),
  }),
  active: z.enum(HATS),
  recommendation: z.string(),
});
export type SixHats = z.infer<typeof schema>;

export const sample: SixHats = {
  framework: "six_hats",
  category: meta.category,
  title: "The team can't agree on the rebrand.",
  hats: {
    white: ["last logo refresh: 2018", "brand survey: 38% recall"],
    red: ["the new mark feels cold", "but it's exciting too"],
    black: ["asset migration cost", "customer confusion"],
    yellow: ["modernizes us", "PR moment"],
    green: ["could phase it: keep wordmark, change palette only"],
    blue: ["hold one meeting per hat — no cross-talk"],
  },
  active: "red",
  recommendation: "Slow down on Black. Spend a session on Green to find a phased option that defuses the Black objections.",
};

export const HAT_META: Record<Hat, { label: string; sub: string }> = {
  white: { label: "White", sub: "facts" },
  red: { label: "Red", sub: "feelings" },
  black: { label: "Black", sub: "caution" },
  yellow: { label: "Yellow", sub: "benefits" },
  green: { label: "Green", sub: "creativity" },
  blue: { label: "Blue", sub: "process" },
};

export function getMetrics(d: SixHats) {
  const counts = (Object.values(d.hats) as string[][]).map((arr) => arr.length);
  const total = counts.reduce((s, n) => s + n, 0);
  const empty = counts.filter((n) => n === 0).length;
  return [
    { k: "Hat", v: d.active },
    { k: "Notes", v: String(total) },
    { k: "Empty hats", v: String(empty) },
  ];
}
