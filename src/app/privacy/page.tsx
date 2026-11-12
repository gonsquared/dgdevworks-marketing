import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { SpecLabel } from "@/components/ui/SpecLabel";
import { business } from "@/data/business";
import { PRIVACY_LAST_UPDATED, PRIVACY_PATH, formatPrivacyDate, getPrivacySections } from "@/data/privacy";
import { buildMetadata } from "@/lib/seo";
import { getGaId } from "@/lib/env";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "How DG DevWorks collects, uses, shares, and protects the personal information you send through the contact form, email, or booking link.",
  path: PRIVACY_PATH,
});

export default function PrivacyPage() {
  // Analytics disclosures only render when GA is actually enabled for this
  // build, so the policy never claims tracking that isn't happening (or
  // omits tracking that is).
  const sections = getPrivacySections({ analyticsEnabled: Boolean(getGaId()) });

  return (
    <Section className="pt-14">
      <div className="max-w-3xl">
        <SpecLabel>§00 · PRIVACY</SpecLabel>
        <h1 className="heading-display mt-3">Privacy Policy</h1>
        <p className="text-body-lead text-text-secondary mt-6">
          This policy explains what personal information {business.brandName} collects through this website, why,
          who it&apos;s shared with, and the choices you have. The short version: anything you send is used only to
          reply to you.
        </p>
        <p className="font-mono-annotation text-text-secondary mt-4 normal-case tracking-normal">
          Last updated: <time dateTime={PRIVACY_LAST_UPDATED}>{formatPrivacyDate()}</time>
        </p>

        <nav aria-label="Privacy policy sections" className="mt-10 border-t border-rule pt-6">
          <ol className="flex flex-col gap-2">
            {sections.map((section, index) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="text-ui text-text-secondary hover:text-text-primary">
                  {String(index + 1).padStart(2, "0")} · {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-12 flex flex-col gap-12">
          {sections.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`} className="scroll-mt-24">
              <h2 id={`${section.id}-heading`} className="heading-h3">
                {section.heading}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="text-body text-text-secondary mt-4">
                  {paragraph}
                </p>
              ))}
              {section.items && (
                <ul className="text-body text-text-secondary mt-4 flex list-disc flex-col gap-2 pl-6">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {section.after?.map((paragraph) => (
                <p key={paragraph} className="text-body text-text-secondary mt-4">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <div className="mt-14 border-t border-rule pt-6">
          <p className="text-body text-text-secondary">
            Questions or requests about your data:{" "}
            <a href={`mailto:${business.contactEmail}`} className="text-accent hover:text-accent-hover">
              {business.contactEmail}
            </a>
          </p>
        </div>
      </div>
    </Section>
  );
}
