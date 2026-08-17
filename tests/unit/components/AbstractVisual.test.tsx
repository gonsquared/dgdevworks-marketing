import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { AbstractVisual } from "@/components/AbstractVisual";
import { caseStudies } from "@/data/caseStudies";

describe("AbstractVisual (never a real screenshot, E3-F2-S1/S2)", () => {
  it("renders an <svg role=img> with an accessible label, not an <img> tag pointing at a raster asset", () => {
    const { container } = render(<AbstractVisual variant="mvp-development" label="Test graphic" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("role", "img");
    expect(svg).toHaveAttribute("aria-label", "Test graphic");
    expect(container.querySelector("img")).not.toBeInTheDocument();
  });

  it("deterministically renders the same pattern for the same slug (stable across renders)", () => {
    const { container: a } = render(<AbstractVisual variant="hardware-brand-partner-portals" />);
    const { container: b } = render(<AbstractVisual variant="hardware-brand-partner-portals" />);
    expect(a.querySelector("svg")?.innerHTML).toBe(b.querySelector("svg")?.innerHTML);
  });

  it("renders a graphic for every case study slug with no crash", () => {
    for (const cs of caseStudies) {
      const { container } = render(<AbstractVisual variant={cs.slug} label={cs.title} />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    }
  });
});
