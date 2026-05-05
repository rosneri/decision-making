import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/pugh";

describe("<Pugh />", () => {
  it("computes net = (+) − (−) per concept", () => {
    render(<View data={sample} />);
    // Concept B: +,-,+,-,+ → 3+ 2- → net +1
    expect(screen.getByTestId("pugh-net-0")).toHaveTextContent("+1");
    // Concept D: +,+,-,+,+ → 4+ 1- → net +3
    expect(screen.getByTestId("pugh-net-2")).toHaveTextContent("+3");
  });

  it("clicking a cell cycles +/S/− and changes net", () => {
    render(<View data={sample} />);
    const cell = screen.getByTestId("pugh-cell-0-0"); // Concept B, cost: "+"
    fireEvent.click(cell);
    // "+" → "S" → net drops from +1 to 0
    expect(screen.getByTestId("pugh-net-0")).toHaveTextContent("0");
  });
});
