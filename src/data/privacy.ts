import { business } from "./business";

/**
 * Privacy policy content for /privacy — single source of truth for the full
 * policy page, the short "just-in-time" notice under the contact form, and
 * the contact-page trust line / FAQ answer.
 *
 * Structure follows the disclosures GDPR Art. 13 requires at the point of
 * collection (controller identity, purposes, legal basis, recipients,
 * international transfers, retention, rights, right to complain) and the
 * CalOPPA posting requirements (categories of PII, third parties, Do Not
 * Track handling, how changes are communicated, effective date). It also
 * covers the Philippine Data Privacy Act of 2012 (RA 10173) transparency
 * principle, since the practice is based in the Philippines.
 *
 * Keep this accurate to what the site actually does. If an integration is
 * added or removed (e.g. a new form backend, analytics, a newsletter),
 * update the relevant section AND bump `lastUpdated`.
 */

/** ISO date (YYYY-MM-DD). Bump whenever the policy content materially changes. */
export const PRIVACY_LAST_UPDATED = "2026-11-13";

/** How long contact-form inquiries that don't turn into an engagement are kept. */
export const INQUIRY_RETENTION_MONTHS = 12;

export const PRIVACY_PATH = "/privacy";

export interface PrivacySection {
  id: string;
  heading: string;
  paragraphs?: string[];
  items?: string[];
  /** Paragraphs rendered after the list. */
  after?: string[];
}

export const privacyNotice = {
  /** Short notice shown directly under the contact form, before submission. */
  formNotice:
    "I'll use your name, email, and message only to reply to your inquiry. Submissions are delivered to me through Discord. Nothing is added to a mailing list or sold.",
};

export interface PrivacyPolicyOptions {
  /** True when Google Analytics is enabled for this build (NEXT_PUBLIC_GA_ID set). */
  analyticsEnabled: boolean;
}

/** Full policy sections, in display order. */
export function getPrivacySections({ analyticsEnabled }: PrivacyPolicyOptions): PrivacySection[] {
  const email = business.contactEmail;

  return [
    {
      id: "who-i-am",
      heading: "Who is responsible for your data",
      paragraphs: [
        `${business.brandName} is a one-person software engineering practice run by Daryll B. Gongon, based in the Philippines. Daryll is the data controller (the "personal information controller" under the Philippine Data Privacy Act) for personal data collected through this website.`,
        `For any privacy question or request, email ${email}. There is no separate data protection officer; your request goes straight to me.`,
      ],
    },
    {
      id: "what-i-collect",
      heading: "What I collect",
      paragraphs: ["I only collect what you choose to send me, plus the minimum technical data needed to serve the site:"],
      items: [
        "Contact form: your name, email address, the message you write, and the time it was sent.",
        "Email: if you email me directly, your email address and whatever you include in the message.",
        "Booking a call: if you use the \"Book a call\" link, the scheduling tool collects your name, email, chosen time, and any notes you add, and shares them with me so the call can happen.",
        "Server logs: the hosting provider automatically processes standard request data (IP address, browser user agent, pages requested, timestamps) to deliver the site and protect it from abuse.",
        ...(analyticsEnabled
          ? [
              "Analytics: Google Analytics sets cookies and collects usage data (pages visited, approximate location, device and browser type) so I can understand how the site is used.",
            ]
          : []),
      ],
      after: [
        "Your browser also stores two small preferences locally: your light/dark theme choice (localStorage) and whether you've dismissed the portfolio notice in this session (sessionStorage). These never leave your device.",
        "I don't knowingly collect sensitive personal information, so please don't include it in your message.",
      ],
    },
    {
      id: "how-i-use-it",
      heading: "How and why I use it",
      paragraphs: [
        "I use your information to read and reply to your inquiry, schedule and hold calls, scope and quote work you've asked about, and, if we work together, to manage that engagement.",
        "The legal basis is my legitimate interest in responding to people who contact me, and taking steps you've asked for before entering into a contract (GDPR Art. 6(1)(b) and (f); RA 10173 Sec. 12). I don't use your information for marketing, I don't add you to a mailing list, and I don't use it for automated decision-making or profiling.",
        ...(analyticsEnabled
          ? [
              "Analytics data is used only in aggregate to improve the site. Where the law requires consent for analytics cookies, you can block them through your browser settings or Google's opt-out browser add-on.",
            ]
          : []),
      ],
    },
    {
      id: "who-i-share-it-with",
      heading: "Who I share it with",
      paragraphs: [
        "I don't sell or rent your personal information, and I don't share it with anyone for advertising or their own marketing. A small number of service providers process data on my behalf to run this site:",
      ],
      items: [
        "Discord (Discord Inc., United States): contact form submissions are delivered to a private Discord channel that only I can access.",
        "Vercel (Vercel Inc., United States): hosts the website and processes server logs.",
        "Cal.com: runs the booking calendar. When you book, Cal.com processes your details under its own privacy policy as well.",
        "My email provider: stores email conversations once I reply to you.",
        ...(analyticsEnabled ? ["Google (Google LLC, United States): provides Google Analytics."] : []),
      ],
      after: [
        "I may also disclose information if the law requires it, or to protect my rights or the safety of others.",
      ],
    },
    {
      id: "international-transfers",
      heading: "International transfers",
      paragraphs: [
        "I'm based in the Philippines and several of the providers above store data in the United States or other countries. That means your information may be processed outside the country you live in. I rely on those providers' contractual safeguards (such as Standard Contractual Clauses, where they apply) and choose providers with established security programs.",
      ],
    },
    {
      id: "retention",
      heading: "How long I keep it",
      items: [
        `Inquiries that don't turn into a project are deleted within ${INQUIRY_RETENTION_MONTHS} months of our last contact.`,
        "If we work together, project correspondence is kept for the duration of the engagement and afterward for as long as tax, accounting, or contractual obligations require.",
        "Server logs are kept by the hosting provider for its standard, short retention period.",
      ],
      after: ["You can ask me to delete your information sooner at any time."],
    },
    {
      id: "your-rights",
      heading: "Your rights",
      paragraphs: [
        "Depending on where you live (for example under the GDPR, UK GDPR, the Philippine Data Privacy Act, or California law), you have the right to:",
      ],
      items: [
        "be told what personal information I hold about you and get a copy of it;",
        "have inaccurate information corrected;",
        "have your information deleted;",
        "object to or restrict how I use it;",
        "receive your information in a portable format;",
        "withdraw any consent you've given, without affecting earlier processing;",
        "not be discriminated against for exercising any of these rights.",
      ],
      after: [
        `To make a request, email ${email}. I'll respond within 30 days and may ask you to confirm your identity first.`,
        "You can also complain to a data protection authority: in the Philippines, the National Privacy Commission (privacy.gov.ph); in the EU/EEA, your local supervisory authority; in the UK, the Information Commissioner's Office. I'd appreciate the chance to sort it out with you first.",
      ],
    },
    {
      id: "security",
      heading: "Security",
      paragraphs: [
        "The site is served over HTTPS, and submissions go directly to a private channel with access limited to me. No method of transmission or storage is perfectly secure, but I take reasonable technical and organizational measures to protect your information.",
      ],
    },
    {
      id: "do-not-track",
      heading: "Do Not Track and cookies",
      paragraphs: analyticsEnabled
        ? [
            "Browsers don't have a common standard for \"Do Not Track\" signals, so this site doesn't respond to them. The only cookies set are Google Analytics cookies, which you can block in your browser without breaking the site.",
          ]
        : [
            "This site doesn't use tracking or advertising cookies, and it doesn't let third parties track your activity across other sites. Because there's no tracking to switch off, it doesn't change behavior in response to \"Do Not Track\" signals.",
          ],
    },
    {
      id: "children",
      heading: "Children",
      paragraphs: [
        "This site is meant for businesses and adults. It isn't directed at children under 16, and I don't knowingly collect their information. If you believe a child has sent me personal information, email me and I'll delete it.",
      ],
    },
    {
      id: "changes",
      heading: "Changes to this policy",
      paragraphs: [
        "If I change how I handle personal information, I'll update this page and the \"Last updated\" date at the top. If a change is significant, I'll make it clear on the site.",
      ],
    },
  ];
}

/** Human-readable form of PRIVACY_LAST_UPDATED, e.g. "November 13, 2026". */
export function formatPrivacyDate(iso: string = PRIVACY_LAST_UPDATED): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
