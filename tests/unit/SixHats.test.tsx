import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/six-hats";

describe("<SixHats />", () => {
  it("shows the active hat's notes", () => {
    render(<View data={sample} />);
    const panel = screen.getByTestId(`hat-panel-${sample.active}`);
    for (const item of sample.hats[sample.active] ?? []) {
      expect(panel.querySelector(`input[value="${item}"]`)).toBeTruthy();
    }
  });

  it("clicking another hat tab switches the active panel", () => {
    render(<View data={sample} />);
    fireEvent.click(screen.getByTestId("hat-tab-green"));
    expect(screen.getByTestId("hat-panel-green")).toBeInTheDocument();
  });
});
