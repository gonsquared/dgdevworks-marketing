import { describe, it, expect } from "vitest";
import {
  INQUIRY_RETENTION_MONTHS,
  PRIVACY_LAST_UPDATED,
  formatPrivacyDate,
  getPrivacySections,
  privacyNotice,
} from "@/data/privacy";
import { business } from "@/data/business";
import { contactFaq } from "@/data/faq";

function allText(analyticsEnabled: boolean) {
  return getPrivacySections({ analyticsEnabled })
    .flatMap((s) => [s.heading, ...(s.paragraphs ?? []), ...(s.items ?? []), ...(s.after ?? [])])
    .join("\n");
}

describe("src/data/privacy.ts", () => {
  it("covers every GDPR Art. 13 / CalOPPA disclosure as its own section", () => {
    const ids = getPrivacySections({ analyticsEnabled: false }).map((s) => s.id);
    for (const id of [
      "who-i-am",
      "what-i-collect",
      "how-i-use-it",
      "who-i-share-it-with",
      "international-transfers",
      "retention",
      "your-rights",
      "do-not-track",
      "changes",
    ]) {
      expect(ids).toContain(id);
    }
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("names the controller, contact email, and every processor the site actually uses", () => {
    const text = allText(false);
    expect(text).toContain("Daryll B. Gongon");
    expect(text).toContain(business.contactEmail);
    for (const processor of ["Discord", "Vercel", "Cal.com"]) {
      expect(text).toContain(processor);
    }
    expect(text).toContain(`${INQUIRY_RETENTION_MONTHS} months`);
    expect(text).toContain("National Privacy Commission");
  });

  it("only discloses Google Analytics when analytics is enabled for the build", () => {
    expect(allText(false)).not.toMatch(/Google Analytics/);
    expect(allText(true)).toMatch(/Google Analytics/);
  });

  it("has a valid last-updated date and formats it for display", () => {
    expect(PRIVACY_LAST_UPDATED).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(formatPrivacyDate("2026-11-13")).toBe("November 13, 2026");
  });

  it("no user-facing copy claims 'no third parties' (submissions go through Discord)", () => {
    const copy = [privacyNotice.formNotice, business.trustLine, ...contactFaq.map((f) => f.answer)];
    for (const line of copy) {
      expect(line).not.toMatch(/no third parties/i);
    }
  });
});
