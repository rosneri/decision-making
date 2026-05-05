import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/first-principles";

describe("<FirstPrinciples />", () => {
  it("renders assumption + truths", () => {
    render(<View data={sample} />);
    expect(screen.getByDisplayValue(sample.assumption)).toBeInTheDocument();
    for (const t of sample.truths) expect(screen.getByDisplayValue(t)).toBeInTheDocument();
  });

  it("editing the assumption fires onUpdate", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    fireEvent.change(screen.getByDisplayValue(sample.assumption), { target: { value: "Different" } });
    expect(onUpdate).toHaveBeenCalled();
    expect(onUpdate.mock.calls.at(-1)?.[0].assumption).toBe("Different");
  });
});
