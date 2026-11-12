import { describe, it, expect, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PrivacyPolicyLink } from "@/components/PrivacyPolicyModal";
import { business } from "@/data/business";

function renderWithLandmarks(ui: React.ReactElement) {
  return render(
    <>
      <header id="site-header-content" />
      <main id="main-content">{ui}</main>
      <footer id="site-footer-content" />
    </>
  );
}

afterEach(() => {
  window.history.replaceState(null, "", "/");
});

describe("PrivacyPolicyModal / PrivacyPolicyLink", () => {
  it("is closed by default and opens a labelled modal dialog with the full policy on click", async () => {
    renderWithLandmarks(<PrivacyPolicyLink />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Privacy Policy" }));

    const dialog = await screen.findByRole("dialog", { name: "Privacy Policy" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByRole("heading", { name: "Who is responsible for your data" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Your rights" })).toBeInTheDocument();
    expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: business.contactEmail })).toHaveAttribute(
      "href",
      `mailto:${business.contactEmail}`
    );
  });

  it("moves focus to the close button, inerts the background, and is portalled outside <main>", async () => {
    renderWithLandmarks(<PrivacyPolicyLink />);
    await userEvent.click(screen.getByRole("button", { name: "Privacy Policy" }));

    const dialog = await screen.findByRole("dialog");
    expect(screen.getByRole("button", { name: "Close privacy policy" })).toHaveFocus();
    expect(document.getElementById("main-content")).toHaveAttribute("inert");
    expect(document.getElementById("site-footer-content")).toHaveAttribute("inert");
    expect(document.getElementById("main-content")?.contains(dialog)).toBe(false);
  });

  it("closes on Escape, releases inert, and returns focus to the trigger", async () => {
    renderWithLandmarks(<PrivacyPolicyLink />);
    const trigger = screen.getByRole("button", { name: "Privacy Policy" });
    await userEvent.click(trigger);
    await screen.findByRole("dialog");

    await userEvent.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(document.getElementById("main-content")).not.toHaveAttribute("inert");
    expect(trigger).toHaveFocus();
  });

  it("closes via the close button and via a backdrop click, but not a click inside the panel", async () => {
    renderWithLandmarks(<PrivacyPolicyLink />);
    const trigger = screen.getByRole("button", { name: "Privacy Policy" });

    await userEvent.click(trigger);
    await userEvent.click(await screen.findByRole("button", { name: "Close privacy policy" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());

    await userEvent.click(trigger);
    const dialog = await screen.findByRole("dialog");
    await userEvent.click(screen.getByRole("heading", { name: "Your rights" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await userEvent.click(dialog.parentElement as HTMLElement);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("with openOnHash, opens when the URL hash is #privacy and clears the hash on close", async () => {
    window.history.replaceState(null, "", "/#privacy");
    renderWithLandmarks(<PrivacyPolicyLink openOnHash />);

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(window.location.hash).toBe("");
  });

  it("without openOnHash, ignores the #privacy hash (only one sitewide instance should react)", () => {
    window.history.replaceState(null, "", "/#privacy");
    renderWithLandmarks(<PrivacyPolicyLink />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("trigger is type=button so it never submits a surrounding form", () => {
    renderWithLandmarks(<PrivacyPolicyLink />);
    expect(screen.getByRole("button", { name: "Privacy Policy" })).toHaveAttribute("type", "button");
  });
});
