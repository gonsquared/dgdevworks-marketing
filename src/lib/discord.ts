import { getDiscordWebhookUrl, isDiscordWebhookPlaceholder } from "./env";
import type { DiscordWebhookPayload } from "@/data/types";

export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

const ACCENT_DECIMAL = 5390995; // #524293 as decimal RGB — shiny metagross accent, 2026-08-19 reskin

function buildPayload(values: ContactFormValues): DiscordWebhookPayload {
  return {
    username: "DG DevWorks Contact Form",
    embeds: [
      {
        title: "New Contact Form Submission",
        color: ACCENT_DECIMAL,
        fields: [
          { name: "Name", value: values.name, inline: true },
          { name: "Email", value: values.email, inline: true },
          { name: "Message", value: values.message, inline: false },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

export type ContactFormFailureReason = "placeholder" | "rate-limited" | "invalid" | "network";

export type SubmitContactFormResult =
  | { ok: true }
  | { ok: false; reason: ContactFormFailureReason };

/**
 * Posts the contact form directly to the Discord webhook (client-side, no
 * backend). Per docs/api-contract.md's failure-handling contract: if the
 * webhook URL is unset/placeholder, short-circuit before fetching, log a
 * dev-time console warning, and return a friendly failure reason instead of
 * throwing.
 */
export async function submitContactForm(
  values: ContactFormValues
): Promise<SubmitContactFormResult> {
  const webhookUrl = getDiscordWebhookUrl();

  if (isDiscordWebhookPlaceholder(webhookUrl)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[DG DevWorks] NEXT_PUBLIC_DISCORD_WEBHOOK_URL is unset or still a placeholder — " +
          "contact form submissions will not be delivered until a real webhook URL is configured."
      );
    }
    return { ok: false, reason: "placeholder" };
  }

  try {
    const response = await fetch(`${webhookUrl}?wait=true`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildPayload(values)),
    });

    if (response.ok) {
      return { ok: true };
    }

    if (response.status === 429) {
      return { ok: false, reason: "rate-limited" };
    }

    if (response.status === 400 || response.status === 401 || response.status === 404) {
      return { ok: false, reason: "invalid" };
    }

    return { ok: false, reason: "network" };
  } catch {
    // Network failure or CORS/offline — never surface raw error details to the user.
    return { ok: false, reason: "network" };
  }
}
