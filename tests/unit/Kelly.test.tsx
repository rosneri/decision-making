import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/kelly";

describe("<Kelly />", () => {
  it("computes full Kelly fraction (b·p − q)/b", () => {
    render(<View data={sample} />);
    // (2*0.55 - 0.45)/2 = 0.325 → 32.5%
    expect(screen.getByTestId("kelly-full")).toHaveTextContent("32.5%");
  });

  it("dropping p below break-even gives zero wager", () => {
    render(<View data={sample} />);
    fireEvent.change(screen.getByTestId("kelly-pWin"), { target: { value: "0.30" } });
    // (2*0.30 - 0.70)/2 = -0.05 → clamped to 0
    expect(screen.getByTestId("kelly-full")).toHaveTextContent("0.0%");
    expect(screen.getByTestId("kelly-wager")).toHaveTextContent("$0");
  });
});
