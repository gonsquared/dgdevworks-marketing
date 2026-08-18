import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SpecLabel } from "@/components/ui/SpecLabel";
import { Button } from "@/components/ui/Button";
import { AboutStory } from "@/components/AboutStory";
import { buildMetadata } from "@/lib/seo";
import { getBookingUrl } from "@/lib/env";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Daryll's story and the DG DevWorks framing: a one-person senior engineering practice built for startup founders.",
  path: "/about",
});

export default function AboutPage() {
  const bookingUrl = getBookingUrl();

  return (
    <Section className="pt-14">
      <SpecLabel>§00 · ABOUT</SpecLabel>
      <h1 className="heading-display mt-3">About DG DevWorks</h1>

      <ScrollReveal className="mt-10">
        <AboutStory />
      </ScrollReveal>

      <div className="mt-12">
        <Button href={bookingUrl} external variant="solid" size="lg">
          Book a call
        </Button>
      </div>
    </Section>
  );
}
