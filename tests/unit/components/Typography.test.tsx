import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

describe("Typography scale (BROADSHEET foundation)", () => {
  it("exposes a heading-masthead class distinct from heading-display", () => {
    const { container } = render(
      <>
        <h1 className="heading-masthead" data-testid="masthead">
          Masthead
        </h1>
        <h1 className="heading-display" data-testid="display">
          Display
        </h1>
      </>
    );
    const masthead = container.querySelector('[data-testid="masthead"]');
    const display = container.querySelector('[data-testid="display"]');
    expect(masthead).toHaveClass("heading-masthead");
    expect(display).toHaveClass("heading-display");
    expect(masthead?.className).not.toBe(display?.className);
  });

  it("exposes a text-voice class for the serif signature device", () => {
    const { getByTestId } = render(
      <span className="text-voice" data-testid="voice">
        the personal clause
      </span>
    );
    expect(getByTestId("voice")).toHaveClass("text-voice");
  });
});
