"use client";

import { InlineText } from "./InlineInput";
import { RemoveButton, AddButton } from "./Buttons";

export function EditableList({
  items,
  onChangeItem,
  onRemove,
  onAdd,
  placeholder,
  addLabel = "+ add",
  indexStyle = "dot",
  testIdPrefix,
  itemAriaLabel,
}: {
  items: string[];
  onChangeItem: (idx: number, value: string) => void;
  onRemove: (idx: number) => void;
  onAdd: () => void;
  placeholder?: string;
  addLabel?: string;
  indexStyle?: "dot" | "numeric" | "none";
  testIdPrefix?: string;
  itemAriaLabel?: (idx: number) => string;
}) {
  return (
    <>
      <ul className="list-none p-0 m-0 flex flex-col">
        {items.map((t, i) => (
          <li
            key={i}
            {...(testIdPrefix ? { "data-testid": `${testIdPrefix}-${i}` } : {})}
            className={`flex gap-3 items-center py-2.5 ${i > 0 ? "border-t border-rule" : "pt-1"} group`}
          >
            {indexStyle !== "none" && (
              <span className="font-code text-[11px] text-ink-muted flex-shrink-0 w-[18px]">
                {indexStyle === "dot" ? `·${String(i + 1).padStart(2, "0")}` : `${i + 1}.`}
              </span>
            )}
            <InlineText
              value={t}
              onChange={(v) => onChangeItem(i, v)}
              {...(placeholder ? { placeholder } : {})}
              {...(itemAriaLabel ? { ariaLabel: itemAriaLabel(i) } : {})}
            />
            <RemoveButton onClick={() => onRemove(i)} showOnHover />
          </li>
        ))}
      </ul>
      <AddButton onClick={onAdd} className="mt-auto pt-3 self-start">
        {addLabel}
      </AddButton>
    </>
  );
}
