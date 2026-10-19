"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { PricingPackage, Service } from "@/data/types";

export interface ServicesExplorerProps {
  services: Service[];
  packages: PricingPackage[];
  className?: string;
}

/**
 * "Which one are you?" explorer: the visitor picks the situation that sounds
 * like theirs (the first-person `situation` copy) and the panel shows the
 * matching engagement — what's in it, what it costs, how long it takes.
 * Built as an ARIA tablist (arrow keys move selection) so it is as usable by
 * keyboard as by pointer; hovering with a mouse previews a service, touch and
 * keyboard select on press/focus.
 */
export function ServicesExplorer({ services, packages, className }: ServicesExplorerProps) {
  const [activeSlug, setActiveSlug] = useState(services[0].slug);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const shouldReduceMotion = useReducedMotion();
  const active = services.find((s) => s.slug === activeSlug) ?? services[0];
  const activePackage = packages.find((p) => p.slug === active.slug);

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    let next = index;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = (index + 1) % services.length;
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = (index - 1 + services.length) % services.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = services.length - 1;
    else return;
    event.preventDefault();
    setActiveSlug(services[next].slug);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className={clsx("grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16", className)}>
      <div role="tablist" aria-label="Choose the situation that sounds like yours" aria-orientation="vertical" className="flex flex-col lg:col-span-6">
        {services.map((service, index) => {
          const isActive = service.slug === activeSlug;
          return (
            <button
              key={service.slug}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`service-tab-${service.slug}`}
              aria-selected={isActive}
              aria-controls="service-panel"
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveSlug(service.slug)}
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse") setActiveSlug(service.slug);
              }}
              onKeyDown={(e) => onKeyDown(e, index)}
              className="group relative py-5 pl-6 text-left transition-colors duration-200 first:pt-0 last:pb-0 md:pl-8"
            >
              {isActive && (
                <motion.span
                  aria-hidden="true"
                  layoutId="service-indicator"
                  className="absolute top-5 bottom-5 left-0 w-1 rounded-full bg-accent group-first:top-0 group-last:bottom-0"
                  transition={shouldReduceMotion ? { duration: 0 } : { type: "spring", bounce: 0.1, duration: 0.45 }}
                />
              )}
              <span
                className={clsx(
                  "font-heading block text-[clamp(1.5rem,1.1rem+1.5vw,2.375rem)] leading-[1.1] font-semibold tracking-[-0.026em] transition-colors duration-200",
                  isActive ? "text-text-primary" : "text-text-tertiary group-hover:text-text-secondary"
                )}
              >
                {service.situation ?? service.title}
              </span>
              <span
                className={clsx(
                  "text-ui mt-1.5 block transition-colors duration-200",
                  isActive ? "text-accent" : "text-text-tertiary"
                )}
              >
                {service.title}
              </span>
            </button>
          );
        })}
      </div>

      <div className="lg:col-span-6">
        <div className="lg:sticky lg:top-24">
          <div
            role="tabpanel"
            id="service-panel"
            aria-labelledby={`service-tab-${active.slug}`}
            tabIndex={0}
            className="rounded-panel border border-border bg-surface p-7 shadow-panel md:p-9"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.slug}
                initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: shouldReduceMotion ? 0.12 : 0.2, ease: [0.23, 1, 0.32, 1] }}
              >
                <p className="text-body text-text-secondary">{active.summary}</p>

                <ul className="mt-6 flex flex-col gap-3">
                  {active.includes.slice(0, 3).map((item) => (
                    <li key={item} className="text-ui text-text-primary flex gap-3 leading-snug">
                      <svg aria-hidden="true" viewBox="0 0 16 16" className="mt-0.5 h-4 w-4 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m3.5 8.5 3 3 6-7" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-4 border-t border-rule pt-6">
                  <div>
                    <p className="font-figure text-text-primary text-[clamp(1.5rem,1.2rem+1vw,2.125rem)]">{active.priceLabel}</p>
                    {activePackage && <p className="text-ui text-text-secondary mt-2">{activePackage.timeframe}</p>}
                  </div>
                  <Link
                    href={`/services/${active.slug}`}
                    className="text-ui text-accent link-underline py-2"
                  >
                    See how it works
                    <span className="sr-only">: {active.title}</span>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
