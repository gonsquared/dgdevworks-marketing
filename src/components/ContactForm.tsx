"use client";

import { useId, useState, type FormEvent } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { submitContactForm, type ContactFormFailureReason } from "@/lib/discord";

type Status = "idle" | "loading" | "success" | "error";

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 3000;

function friendlyErrorMessage(reason: ContactFormFailureReason) {
  switch (reason) {
    case "placeholder":
      return "Something went wrong sending your message — try again or book a call directly.";
    case "rate-limited":
      return "This form is receiving a lot of messages right now — please try again in a few minutes, or book a call directly.";
    case "invalid":
    case "network":
    default:
      return "Something went wrong sending your message — try again or book a call directly.";
  }
}

function validate(values: { name: string; email: string; message: string }): FormErrors {
  const errors: FormErrors = {};

  const name = values.name.trim();
  if (!name) {
    errors.name = "Please enter your name.";
  } else if (name.length > MAX_NAME_LENGTH) {
    errors.name = "Name is too long.";
  }

  const email = values.email.trim();
  if (!email) {
    errors.email = "Please enter your email.";
  } else if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  const message = values.message.trim();
  if (!message) {
    errors.message = "Please enter a message.";
  } else if (message.length > MAX_MESSAGE_LENGTH) {
    errors.message = "Message is too long — please keep it under 3000 characters.";
  }

  return errors;
}

/**
 * Contact form: client-side validation, loading/success/error states,
 * hidden honeypot field (spam deterrent per docs/api-contract.md security
 * note), and a client-side-only POST to the Discord webhook (no backend).
 */
export function ContactForm() {
  const formId = useId();
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Honeypot tripped — drop the submission without alerting the bot (still
    // shows the normal success state to the user), but log a dev-visible
    // warning: hidden fields with common names like "company" are a known
    // false-positive source from browser/password-manager autofill, and on
    // a static site with no backend fallback a dropped-but-legitimate lead
    // is otherwise unrecoverable and invisible.
    if (honeypot.trim().length > 0) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "[DG DevWorks] Contact form honeypot field was non-empty — submission was dropped as " +
            "suspected spam. If this was a false positive (e.g. browser/password-manager autofill), " +
            "the message was NOT sent."
        );
      }
      setStatus("success");
      setStatusMessage("Thanks — your message has been sent. I'll get back to you within 1–2 business days.");
      return;
    }

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setStatus("loading");
    setStatusMessage("");

    const result = await submitContactForm({
      name: values.name.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    });

    if (result.ok) {
      setStatus("success");
      setStatusMessage("Thanks — your message has been sent. I'll get back to you within 1–2 business days.");
      setValues({ name: "", email: "", message: "" });
    } else {
      setStatus("error");
      setStatusMessage(friendlyErrorMessage(result.reason));
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5" aria-describedby={`${formId}-status`}>
      <div>
        <label htmlFor={`${formId}-name`} className="text-ui text-text-primary">
          Name
        </label>
        <input
          id={`${formId}-name`}
          name="name"
          type="text"
          autoComplete="name"
          required
          value={values.name}
          onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? `${formId}-name-error` : undefined}
          className={clsx(
            "mt-1.5 w-full rounded-md border bg-surface px-3.5 py-2.5 text-body text-text-primary",
            errors.name ? "border-error" : "border-border"
          )}
        />
        {errors.name && (
          <p id={`${formId}-name-error`} className="text-ui text-error mt-1.5">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${formId}-email`} className="text-ui text-text-primary">
          Email
        </label>
        <input
          id={`${formId}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? `${formId}-email-error` : undefined}
          className={clsx(
            "mt-1.5 w-full rounded-md border bg-surface px-3.5 py-2.5 text-body text-text-primary",
            errors.email ? "border-error" : "border-border"
          )}
        />
        {errors.email && (
          <p id={`${formId}-email-error`} className="text-ui text-error mt-1.5">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${formId}-message`} className="text-ui text-text-primary">
          Message
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={5}
          required
          value={values.message}
          onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${formId}-message-error` : undefined}
          className={clsx(
            "mt-1.5 w-full rounded-md border bg-surface px-3.5 py-2.5 text-body text-text-primary",
            errors.message ? "border-error" : "border-border"
          )}
        />
        {errors.message && (
          <p id={`${formId}-message-error`} className="text-ui text-error mt-1.5">
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot — hidden from sighted users and not reachable by keyboard tab order;
          a filled value indicates a bot. Not a real field, so no visible label is needed. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor={`${formId}-company`}>Company</label>
        <input
          id={`${formId}-company`}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <Button type="submit" variant="solid" size="lg" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send message"}
      </Button>

      <div id={`${formId}-status`} role="status" aria-live="polite">
        {status === "success" && <p className="text-ui text-success">{statusMessage}</p>}
        {status === "error" && <p className="text-ui text-error">{statusMessage}</p>}
      </div>
    </form>
  );
}
