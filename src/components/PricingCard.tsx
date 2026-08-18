import clsx from "clsx";
import { Card } from "@/components/ui/Card";
import type { PricingPackage } from "@/data/types";

export interface PricingCardProps {
  pkg: PricingPackage;
  /** Marks the recommended tier with corner-bracket registration marks. */
  recommended?: boolean;
}

/** Usage: <PricingCard pkg={pkg} recommended /> */
export function PricingCard({ pkg, recommended = false }: PricingCardProps) {
  return (
    <Card bracket={recommended} className={clsx("flex h-full flex-col", recommended && "border-accent")}>
      <h3 className="heading-h4">{pkg.name}</h3>
      <p className="font-mono-figure text-accent mt-3">{pkg.priceLabel}</p>
      <p className="text-ui text-text-secondary mt-1">{pkg.timeframe}</p>
      <p className="text-body text-text-secondary mt-4 flex-1">{pkg.rangeNote}</p>
    </Card>
  );
}
