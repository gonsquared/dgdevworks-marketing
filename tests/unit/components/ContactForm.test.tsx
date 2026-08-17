import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const submitContactFormMock = vi.fn();
vi.mock("@/lib/discord", async () => {
  const actual = await vi.importActual<typeof import("@/lib/discord")>("@/lib/discord");
  return {
    ...actual,
    submitContactForm: (...args: Parameters<typeof actual.submitContactForm>) =>
      submitContactFormMock(...args),
  };
});

import { ContactForm } from "@/components/ContactForm";

describe("ContactForm (E5-F1-S1 / E5-F1-S2)", () => {
  beforeEach(() => {
    submitContactFormMock.mockReset();
  });

  function getFields() {
    return {
      name: screen.getByLabelText("Name"),
      email: screen.getByLabelText("Email"),
      message: screen.getByLabelText("Message"),
      submit: screen.getByRole("button", { name: "Send message" }),
    };
  }

  it("renders name, email, and message fields, all properly labeled for screen readers", () => {
    render(<ContactForm />);
    const { name, email, message } = getFields();
    expect(name).toBeInTheDocument();
    expect(email).toBeInTheDocument();
    expect(message).toBeInTheDocument();
  });

  it("prevents submission of empty required fields, surfacing field-level errors instead of calling the webhook", async () => {
    render(<ContactForm />);
    const { submit } = getFields();
    await userEvent.click(submit);

    expect(await screen.findByText("Please enter your name.")).toBeInTheDocument();
    expect(screen.getByText("Please enter your email.")).toBeInTheDocument();
    expect(screen.getByText("Please enter a message.")).toBeInTheDocument();
    expect(submitContactFormMock).not.toHaveBeenCalled();
  });

  it("rejects a malformed email address", async () => {
    render(<ContactForm />);
    const { name, email, message, submit } = getFields();
    await userEvent.type(name, "Jane Founder");
    await userEvent.type(email, "not-an-email");
    await userEvent.type(message, "Interested in an MVP build.");
    await userEvent.click(submit);

    expect(await screen.findByText("Please enter a valid email address.")).toBeInTheDocument();
    expect(submitContactFormMock).not.toHaveBeenCalled();
  });

  it("rejects a name at/beyond the 100-character boundary", async () => {
    render(<ContactForm />);
    const { name, email, message, submit } = getFields();
    await userEvent.type(name, "a".repeat(101));
    await userEvent.type(email, "jane@startup.com");
    await userEvent.type(message, "Hello there.");
    await userEvent.click(submit);

    expect(await screen.findByText("Name is too long.")).toBeInTheDocument();
    expect(submitContactFormMock).not.toHaveBeenCalled();
  });

  it("rejects a message at/beyond the 3000-character boundary", async () => {
    render(<ContactForm />);
    const { name, email, message, submit } = getFields();
    await userEvent.type(name, "Jane");
    await userEvent.type(email, "jane@startup.com");
    // fireEvent-level paste avoids slow per-keystroke typing for a large string.
    await userEvent.click(message);
    await userEvent.paste("a".repeat(3001));
    await userEvent.click(submit);

    expect(await screen.findByText(/Message is too long/)).toBeInTheDocument();
    expect(submitContactFormMock).not.toHaveBeenCalled();
  }, 15000);

  it("shows a distinct loading state, then a success state with generic, friendly copy on success", async () => {
    let resolveSubmit: (value: { ok: true }) => void = () => {};
    submitContactFormMock.mockReturnValue(
      new Promise((resolve) => {
        resolveSubmit = resolve;
      })
    );

    render(<ContactForm />);
    const { name, email, message, submit } = getFields();
    await userEvent.type(name, "Jane Founder");
    await userEvent.type(email, "jane@startup.com");
    await userEvent.type(message, "We'd like to talk about an MVP build.");
    await userEvent.click(submit);

    expect(await screen.findByRole("button", { name: "Sending…" })).toBeDisabled();

    resolveSubmit({ ok: true });

    expect(await screen.findByText(/Thanks — your message has been sent/)).toBeInTheDocument();
  });

  it("shows a generic, retry-friendly error state on failure — never raw fetch/HTTP details", async () => {
    submitContactFormMock.mockResolvedValue({ ok: false, reason: "network" });

    render(<ContactForm />);
    const { name, email, message, submit } = getFields();
    await userEvent.type(name, "Jane Founder");
    await userEvent.type(email, "jane@startup.com");
    await userEvent.type(message, "We'd like to talk about an MVP build.");
    await userEvent.click(submit);

    const status = await screen.findByText(/Something went wrong sending your message/);
    expect(status).toBeInTheDocument();
    // Must never leak implementation details.
    expect(status.textContent).not.toMatch(/fetch|TypeError|stack|500|network error/i);
  });

  it("announces status changes via a polite live region", () => {
    render(<ContactForm />);
    const status = document.querySelector('[role="status"]');
    expect(status).toHaveAttribute("aria-live", "polite");
  });

  it("includes a honeypot field that is hidden from sighted users and unreachable by keyboard Tab order", () => {
    render(<ContactForm />);
    const honeypot = screen.getByLabelText("Company", { selector: "input" });
    expect(honeypot).toHaveAttribute("tabindex", "-1");
    expect(honeypot).toHaveAttribute("autocomplete", "off");
    expect(honeypot.closest('[aria-hidden="true"]')).toBeTruthy();
  });

  it("silently drops the submission when the honeypot is filled, without calling the real webhook (bot deterrent), but logs a dev-visible warning so a false positive isn't invisible", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(<ContactForm />);
    const { name, email, message, submit } = getFields();
    const honeypot = screen.getByLabelText("Company", { selector: "input" });

    await userEvent.type(name, "Bot");
    await userEvent.type(email, "bot@example.com");
    await userEvent.type(message, "spam message");
    // Bots fill every field, including the hidden honeypot.
    await userEvent.type(honeypot, "http://spam.example.com");
    await userEvent.click(submit);

    expect(await screen.findByText(/Thanks — your message has been sent/)).toBeInTheDocument();
    expect(submitContactFormMock).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("honeypot"));

    warnSpy.mockRestore();
  });
});
