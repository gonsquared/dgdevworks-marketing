import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Surface } from "@/components/ui/Surface";
import { Section, Container } from "@/components/ui/Section";

describe("Surface primitive (BROADSHEET foundation, replaces Card)", () => {
  it("defaults to the plain variant: no panel border/radius classes", () => {
    const { container } = render(<Surface>Plain content</Surface>);
    expect(screen.getByText("Plain content")).toBeInTheDocument();
    expect(container.firstChild).not.toHaveClass("rounded-[3px]");
    expect(container.firstChild).toHaveClass("border-t");
  });

  it("panel variant renders a bordered, rounded, padded box", () => {
    render(<Surface variant="panel">Panel content</Surface>);
    const el = screen.getByText("Panel content");
    expect(el).toHaveClass("rounded-[3px]");
    expect(el).toHaveClass("border");
    expect(el).toHaveClass("bg-surface");
  });

  it("inverted variant renders a sunken background box", () => {
    render(<Surface variant="inverted">Inverted content</Surface>);
    expect(screen.getByText("Inverted content")).toHaveClass("bg-surface-sunken");
  });

  it("no longer accepts a bracket prop (card-bracket class is gone from the API)", () => {
    const { container } = render(<Surface variant="panel">Content</Surface>);
    expect(container.firstChild).not.toHaveClass("card-bracket");
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
