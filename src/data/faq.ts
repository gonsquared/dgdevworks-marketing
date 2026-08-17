import type { FAQItem } from "./types";

/**
 * Typed FAQ content shared between the visible on-page accordions and the
 * FAQPage JSON-LD on /pricing and /contact (E4-F3-S3) — keep the visible
 * copy and the structured data in exact sync by consuming this array in
 * both places rather than duplicating the copy.
 */
export const pricingFaq: FAQItem[] = [
  {
    question: "Why is pricing a range instead of a fixed number?",
    answer:
      "Every project has a different mix of scope, integrations, and timeline pressure. The ranges above reflect typical projects of that type — your actual quote comes from a short scoping call, not a generic price list.",
  },
  {
    question: "What happens on a scoping call?",
    answer:
      "We talk through what you're trying to build or fix, your timeline, and any constraints (existing systems, team, budget). You'll get a clear scope and a firm quote afterward — no obligation to proceed.",
  },
  {
    question: "Do you work hourly or fixed-price?",
    answer:
      "Most packaged engagements (marketing sites, MVP builds, modernization projects) are fixed-price once scoped. Fractional/embedded engagements are billed monthly at an hours-per-week cadence we agree on upfront.",
  },
  {
    question: "Are these prices final?",
    answer:
      "No — all figures on this page are indicative, pending a scoping call. They reflect current market rates for senior freelance engineering work, not a locked-in quote.",
  },
];

export const contactFaq: FAQItem[] = [
  {
    question: "How quickly will I hear back?",
    answer:
      "Typically within 1–2 business days. For a faster response, use the \"Book a call\" link to grab time directly.",
  },
  {
    question: "What happens to the information I submit?",
    answer:
      "Your info is only used to respond to your inquiry — no spam, no third parties. There's no mailing list and no data resale.",
  },
  {
    question: "Do I need a fully-formed spec before reaching out?",
    answer:
      "No. Most founders start with a rough idea or a pain point. Scoping it into something buildable is part of the first conversation.",
  },
];

const faq = { pricingFaq, contactFaq };

export default faq;
