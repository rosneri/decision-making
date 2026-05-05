import { describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { sample, View } from "@/frameworks/wrap";

describe("<Wrap />", () => {
  it("highlights the current step", () => {
    render(<View data={sample} />);
    const current = screen.getByTestId(`wrap-step-${sample.current}`);
    expect(within(current).getByText("→ here")).toBeInTheDocument();
  });

  it("clicking 'set current' on another step moves the marker", () => {
    render(<View data={sample} />);
    fireEvent.click(screen.getByTestId("wrap-set-current-P"));
    const newCurrent = screen.getByTestId("wrap-step-P");
    expect(within(newCurrent).getByText("→ here")).toBeInTheDocument();
  });
});
