"use client";

import { useId, useState } from "react";
import clsx from "clsx";
import type { FAQItem } from "@/data/types";

export interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
}

/**
 * Accessible disclosure-pattern FAQ accordion. Each question is a
 * <button aria-expanded> controlling a region via aria-controls/
 * aria-labelledby, fully keyboard operable. Content must match the
 * FAQPage JSON-LD emitted alongside it (see src/lib/seo.ts) exactly.
 *
 * Usage: <FAQAccordion items={pricingFaq} />
 */
export function FAQAccordion({ items, className }: FAQAccordionProps) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className={clsx("divide-y divide-border border-y border-border", className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-faq-button-${index}`;
        const panelId = `${baseId}-faq-panel-${index}`;
        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left heading-h4"
              >
                <span>{item.question}</span>
                <span aria-hidden="true" className="text-accent shrink-0">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="pb-5"
            >
              <p className="text-body text-text-secondary">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
