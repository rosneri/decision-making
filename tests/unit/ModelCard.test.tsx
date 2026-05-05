import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { sample, View } from "@/frameworks/model-card";

describe("<ModelCard />", () => {
  it("renders all card sections with their values", () => {
    render(<View data={sample} />);
    for (const k of Object.keys(sample.fields) as Array<keyof typeof sample.fields>) {
      const node = screen.getByTestId(`mc-${k}`);
      const ta = within(node).getByRole("textbox") as HTMLTextAreaElement;
      expect(ta.value).toBe(sample.fields[k]);
    }
  });

  it("editing the model name fires onUpdate", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    fireEvent.change(screen.getByTestId("mc-model-name"), { target: { value: "v0.4" } });
    expect(onUpdate.mock.calls.at(-1)?.[0].modelName).toBe("v0.4");
  });
});
