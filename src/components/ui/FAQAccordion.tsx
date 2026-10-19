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
    <div className={clsx("flex flex-col", className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-faq-button-${index}`;
        const panelId = `${baseId}-faq-panel-${index}`;
        return (
          <div key={item.question} className="border-b border-rule first:border-t">
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left heading-h4"
              >
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-wash text-text-primary transition-[transform,background-color,color] duration-300 ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover:bg-accent-soft [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-accent"
                  style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                >
                  <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
                    <path d="M8 3v10M3 8h10" />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="faq-panel pb-7"
            >
              <p className="text-body text-text-secondary">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
