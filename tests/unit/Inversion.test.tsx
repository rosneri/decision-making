import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/inversion";

describe("<Inversion />", () => {
  it("renders all failure modes", () => {
    render(<View data={sample} />);
    for (const m of sample.failureModes) expect(screen.getByDisplayValue(m)).toBeInTheDocument();
  });

  it("removing a failure mode emits onUpdate without it", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    const first = screen.getByDisplayValue(sample.failureModes[0]!);
    const li = first.closest("li")!;
    fireEvent.click(li.querySelector("button[aria-label='remove failure']") as HTMLButtonElement);
    expect(onUpdate.mock.calls.at(-1)?.[0].failureModes).not.toContain(sample.failureModes[0]);
  });
});
