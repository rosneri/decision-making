import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { sample, View } from "@/frameworks/rice";

describe("<Rice />", () => {
  it("computes (R*I*C)/E and marks the highest-scoring item", () => {
    render(<View data={sample} />);
    // Mobile push: 12000*1*0.9/2 = 5400 — highest in sample
    const winnerRow = screen.getByTestId("rice-row-1"); // index 1 = Mobile push
    expect(within(winnerRow).getByTestId("rice-score-1")).toHaveTextContent("5,400");
    expect(within(winnerRow).getByText("★")).toBeInTheDocument();
  });

  it("editing reach updates the score", () => {
    render(<View data={sample} />);
    const row0 = screen.getByTestId("rice-row-0");
    const reach = within(row0).getAllByRole("spinbutton")[0]!;
    fireEvent.change(reach, { target: { value: "20000" } });
    // 20000*3*0.8/4 = 12000
    expect(screen.getByTestId("rice-score-0")).toHaveTextContent("12,000");
  });
});
