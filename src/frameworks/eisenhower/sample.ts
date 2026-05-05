import { meta } from "./meta";
import type { Eisenhower } from "./schema";

export const sample: Eisenhower = {
  framework: "eisenhower",
  category: meta.category,
  title: "This week's tasks",
  tasks: [
    { text: "Fix production bug", urgent: true, important: true },
    { text: "Plan Q3 roadmap", urgent: false, important: true },
    { text: "Reply to recruiter spam", urgent: true, important: false },
    { text: "Browse Twitter", urgent: false, important: false },
    { text: "1:1 with manager", urgent: false, important: true },
    { text: "Order office snacks", urgent: true, important: false },
  ],
  recommendation:
    "Do the production bug now, schedule deep work on the roadmap, delegate the snack run, and stop scrolling.",
};
