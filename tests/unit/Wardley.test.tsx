import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/wardley";

describe("<Wardley />", () => {
  it("renders one node per item on the canvas", () => {
    render(<View data={sample} />);
    for (let i = 0; i < sample.nodes.length; i++) {
      expect(screen.getByTestId(`wardley-node-${i}`)).toBeInTheDocument();
    }
  });

  it("toggling 'invest' fires onUpdate", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    const cb = screen.getByLabelText(`invest in ${sample.nodes[0]!.name}`) as HTMLInputElement;
    fireEvent.click(cb);
    expect(onUpdate.mock.calls.at(-1)?.[0].nodes[0]?.invest).toBe(true);
  });
});
