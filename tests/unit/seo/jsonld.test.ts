import { describe, it, expect } from "vitest";
import {
  personProfessionalServiceJsonLd,
  serviceJsonLd,
  faqPageJsonLd,
  caseStudyJsonLd,
} from "@/lib/seo";
import { services } from "@/data/services";
import { caseStudies } from "@/data/caseStudies";
import { pricingFaq, contactFaq } from "@/data/faq";
import { business } from "@/data/business";

describe("Person/ProfessionalService JSON-LD (E4-F3-S1, sitewide)", () => {
  const jsonLd = personProfessionalServiceJsonLd();

  it("uses schema.org context and a @graph with Person + ProfessionalService", () => {
    expect(jsonLd["@context"]).toBe("https://schema.org");
    const types = jsonLd["@graph"].map((node) => node["@type"]);
    expect(types).toContain("Person");
    expect(types).toContain("ProfessionalService");
  });

  it("is sourced from business.ts (name, brand, social links, contact)", () => {
    const professionalService = jsonLd["@graph"].find((n) => n["@type"] === "ProfessionalService") as Record<
      string,
      unknown
    >;
    expect(professionalService.name).toBe(business.brandName);
    expect(professionalService.email).toBe(business.contactEmail);
    expect(professionalService.sameAs).toContain(business.socialLinks.linkedin);
    expect(professionalService.sameAs).toContain(business.socialLinks.github);
  });

  it("is JSON-serializable with no circular references or undefined leaking through (validates cleanly)", () => {
    expect(() => JSON.stringify(jsonLd)).not.toThrow();
    const parsed = JSON.parse(JSON.stringify(jsonLd));
    expect(parsed["@context"]).toBe("https://schema.org");
  });
});

describe("Service JSON-LD (E4-F3-S2, one per /services/[slug])", () => {
  it("every service produces a distinct, correctly-shaped Service schema", () => {
    const schemas = services.map((s) => serviceJsonLd(s));
    for (const [i, schema] of schemas.entries()) {
      expect(schema["@type"]).toBe("Service");
      expect(schema.name).toBe(services[i].title);
      expect(schema.description).toBe(services[i].summary);
      expect(schema.offers).toBeDefined();
      expect((schema.offers as Record<string, unknown>).description).toBe(services[i].priceLabel);
    }
  });

  it("no two service schemas share the same name/description (no generic duplicate markup)", () => {
    const schemas = services.map((s) => serviceJsonLd(s));
    const names = schemas.map((s) => s.name);
    const descriptions = schemas.map((s) => s.description);
    expect(new Set(names).size).toBe(names.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });
});

describe("FAQPage JSON-LD (E4-F3-S3, /pricing and /contact)", () => {
  it("pricing and contact FAQ JSON-LD mainEntity matches the visible FAQItem source exactly", () => {
    for (const items of [pricingFaq, contactFaq]) {
      const schema = faqPageJsonLd(items);
      expect(schema["@type"]).toBe("FAQPage");
      expect(schema.mainEntity).toHaveLength(items.length);
      schema.mainEntity.forEach((entry, i) => {
        expect(entry.name).toBe(items[i].question);
        expect(entry.acceptedAnswer.text).toBe(items[i].answer);
        expect(entry["@type"]).toBe("Question");
        expect(entry.acceptedAnswer["@type"]).toBe("Answer");
      });
    }
  });
});

describe("Case study JSON-LD (supplemental CreativeWork markup on /work/[slug])", () => {
  it("every case study produces a distinct CreativeWork schema", () => {
    const schemas = caseStudies.map((cs) => caseStudyJsonLd(cs));
    for (const [i, schema] of schemas.entries()) {
      expect(schema["@type"]).toBe("CreativeWork");
      expect(schema.name).toBe(caseStudies[i].title);
    }
    const names = schemas.map((s) => s.name);
    expect(new Set(names).size).toBe(names.length);
  });
});
