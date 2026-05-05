import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { View as EisenhowerView } from "@/frameworks/eisenhower";
import type { Eisenhower } from "@/frameworks";

const sample: Eisenhower = {
  framework: "eisenhower",
  category: "Speed & prioritization",
  title: "Today",
  tasks: [
    { text: "Fix prod bug", urgent: true, important: true },
    { text: "Plan roadmap", urgent: false, important: true },
    { text: "Reply spam", urgent: true, important: false },
    { text: "Browse Twitter", urgent: false, important: false },
  ],
  recommendation: "Do the bug.",
};

const quadrant = (key: string) =>
  document.querySelector<HTMLElement>(`[data-quadrant="${key}"]`)!;

describe("<EisenhowerView />", () => {
  it("places each task into the correct quadrant", () => {
    render(<EisenhowerView data={sample} />);
    expect(within(quadrant("do")).getByDisplayValue("Fix prod bug")).toBeInTheDocument();
    expect(within(quadrant("schedule")).getByDisplayValue("Plan roadmap")).toBeInTheDocument();
    expect(within(quadrant("delegate")).getByDisplayValue("Reply spam")).toBeInTheDocument();
    expect(within(quadrant("delete")).getByDisplayValue("Browse Twitter")).toBeInTheDocument();
    expect(screen.getByText("Do First")).toBeInTheDocument();
    expect(screen.getByText("Schedule")).toBeInTheDocument();
    expect(screen.getByText("Delegate")).toBeInTheDocument();
    expect(screen.getByText("Eliminate")).toBeInTheDocument();
  });

  it("toggling 'urgent' moves a task between quadrants", () => {
    const onUpdate = vi.fn();
    render(<EisenhowerView data={sample} onUpdate={onUpdate} />);
    // "Plan roadmap" is in 'schedule' (not urgent, important). Toggle urgent → moves to 'do'.
    expect(within(quadrant("schedule")).getByDisplayValue("Plan roadmap")).toBeInTheDocument();
    const planLi = screen.getByDisplayValue("Plan roadmap").closest("li")!;
    const urgentBtn = planLi.querySelector<HTMLButtonElement>(
      'button[aria-label="toggle urgent"]'
    )!;
    fireEvent.click(urgentBtn);
    expect(within(quadrant("do")).getByDisplayValue("Plan roadmap")).toBeInTheDocument();
    expect(within(quadrant("schedule")).queryByDisplayValue("Plan roadmap")).toBeNull();
    const last = onUpdate.mock.calls.at(-1)?.[0] as Eisenhower;
    expect(last.tasks[1]).toEqual({
      text: "Plan roadmap",
      urgent: true,
      important: true,
    });
  });

  it("editing task text updates the task and emits onUpdate", () => {
    const onUpdate = vi.fn();
    render(<EisenhowerView data={sample} onUpdate={onUpdate} />);
    const input = screen.getByDisplayValue("Fix prod bug");
    fireEvent.change(input, { target: { value: "Fix the bug" } });
    expect(screen.getByDisplayValue("Fix the bug")).toBeInTheDocument();
    const last = onUpdate.mock.calls.at(-1)?.[0] as Eisenhower;
    expect(last.tasks[0]?.text).toBe("Fix the bug");
  });

  it("removing a task drops it from its quadrant", () => {
    render(<EisenhowerView data={sample} />);
    const li = screen.getByDisplayValue("Browse Twitter").closest("li")!;
    const removeBtn = li.querySelector<HTMLButtonElement>(
      'button[aria-label="remove task"]'
    )!;
    fireEvent.click(removeBtn);
    expect(screen.queryByDisplayValue("Browse Twitter")).not.toBeInTheDocument();
  });

  it("adding a task to a quadrant uses that quadrant's urgent/important flags", () => {
    const onUpdate = vi.fn();
    render(<EisenhowerView data={sample} onUpdate={onUpdate} />);
    const addBtn = quadrant("delegate").querySelector<HTMLButtonElement>(
      "button"
    );
    // The add button is the last button in the quadrant; find by text "+ add"
    const allAdd = screen.getAllByText("+ add");
    // delegate is the 3rd quadrant in the rendered order
    fireEvent.click(allAdd[2]!);
    const last = onUpdate.mock.calls.at(-1)?.[0] as Eisenhower;
    const added = last.tasks.at(-1)!;
    expect(added).toEqual({ text: "", urgent: true, important: false });
    // unused suppression
    void addBtn;
  });
});
