"use client";

import { useFrameworkData } from "@/components/DecisionContext";
import { QuadrantBoard, EditableList, type Quadrant } from "@/components/ui";
import type { Swot } from "./schema";

interface Props {
  data: Swot;
  onUpdate?: (d: Swot) => void;
}

type QuadKey = "strengths" | "weaknesses" | "opportunities" | "threats";

const QUADRANTS: (Quadrant & { key: QuadKey })[] = [
  { key: "strengths",     roman: "I",   label: "Strengths",     sub: "internal · helpful", position: 0, placeholder: "What you bring." },
  { key: "weaknesses",    roman: "II",  label: "Weaknesses",    sub: "internal · harmful", position: 1, placeholder: "What you lack." },
  { key: "opportunities", roman: "III", label: "Opportunities", sub: "external · helpful", position: 2, placeholder: "What's open to you." },
  { key: "threats",       roman: "IV",  label: "Threats",       sub: "external · harmful", position: 3, placeholder: "What could go wrong." },
];

export function View({ data, onUpdate }: Props) {
  const [state, update] = useFrameworkData<Swot>(data, onUpdate);

  const updateItem = (key: QuadKey, idx: number, text: string) =>
    update({ ...state, [key]: state[key].map((t, i) => i === idx ? text : t) });

  const removeItem = (key: QuadKey, idx: number) =>
    update({ ...state, [key]: state[key].filter((_, i) => i !== idx) });

  const addItem = (key: QuadKey) =>
    update({ ...state, [key]: [...state[key], ""] });

  return (
    <QuadrantBoard
      axes={{ top: "Helpful", bottom: "Harmful", left: "Internal", right: "External" }}
      quadrants={QUADRANTS}
      renderBody={(q) => {
        const key = q.key as QuadKey;
        return (
          <EditableList
            items={state[key]}
            onChangeItem={(i, v) => updateItem(key, i, v)}
            onRemove={(i) => removeItem(key, i)}
            onAdd={() => addItem(key)}
            {...(q.placeholder ? { placeholder: q.placeholder } : {})}
          />
        );
      }}
    />
  );
}
