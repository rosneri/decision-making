import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/ach";

describe("<Ach />", () => {
  it("highlights hypothesis with fewest inconsistencies", () => {
    render(<View data={sample} />);
    // hypothesis 0 (state actor) has all + → 0 inconsistencies
    expect(screen.getByTestId("ach-inconsist-0")).toHaveTextContent("0");
  });

  it("clicking a cell cycles through + → - → ?", () => {
    render(<View data={sample} />);
    const cell = screen.getByTestId("ach-cell-0-0");
    expect(cell).toHaveTextContent("+");
    fireEvent.click(cell);
    expect(cell).toHaveTextContent("-");
    fireEvent.click(cell);
    expect(cell).toHaveTextContent("?");
  });
});
