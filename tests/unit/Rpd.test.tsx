import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/rpd";

describe("<Rpd />", () => {
  it("'execute' verdict when no checks are 'no'", () => {
    render(<View data={sample} />);
    expect(screen.getByTestId("rpd-verdict")).toHaveTextContent(/execute/i);
  });

  it("toggling a check to 'no' switches verdict to 'hold'", () => {
    const onUpdate = vi.fn();
    render(<View data={sample} onUpdate={onUpdate} />);
    const check = screen.getByTestId("rpd-check-0");
    const btn = check.querySelector("button[aria-label^='toggle']") as HTMLButtonElement;
    // current: yes → click → no
    fireEvent.click(btn);
    expect(screen.getByTestId("rpd-verdict")).toHaveTextContent(/hold/i);
  });
});
