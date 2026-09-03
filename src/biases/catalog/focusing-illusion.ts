import { defineBias } from "../types";

export const bias = defineBias({
  id: "focusing_illusion",
  name: "Focusing illusion",
  family: "framing",
  blurb: "Overrating how much the thing you're thinking about will matter to your life.",
  description:
    "Nothing is as important as it seems while you're thinking about it. Whatever a decision focuses on, income, weather, title, square footage, is inflated in imagined future happiness and then fades into the background once lived with. Big-life decisions are especially prone: the salient factor dominates the choice and barely registers a year later.",
  cues: [
    "One factor (money, location, title, prestige) dominating a decision about overall life or work satisfaction",
    "Imagined future framed around the changed variable and little else",
    "Everyday factors (relationships, commute, sleep, autonomy) absent from the analysis",
  ],
  question: "On an ordinary Tuesday two years from now, how much will this factor be on my mind?",
  counters: [
    "Describe a typical day under each option in full, hour by hour, not just the headline.",
    "Ask people already living with each option how much the focal factor matters to them.",
    "List the things that predict daily satisfaction and check the decision against those.",
  ],
  antidotes: ["ikigai", "odyssey", "regret_min"],
  aka: ["Focalism"],
  source: "Schkade & Kahneman 1998",
});
