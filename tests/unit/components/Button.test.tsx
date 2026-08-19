import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/Button";

describe("Button primitive (E1-F3-S4)", () => {
  it("renders as a <button> when no href is given, and fires onClick", async () => {
    const onClick = vi.fn();
    render(
      <Button variant="solid" onClick={onClick}>
        Send message
      </Button>
    );
    const btn = screen.getByRole("button", { name: "Send message" });
    await userEvent.click(btn);
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("renders as a next/link for internal hrefs (no target/rel needed)", () => {
    render(
      <Button href="/contact" variant="outline">
        Send a message
      </Button>
    );
    const link = screen.getByRole("link", { name: "Send a message" });
    expect(link).toHaveAttribute("href", "/contact");
    expect(link).not.toHaveAttribute("target");
  });

  it("external links always render with target=_blank and rel=noopener noreferrer (security requirement)", () => {
    render(
      <Button href="https://cal.com/dgdevworks/placeholder" external variant="solid">
        Book a call
      </Button>
    );
    const link = screen.getByRole("link", { name: "Book a call" });
    expect(link).toHaveAttribute("href", "https://cal.com/dgdevworks/placeholder");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("disabled button state prevents interaction", async () => {
    const onClick = vi.fn();
    render(
      <Button variant="solid" disabled onClick={onClick}>
        Sending…
      </Button>
    );
    const btn = screen.getByRole("button", { name: "Sending…" });
    expect(btn).toBeDisabled();
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("submit type is passed through for use inside forms", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button", { name: "Submit" })).toHaveAttribute("type", "submit");
  });

  it("does not apply the retired accent glow shadow, and uses the near-square BROADSHEET radius", () => {
    render(
      <Button variant="solid" href="/contact">
        Send a message
      </Button>
    );
    const link = screen.getByRole("link", { name: "Send a message" });
    expect(link.className).not.toContain("shadow-[var(--shadow-glow-accent)]");
    expect(link).toHaveClass("rounded-[3px]");
  });
});
