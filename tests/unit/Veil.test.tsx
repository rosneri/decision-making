import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/veil-of-ignorance";

describe("<VeilOfIgnorance />", () => {
  it("identifies the worst-off seat", () => {
    render(<View data={sample} />);
    // sample[2] = "a contractor" with score -4 (lowest)
    expect(screen.getByTestId("veil-worst-score")).toHaveTextContent("-4");
  });

  it("dragging another seat lower changes the worst-off result", () => {
    render(<View data={sample} />);
    fireEvent.change(screen.getByTestId("seat-4-score"), { target: { value: "-5" } });
    expect(screen.getByTestId("veil-worst-score")).toHaveTextContent("-5");
  });
});
