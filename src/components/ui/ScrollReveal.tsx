"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

export interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in seconds, for sequencing multiple ScrollReveal siblings. */
  delay?: number;
  /** Direction the content slides in from. */
  direction?: "up" | "left" | "right" | "none";
}

const OFFSET = 24;

function getOffset(direction: ScrollRevealProps["direction"]) {
  switch (direction) {
    case "left":
      return { x: -OFFSET, y: 0 };
    case "right":
      return { x: OFFSET, y: 0 };
    case "none":
      return { x: 0, y: 0 };
    case "up":
    default:
      return { x: 0, y: OFFSET };
  }
}

/**
 * Fade/slide-on-scroll-into-view wrapper used across page-composite
 * components. Respects `prefers-reduced-motion`: falls back to an instant,
 * non-animated state (hard requirement, not optional polish).
 *
 * Usage:
 *   <ScrollReveal><ServiceCard ... /></ScrollReveal>
 *   <ScrollReveal direction="left" delay={0.1}>...</ScrollReveal>
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const offset = getOffset(direction);

  const variants: Variants = shouldReduceMotion
    ? { hidden: { opacity: 1, x: 0, y: 0 }, visible: { opacity: 1, x: 0, y: 0 } }
    : {
        hidden: { opacity: 0, x: offset.x, y: offset.y },
        visible: { opacity: 1, x: 0, y: 0 },
      };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
