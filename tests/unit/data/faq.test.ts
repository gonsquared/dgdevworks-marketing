import { describe, it, expect } from "vitest";
import { pricingFaq, contactFaq } from "@/data/faq";

describe("src/data/faq.ts (backs FAQPage JSON-LD, E4-F3-S3)", () => {
  it("pricingFaq and contactFaq are non-empty arrays of well-formed FAQItems", () => {
    for (const list of [pricingFaq, contactFaq]) {
      expect(list.length).toBeGreaterThan(0);
      for (const item of list) {
        expect(typeof item.question).toBe("string");
        expect(item.question.length).toBeGreaterThan(0);
        expect(typeof item.answer).toBe("string");
        expect(item.answer.length).toBeGreaterThan(0);
      }
    }
  });

  it("has no duplicate questions within a single FAQ list", () => {
    for (const list of [pricingFaq, contactFaq]) {
      const questions = list.map((i) => i.question);
      expect(new Set(questions).size).toBe(questions.length);
    }
  });
});
