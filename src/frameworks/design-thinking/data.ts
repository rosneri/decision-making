import { z } from "zod";


export const STAGES = ["empathize", "define", "ideate", "prototype", "test"] as const;
export type Stage = (typeof STAGES)[number];

export const meta = {
  id: "design_thinking",
  name: "Design Thinking",
  category: "Innovation & creativity",
  blurb: "Empathize, Define, Ideate, Prototype, Test. Diverge then converge — and loop back.",
} as const;

export const schema = z.object({
  framework: z.literal("design_thinking"),
  category: z.string(),
  title: z.string(),
  notes: z.object({
    empathize: z.string(),
    define: z.string(),
    ideate: z.string(),
    prototype: z.string(),
    test: z.string(),
  }),
  current: z.enum(STAGES),
  recommendation: z.string(),
});
export type DesignThinking = z.infer<typeof schema>;

export const sample: DesignThinking = {
  framework: "design_thinking",
  category: meta.category,
  title: "Why aren't seniors using our banking app?",
  notes: {
    empathize: "5 home interviews; eyesight + screen contrast keep coming up",
    define: "seniors avoid the app because anything financial that's hard to read feels unsafe",
    ideate: "huge text, audio confirms, simple home, side-cards by need",
    prototype: "",
    test: "",
  },
  current: "ideate",
  recommendation: "You've ideated long enough. Build one tiny prototype — 'audio confirm' — and watch 5 seniors use it.",
};

export const META: Record<Stage, { label: string }> = {
  empathize: { label: "Empathize" },
  define: { label: "Define" },
  ideate: { label: "Ideate" },
  prototype: { label: "Prototype" },
  test: { label: "Test" },
};
