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

describe("Section/Container primitives (BROADSHEET foundation)", () => {
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

  it("Container centers content with the widened 1280px max-width class", () => {
    render(<Container data-testid="container">content</Container>);
    expect(screen.getByTestId("container")).toHaveClass("max-w-[1280px]");
  });

  it("size prop selects the vertical rhythm gear (defaults to default)", () => {
    const { rerender } = render(<Section data-testid="section">x</Section>);
    expect(screen.getByTestId("section")).toHaveClass("py-20");

    rerender(
      <Section size="tight" data-testid="section">
        x
      </Section>
    );
    expect(screen.getByTestId("section")).toHaveClass("py-12");

    rerender(
      <Section size="loose" data-testid="section">
        x
      </Section>
    );
    expect(screen.getByTestId("section")).toHaveClass("py-28");
  });

  it("rule prop renders full-bleed hairline rules at the section boundary", () => {
    const { rerender } = render(
      <Section rule="top" data-testid="section">
        x
      </Section>
    );
    expect(screen.getByTestId("section")).toHaveClass("border-t", "border-rule");
    expect(screen.getByTestId("section")).not.toHaveClass("border-b");

    rerender(
      <Section rule="both" data-testid="section">
        x
      </Section>
    );
    expect(screen.getByTestId("section")).toHaveClass("border-t", "border-b", "border-rule");
  });

  it("bleed prop spans the section full-bleed while insetting content to the container width", () => {
    render(
      <Section bleed data-testid="section">
        <p>Bled content</p>
      </Section>
    );
    const section = screen.getByTestId("section");
    expect(section).toHaveClass("grid", "grid-cols-[1fr_min(1280px,100%)_1fr]");
    expect(screen.getByText("Bled content").closest("div")).toHaveClass("col-start-2", "col-end-3");
  });

  it("rail prop renders an IndexRail with the given number and label", () => {
    render(
      <Section rail={{ number: "03", label: "PRICING" }} data-testid="section">
        <p>Section body</p>
      </Section>
    );
    expect(screen.getByText("03")).toBeInTheDocument();
    expect(screen.getByText("PRICING")).toBeInTheDocument();
    expect(screen.getByText("Section body")).toBeInTheDocument();
  });

  it("renders no rail content when the rail prop is omitted", () => {
    render(
      <Section data-testid="section">
        <p>Section body</p>
      </Section>
    );
    expect(screen.queryByText(/^\d{2}$/)).not.toBeInTheDocument();
  });
});
