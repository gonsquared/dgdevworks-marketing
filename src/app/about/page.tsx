import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { AboutStory } from "@/components/AboutStory";
import { buildMetadata } from "@/lib/seo";
import { getBookingUrl } from "@/lib/env";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Daryll's story and the DG DevWorks framing: a one-person engineering practice for companies and teams building, modernizing, or scaling software.",
  path: "/about",
});

export default function AboutPage() {
  const bookingUrl = getBookingUrl();

  return (
    <Section size="loose">
      <h1 className="heading-display max-w-[14ch]">About DG DevWorks</h1>

      <div className="mt-14 md:mt-20">
        <AboutStory />
      </div>

      <div className="mt-14">
        <Button href={bookingUrl} external variant="solid" size="lg">
          Book a call
        </Button>
      </div>
    </Section>
  );
}
