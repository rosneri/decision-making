import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { sample, View } from "@/frameworks/nine-box";

describe("<NineBox />", () => {
  it("places Ada in the star cell (2,2)", () => {
    render(<View data={sample} />);
    const star = screen.getByTestId("box-2-2");
    expect(within(star).getByText("Ada")).toBeInTheDocument();
  });

  it("changing performance moves person across the grid", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    fireEvent.change(screen.getByTestId("box-perf-0"), { target: { value: "0" } });
    expect(onUpdate.mock.calls.at(-1)?.[0].people[0].performance).toBe(0);
  });
});
