import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { SpecLabel } from "@/components/ui/SpecLabel";
import { Surface } from "@/components/ui/Surface";
import { Button } from "@/components/ui/Button";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { ContactForm } from "@/components/ContactForm";
import { TrustLine } from "@/components/TrustLine";
import { JsonLd } from "@/components/JsonLd";
import { contactFaq } from "@/data/faq";
import { business } from "@/data/business";
import { PrivacyPolicyLink } from "@/components/PrivacyPolicyModal";
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

      <Section className="pt-14">
        <SpecLabel>§00 · CONTACT</SpecLabel>
        <h1 className="heading-display mt-3">Let&apos;s talk about your project</h1>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Surface variant="panel">
              <h2 className="heading-h3">Send a message</h2>
              <ContactForm />
            </Surface>
            <TrustLine className="mt-4">{business.trustLine}</TrustLine>
            <p className="text-ui text-text-secondary mt-2">
              <PrivacyPolicyLink>Read the Privacy Policy</PrivacyPolicyLink>
            </p>
          </div>

          <div className="flex flex-col gap-8">
            <Surface variant="panel">
              <h2 className="heading-h3">Prefer to talk it through?</h2>
              <p className="text-body text-text-secondary mt-3">
                Book time directly on the calendar. No back-and-forth over email.
              </p>
              <Button href={bookingUrl} external variant="solid" size="lg" className="mt-5">
                Book a call
              </Button>
              <p className="text-ui text-text-secondary mt-4">
                Bookings run through Cal.com, which shares your name, email, and notes with me to set up the call.
                See the <PrivacyPolicyLink />.
              </p>
            </Surface>

            <div>
              <SpecLabel>FAQ</SpecLabel>
              <h2 className="heading-h3 mt-3">Common questions</h2>
              <FAQAccordion items={contactFaq} className="mt-6" />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
