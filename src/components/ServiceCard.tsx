import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { SpecLabel } from "@/components/ui/SpecLabel";
import type { Service } from "@/data/types";

export interface ServiceCardProps {
  service: Service;
  /** e.g. index 0 renders "§01" — index tag shown on the Services index page. */
  index?: number;
}

/** Usage: <ServiceCard service={service} index={0} /> */
export function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <Card className="flex h-full flex-col">
      {typeof index === "number" && <SpecLabel>{`§0${index + 1}`}</SpecLabel>}
      <h3 className="heading-h3 mt-2">{service.title}</h3>
      <p className="text-body text-text-secondary mt-2 flex-1">{service.summary}</p>
      <p className="font-mono-annotation text-text-secondary mt-4 normal-case tracking-normal">
        {service.priceLabel}
      </p>
      <Link
        href={`/services/${service.slug}`}
        className="text-ui text-accent mt-4 inline-block hover:text-accent-hover"
      >
        View service →
      </Link>
    </Card>
  );
}
