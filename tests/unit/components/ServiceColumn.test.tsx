import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ServiceColumn } from "@/components/ui/ServiceColumn";

describe("ServiceColumn primitive (columnar counterpart to IndexRow)", () => {
  it("renders as a single link containing the index, title, and meta", () => {
    render(
      <ServiceColumn
        href="/services/mvp-development"
        index="01"
        title="MVP / Product Build"
        meta="Starting at $8,400"
      />
    );
    const link = screen.getByRole("link", { name: /MVP \/ Product Build/ });
    expect(link).toHaveAttribute("href", "/services/mvp-development");
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("Starting at $8,400")).toBeInTheDocument();
  });

  it("contains no nested interactive elements (the whole column is one link)", () => {
    const { container } = render(<ServiceColumn href="/services/x" index="01" title="Title" />);
    const link = container.querySelector("a");
    expect(link?.querySelector("a")).toBeNull();
    expect(link?.querySelector("button")).toBeNull();
  });

  it("omits the meta text when not provided", () => {
    render(<ServiceColumn href="/services/x" index="02" title="Title" />);
    expect(screen.queryByText(/Starting at/)).not.toBeInTheDocument();
  });

  it("renders the title as an h3 by default, or an h2 when headingLevel={2} is set", () => {
    const { rerender } = render(<ServiceColumn href="/services/x" index="01" title="Default Heading" />);
    expect(screen.getByRole("heading", { level: 3, name: "Default Heading" })).toBeInTheDocument();

    rerender(<ServiceColumn href="/services/x" index="01" title="Default Heading" headingLevel={2} />);
    expect(screen.getByRole("heading", { level: 2, name: "Default Heading" })).toBeInTheDocument();
  });
});
