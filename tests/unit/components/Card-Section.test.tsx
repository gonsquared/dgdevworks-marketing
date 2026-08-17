import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "@/components/ui/Card";
import { Section, Container } from "@/components/ui/Section";

describe("Card primitive (E1-F3-S4)", () => {
  it("renders children and applies the bracket variant class only when requested", () => {
    const { container, rerender } = render(<Card>Plain content</Card>);
    expect(screen.getByText("Plain content")).toBeInTheDocument();
    expect(container.firstChild).not.toHaveClass("card-bracket");

    rerender(<Card bracket>Bracketed content</Card>);
    expect(container.firstChild).toHaveClass("card-bracket");
  });
});

describe("Section/Container primitives (E1-F3-S4)", () => {
  it("Section wraps children in a Container by default", () => {
    render(
      <Section data-testid="section">
        <p>Body</p>
      </Section>
    );
    expect(screen.getByTestId("section").querySelector("div.mx-auto")).toBeInTheDocument();
  });

  it("Section skips the Container wrapper when bare is set", () => {
    render(
      <Section bare data-testid="section">
        <p>Body</p>
      </Section>
    );
    expect(screen.getByTestId("section").querySelector("div.mx-auto")).not.toBeInTheDocument();
  });

  it("Container centers content with a max-width class", () => {
    render(<Container data-testid="container">content</Container>);
    expect(screen.getByTestId("container")).toHaveClass("max-w-[1200px]");
  });
});
