import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/design-thinking";

describe("<DesignThinking />", () => {
  it("shows the current stage's notes by default", () => {
    render(<View data={sample} />);
    expect(screen.getByTestId("dt-current-notes")).toHaveValue(sample.notes[sample.current] ?? "");
  });

  it("clicking a tab switches the panel content", () => {
    render(<View data={sample} />);
    fireEvent.click(screen.getByTestId("dt-tab-empathize"));
    expect(screen.getByTestId("dt-current-notes")).toHaveValue(sample.notes.empathize ?? "");
  });
});
