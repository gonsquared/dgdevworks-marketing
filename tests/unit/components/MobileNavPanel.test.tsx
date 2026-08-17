import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

import { MobileNavPanel } from "@/components/layout/MobileNavPanel";

function Harness({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = createRef<HTMLButtonElement>();
  return (
    <>
      <button ref={ref} type="button">
        trigger
      </button>
      <MobileNavPanel open={open} onClose={onClose} triggerRef={ref} />
    </>
  );
}

describe("MobileNavPanel (E1-F3-S2, docs/design-system.md §5/§7)", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="main-content"></div>';
  });

  afterEach(() => {
    document.body.style.overflow = "";
  });

  it("renders as a proper dialog with role=dialog, aria-modal=true, and an accessible label when open", () => {
    render(<Harness open onClose={() => {}} />, { container: document.body.appendChild(document.createElement("div")) });
    const dialog = screen.getByRole("dialog", { name: "Site navigation" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("renders nothing when closed", () => {
    render(<Harness open={false} onClose={() => {}} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("inerts and aria-hides the background main content while open, and restores it on close", () => {
    const { rerender } = render(<Harness open onClose={() => {}} />);
    const main = document.getElementById("main-content")!;
    expect(main.hasAttribute("inert")).toBe(true);
    expect(main.getAttribute("aria-hidden")).toBe("true");

    rerender(<Harness open={false} onClose={() => {}} />);
    expect(main.hasAttribute("inert")).toBe(false);
    expect(main.hasAttribute("aria-hidden")).toBe(false);
  });

  it("locks body scroll while open", () => {
    render(<Harness open onClose={() => {}} />);
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("Escape closes the panel and returns focus to the trigger button", async () => {
    const onClose = vi.fn();
    render(<Harness open onClose={onClose} />);

    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "trigger" })).toHaveFocus();
  });

  it("repeats all 6 nav links plus both CTAs ('Book a call' primary, 'Send a message' secondary)", () => {
    render(<Harness open onClose={() => {}} />);
    const nav = screen.getByRole("navigation", { name: "Mobile" });
    expect(nav.querySelectorAll("a")).toHaveLength(6);
    expect(screen.getByRole("link", { name: "Book a call" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Send a message" })).toHaveAttribute("href", "/contact");
  });

  it("close (X) button has an accessible name", () => {
    render(<Harness open onClose={() => {}} />);
    expect(screen.getByRole("button", { name: "Close navigation menu" })).toBeInTheDocument();
  });

  it("traps Tab focus inside the panel: Tab from the last focusable element wraps to the first", async () => {
    render(<Harness open onClose={() => {}} />);
    const closeButton = screen.getByRole("button", { name: "Close navigation menu" });
    const sendMessageLink = screen.getByRole("link", { name: "Send a message" });

    sendMessageLink.focus();
    expect(sendMessageLink).toHaveFocus();

    await userEvent.tab();
    expect(closeButton).toHaveFocus();
  });

  it("traps Shift+Tab focus inside the panel: Shift+Tab from the first focusable element wraps to the last", async () => {
    render(<Harness open onClose={() => {}} />);
    const closeButton = screen.getByRole("button", { name: "Close navigation menu" });
    closeButton.focus();
    expect(closeButton).toHaveFocus();

    await userEvent.tab({ shift: true });
    expect(document.activeElement).not.toBe(document.body);
  });
});
