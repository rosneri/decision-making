import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/adr";

describe("<Adr />", () => {
  it("renders status and key fields", () => {
    render(<View data={sample} />);
    expect(screen.getByTestId("adr-status")).toHaveValue("accepted");
    expect(screen.getByTestId("adr-context")).toHaveValue(sample.context);
    expect(screen.getByTestId("adr-decision")).toHaveValue(sample.decision);
  });

  it("changing status fires onUpdate", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    fireEvent.change(screen.getByTestId("adr-status"), { target: { value: "deprecated" } });
    expect(onUpdate.mock.calls.at(-1)?.[0].status).toBe("deprecated");
  });
});
