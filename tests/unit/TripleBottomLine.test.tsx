import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/triple-bottom-line";

describe("<TripleBottomLine />", () => {
  it("renders all three pillars", () => {
    render(<View data={sample} />);
    for (const p of ["people", "planet", "profit"]) {
      expect(screen.getByTestId(`tbl-${p}`)).toBeInTheDocument();
    }
  });

  it("editing a score fires onUpdate", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    fireEvent.change(screen.getByTestId("tbl-score-profit"), { target: { value: "9" } });
    expect(onUpdate.mock.calls.at(-1)?.[0].pillars.profit.score).toBe(9);
  });
});
