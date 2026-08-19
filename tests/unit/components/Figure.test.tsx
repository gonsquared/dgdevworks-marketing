import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Figure } from "@/components/ui/Figure";

describe("Figure primitive (BROADSHEET foundation, replaces AbstractVisual)", () => {
  it("phase-track renders each step as real, ordered text content", () => {
    render(
      <Figure
        variant="phase-track"
        steps={["Discovery & scoping", "Build & iterate", "Launch", "Handoff"]}
      />
    );
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(4);
    expect(screen.getByText("Discovery & scoping")).toBeInTheDocument();
    expect(screen.getByText("Handoff")).toBeInTheDocument();
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("04")).toBeInTheDocument();
  });

  it("impact-bar renders the label and both before/after values as real text, with the SVG hidden from assistive tech", () => {
    const { container } = render(
      <Figure
        variant="impact-bar"
        label="Query performance"
        beforeLabel="Before"
        beforeValue={100}
        afterLabel="After"
        afterValue={140}
      />
    );
    expect(screen.getByText("Query performance")).toBeInTheDocument();
    expect(screen.getByText("Before")).toBeInTheDocument();
    expect(screen.getByText("After")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("140")).toBeInTheDocument();
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("scope-band renders the label and formatted range as real text, with the SVG hidden from assistive tech", () => {
    const { container } = render(
      <Figure
        variant="scope-band"
        label="MVP / Product Build"
        axisMin={0}
        axisMax={20000}
        rangeMin={8000}
        rangeMax={12000}
        formatValue={(v) => `$${v.toLocaleString()}`}
      />
    );
    expect(screen.getByText("MVP / Product Build")).toBeInTheDocument();
    expect(screen.getByText("$8,000–$12,000")).toBeInTheDocument();
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });
});
