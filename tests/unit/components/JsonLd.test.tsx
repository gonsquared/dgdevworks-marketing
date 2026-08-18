import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { JsonLd } from "@/components/JsonLd";

describe("JsonLd component (renders structured data safely)", () => {
  it("renders a script[type=application/ld+json] tag containing the serialized data", () => {
    const { container } = render(<JsonLd data={{ "@type": "Thing", name: "Test" }} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
    const parsed = JSON.parse(script!.innerHTML);
    expect(parsed).toEqual({ "@type": "Thing", name: "Test" });
  });

  it("escapes '<' to prevent a </script> breakout / XSS via injected data", () => {
    const malicious = { name: "</script><script>alert(1)</script>" };
    const { container } = render(<JsonLd data={malicious} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script!.innerHTML).not.toContain("</script><script>");
    expect(script!.innerHTML).toContain("\\u003c");
  });
});
