import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Surface } from "@/components/ui/Surface";
import { Button } from "@/components/ui/Button";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { ContactForm } from "@/components/ContactForm";
import { TrustLine } from "@/components/TrustLine";
import { JsonLd } from "@/components/JsonLd";
import { contactFaq } from "@/data/faq";
import { business } from "@/data/business";
import { buildMetadata, faqPageJsonLd } from "@/lib/seo";
import { getBookingUrl } from "@/lib/env";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with DG DevWorks: send a message, or book a call directly to talk about your project.",
  path: "/contact",
});

export default function ContactPage() {
  const bookingUrl = getBookingUrl();

  return (
    <>
      <JsonLd data={faqPageJsonLd(contactFaq)} />

      <Section size="loose">
        <h1 className="heading-display max-w-[14ch]">Let&apos;s talk about your project</h1>
      </Section>

      <Section className="pt-0 md:pt-0">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <Surface variant="panel">
              <h2 className="heading-h3">Send a message</h2>
              <div className="mt-6">
                <ContactForm />
              </div>
            </Surface>
            <TrustLine className="mt-5 px-2">{business.trustLine}</TrustLine>
          </div>

          <div className="flex flex-col gap-12">
            <Surface variant="inverted">
              <h2 className="heading-h3">Prefer to talk it through?</h2>
              <p className="text-body text-text-secondary mt-3">
                Book time directly on the calendar. No back-and-forth over email.
              </p>
              <Button href={bookingUrl} external variant="solid" size="lg" className="mt-6">
                Book a call
              </Button>
            </Surface>

            <div>
              <h2 className="heading-h3">Common questions</h2>
              <FAQAccordion items={contactFaq} className="mt-4" />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
