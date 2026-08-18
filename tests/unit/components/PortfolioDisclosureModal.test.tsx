import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PortfolioDisclosureModal } from "@/components/layout/PortfolioDisclosureModal";
import { portfolioDisclosureCopy as copy } from "@/data/portfolioDisclosure";

const DISMISSED_KEY = "dgdevworks-portfolio-disclosure-dismissed";

/** Approximates the real root layout's three inertable landmarks. */
function renderWithLayoutSiblings() {
  document.body.innerHTML =
    '<div id="site-header-content"></div><div id="main-content"></div><div id="site-footer-content"></div>';
  const container = document.body.appendChild(document.createElement("div"));
  return render(<PortfolioDisclosureModal />, { container });
}

async function findDialog() {
  // The component opens ~300ms after mount; RTL's default findBy timeout
  // (1000ms) comfortably covers this without needing fake timers.
  const dialog = await screen.findByRole("dialog", { name: copy.heading });
  // The mount effect that sets initial focus on the close button fires
  // asynchronously (post-commit) and can otherwise race with a test's own
  // subsequent focus() calls, silently clobbering them. Settle it first.
  await waitFor(() =>
    expect(within(dialog).getByRole("button", { name: copy.closeButtonAriaLabel })).toHaveFocus()
  );
  return dialog;
}

/** The exit animation (200ms) keeps the dialog mounted briefly after dismissal. */
async function waitForDialogClosed() {
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument(), {
    timeout: 2000,
  });
}

describe("PortfolioDisclosureModal (E1-F4-S2, docs/design-system.md §9)", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    document.body.style.overflow = "";
    window.sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it("does not render immediately on mount (opens after the 300ms settle delay)", () => {
    renderWithLayoutSiblings();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens after the delay when sessionStorage has no dismissal flag", async () => {
    renderWithLayoutSiblings();
    const dialog = await findDialog();
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "portfolio-disclosure-heading");
    expect(dialog).toHaveAttribute("aria-describedby", "portfolio-disclosure-body");
  });

  it("does NOT open when the sessionStorage dismissal flag is already set", async () => {
    window.sessionStorage.setItem(DISMISSED_KEY, "true");
    renderWithLayoutSiblings();

    // Wait past the 300ms open delay to prove it never opens, not just that
    // it hasn't opened yet.
    await new Promise((resolve) => setTimeout(resolve, 400));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the exact copy from docs/design-system.md §9 and a working /contact CTA", async () => {
    renderWithLayoutSiblings();
    const dialog = await findDialog();
    const withinDialog = within(dialog);
    expect(withinDialog.getByText(copy.eyebrow)).toBeInTheDocument();
    expect(withinDialog.getByRole("heading", { name: copy.heading })).toBeInTheDocument();
    expect(withinDialog.getByText(copy.body)).toBeInTheDocument();
    expect(withinDialog.getByRole("button", { name: copy.closeButtonAriaLabel })).toBeInTheDocument();

    const cta = withinDialog.getByRole("link", { name: copy.primaryCtaLabel });
    expect(cta).toHaveAttribute("href", "/contact");
    // Security: plain internal href, no query-string tracking/redirect params.
    expect(cta.getAttribute("href")).not.toMatch(/[?&]/);
  });

  it("sets initial focus on the close (X) button when it opens", async () => {
    renderWithLayoutSiblings();
    // findDialog() itself asserts the close button receives initial focus;
    // re-assert explicitly here to keep this AC's coverage self-documenting.
    const dialog = await findDialog();
    expect(within(dialog).getByRole("button", { name: copy.closeButtonAriaLabel })).toHaveFocus();
  });

  it("is dismissible via the close button and persists the sessionStorage flag", async () => {
    const user = userEvent.setup();
    renderWithLayoutSiblings();
    const dialog = await findDialog();

    await user.click(within(dialog).getByRole("button", { name: copy.closeButtonAriaLabel }));
    await waitForDialogClosed();
    expect(window.sessionStorage.getItem(DISMISSED_KEY)).toBe("true");
  });

  it("is dismissible via Escape and persists the sessionStorage flag", async () => {
    const user = userEvent.setup();
    renderWithLayoutSiblings();
    await findDialog();

    await user.keyboard("{Escape}");
    await waitForDialogClosed();
    expect(window.sessionStorage.getItem(DISMISSED_KEY)).toBe("true");
  });

  it("is dismissible via clicking the backdrop (outside the dialog panel)", async () => {
    const user = userEvent.setup();
    const { container } = renderWithLayoutSiblings();
    await findDialog();

    const backdrop = container.querySelector(".fixed.inset-0.z-\\[60\\]") as HTMLElement;
    expect(backdrop).toBeTruthy();
    await user.click(backdrop);

    await waitForDialogClosed();
    expect(window.sessionStorage.getItem(DISMISSED_KEY)).toBe("true");
  });

  it("does NOT dismiss when clicking inside the dialog panel itself (click-outside only)", async () => {
    const user = userEvent.setup();
    renderWithLayoutSiblings();
    const dialog = await findDialog();

    await user.click(within(dialog).getByText(copy.heading));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("dismisses via the secondary 'Continue browsing' CTA", async () => {
    const user = userEvent.setup();
    renderWithLayoutSiblings();
    const dialog = await findDialog();

    await user.click(within(dialog).getByRole("button", { name: copy.secondaryCtaLabel }));
    await waitForDialogClosed();
    expect(window.sessionStorage.getItem(DISMISSED_KEY)).toBe("true");
  });

  it("traps Tab focus inside the dialog: Tab from the last focusable element wraps to the first", async () => {
    const user = userEvent.setup();
    renderWithLayoutSiblings();
    // findDialog() already waits out the initial-focus mount effect, so this
    // manual re-focus onto the last element can't be clobbered by it.
    const dialog = await findDialog();
    const closeButton = within(dialog).getByRole("button", { name: copy.closeButtonAriaLabel });
    const primaryCta = within(dialog).getByRole("link", { name: copy.primaryCtaLabel });

    primaryCta.focus();
    expect(primaryCta).toHaveFocus();

    await user.tab();
    expect(closeButton).toHaveFocus();
  });

  it("traps Shift+Tab focus inside the dialog: Shift+Tab from the first focusable element wraps to the last", async () => {
    const user = userEvent.setup();
    renderWithLayoutSiblings();
    const dialog = await findDialog();
    const closeButton = within(dialog).getByRole("button", { name: copy.closeButtonAriaLabel });

    closeButton.focus();
    expect(closeButton).toHaveFocus();

    await user.tab({ shift: true });
    expect(document.activeElement).not.toBe(document.body);
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it("inerts and aria-hides all three background landmarks while open, and restores them on close", async () => {
    const user = userEvent.setup();
    renderWithLayoutSiblings();
    const dialog = await findDialog();

    const header = document.getElementById("site-header-content")!;
    const main = document.getElementById("main-content")!;
    const footer = document.getElementById("site-footer-content")!;
    for (const el of [header, main, footer]) {
      expect(el.hasAttribute("inert")).toBe(true);
      expect(el.getAttribute("aria-hidden")).toBe("true");
    }

    await user.click(within(dialog).getByRole("button", { name: copy.closeButtonAriaLabel }));
    // Inert/aria-hidden are released synchronously in the "open" effect's
    // cleanup (not gated by the exit animation), so no extra wait is needed
    // here — unlike the dialog's own removal from the DOM.
    for (const el of [header, main, footer]) {
      expect(el.hasAttribute("inert")).toBe(false);
      expect(el.hasAttribute("aria-hidden")).toBe(false);
    }
  });

  it("locks body scroll while open and restores it on close", async () => {
    const user = userEvent.setup();
    renderWithLayoutSiblings();
    const dialog = await findDialog();
    expect(document.body.style.overflow).toBe("hidden");

    await user.click(within(dialog).getByRole("button", { name: copy.closeButtonAriaLabel }));
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("fails open (still shows the modal) when sessionStorage.getItem throws, e.g. private-mode restrictions", async () => {
    vi.spyOn(window.sessionStorage.__proto__, "getItem").mockImplementation(() => {
      throw new DOMException("access denied", "SecurityError");
    });

    expect(() => renderWithLayoutSiblings()).not.toThrow();
    const dialog = await findDialog();
    expect(dialog).toBeInTheDocument();
  });

  it("does not crash when sessionStorage.setItem throws on dismissal (fails open silently)", async () => {
    const user = userEvent.setup();
    vi.spyOn(window.sessionStorage.__proto__, "setItem").mockImplementation(() => {
      throw new DOMException("access denied", "SecurityError");
    });

    renderWithLayoutSiblings();
    const dialog = await findDialog();

    await expect(
      user.click(within(dialog).getByRole("button", { name: copy.closeButtonAriaLabel }))
    ).resolves.not.toThrow();
    await waitForDialogClosed();
  });
});
