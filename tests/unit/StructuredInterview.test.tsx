import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/structured-interview";

describe("<StructuredInterview />", () => {
  it("computes per-candidate average correctly", () => {
    render(<View data={sample} />);
    // Aria: (4+3+5+4)/4 = 4.0
    expect(screen.getByTestId("si-avg-0")).toHaveTextContent("4.0");
  });

  it("editing a score updates the average", () => {
    render(<View data={sample} />);
    fireEvent.change(screen.getByTestId("si-score-0-0"), { target: { value: "1" } });
    // (1+3+5+4)/4 = 3.25 → 3.3
    expect(screen.getByTestId("si-avg-0")).toHaveTextContent("3.3");
  });
});
