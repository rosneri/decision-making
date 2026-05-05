import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { sample, View } from "@/frameworks/batna";

describe("<Batna />", () => {
  it("renders a ZOPA band when yours < theirs", () => {
    render(<View data={sample} />);
    expect(screen.getByTestId("batna-zopa")).toBeInTheDocument();
  });

  it("flags 'no ZOPA' when your floor > their ceiling", () => {
    render(<View data={sample} />);
    fireEvent.change(screen.getByTestId("batna-yourBatna-value"), { target: { value: "200" } });
    expect(screen.getByTestId("batna-no-zopa")).toBeInTheDocument();
  });
});
