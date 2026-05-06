import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/ikigai";

describe("<Ikigai />", () => {
  it("renders all four pillars", () => {
    render(<View data={sample} />);
    for (const p of ["love", "good", "paidFor", "needs"]) {
      expect(screen.getByTestId(`ikigai-pillar-${p}`)).toBeInTheDocument();
    }
  });

  it("editing the ikigai sentence fires onUpdate", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    const input = screen.getByLabelText("ikigai");
    fireEvent.change(input, { target: { value: "new path" } });
    expect(onUpdate.mock.calls.at(-1)?.[0].ikigai).toBe("new path");
  });
});
