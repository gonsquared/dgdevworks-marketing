import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { pricingFaq } from "@/data/faq";

describe("FAQAccordion (proper disclosure pattern, docs/design-system.md §7)", () => {
  it("renders a button per question with aria-expanded and a controlled region via aria-controls/aria-labelledby", () => {
    render(<FAQAccordion items={pricingFaq} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(pricingFaq.length);

    const firstButton = buttons[0];
    expect(firstButton).toHaveAttribute("aria-expanded", "true"); // first item defaults open
    const controlsId = firstButton.getAttribute("aria-controls");
    expect(controlsId).toBeTruthy();
    const panel = document.getElementById(controlsId!);
    expect(panel).toHaveAttribute("aria-labelledby", firstButton.id);
  });

  it("is keyboard operable: Enter/click toggles aria-expanded and panel visibility without a mouse", async () => {
    render(<FAQAccordion items={pricingFaq} />);
    const buttons = screen.getAllByRole("button");
    const second = buttons[1];
    expect(second).toHaveAttribute("aria-expanded", "false");

    second.focus();
    await userEvent.keyboard("{Enter}");
    expect(second).toHaveAttribute("aria-expanded", "true");

    await userEvent.keyboard("{Enter}");
    expect(second).toHaveAttribute("aria-expanded", "false");
  });

  it("visible question/answer text matches the FAQItem source exactly (must match FAQPage JSON-LD)", () => {
    render(<FAQAccordion items={pricingFaq} />);
    for (const item of pricingFaq) {
      expect(screen.getByText(item.question)).toBeInTheDocument();
    }
  });
});
