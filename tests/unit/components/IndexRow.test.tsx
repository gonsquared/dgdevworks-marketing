import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { IndexRow } from "@/components/ui/IndexRow";

describe("IndexRow primitive (BROADSHEET foundation)", () => {
  it("renders as a single link containing the index, title, summary, and meta", () => {
    render(
      <IndexRow
        href="/services/mvp-development"
        index="01"
        title="MVP / Product Build"
        summary="A full-stack build from idea to shipped product."
        meta="Starting at $8,400"
      />
    );
    const link = screen.getByRole("link", { name: /MVP \/ Product Build/ });
    expect(link).toHaveAttribute("href", "/services/mvp-development");
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("A full-stack build from idea to shipped product.")).toBeInTheDocument();
    expect(screen.getByText("Starting at $8,400")).toBeInTheDocument();
  });

  it("contains no nested interactive elements (the whole row is one link)", () => {
    const { container } = render(
      <IndexRow href="/work/bank-platform-modernization" index="01" title="Bank Platform" summary="…" />
    );
    const link = container.querySelector("a");
    expect(link?.querySelector("a")).toBeNull();
    expect(link?.querySelector("button")).toBeNull();
  });

  it("omits the meta text when not provided", () => {
    render(<IndexRow href="/work/x" index="02" title="Title" summary="Summary text" />);
    expect(screen.queryByText(/Starting at/)).not.toBeInTheDocument();
  });
});
