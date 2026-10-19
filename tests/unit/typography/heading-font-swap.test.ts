import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

/**
 * Typography wiring for the UI revamp: Bricolage Grotesque (display, variable
 * with an optical-size axis) + Instrument Sans (text and UI). These are
 * source-inspection tests (same pattern as tests/unit/security/security.test.ts)
 * rather than rendered-DOM tests, because `next/font/google` is resolved at
 * Next's own build time and isn't meaningfully renderable under plain
 * Vitest/jsdom (layout.tsx is intentionally excluded from coverage in
 * vitest.config.ts for the same reason). `next build` itself is verified
 * independently.
 */

const ROOT_DIR = path.resolve(__dirname, "../../..");
const SRC_DIR = path.join(ROOT_DIR, "src");

function listSourceFiles(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...listSourceFiles(full));
    } else if (/\.(tsx?|jsx?|css)$/.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

const sourceFiles = listSourceFiles(SRC_DIR);
const fileContents = sourceFiles.map((f) => ({ file: f, content: readFileSync(f, "utf8") }));

const layoutSource = readFileSync(path.join(SRC_DIR, "app/layout.tsx"), "utf8");
const globalsCss = readFileSync(path.join(SRC_DIR, "app/globals.css"), "utf8");
const logotypeSource = readFileSync(path.join(SRC_DIR, "components/layout/Logotype.tsx"), "utf8");

describe("fonts wired into layout.tsx", () => {
  it("imports Bricolage_Grotesque and Instrument_Sans from next/font/google", () => {
    expect(layoutSource).toMatch(
      /import\s*{[^}]*\bBricolage_Grotesque\b[^}]*\bInstrument_Sans\b[^}]*}\s*from\s*"next\/font\/google"/
    );
  });

  it("exposes each font through a CSS variable", () => {
    expect(layoutSource).toMatch(/Bricolage_Grotesque\(\s*{\s*[\s\S]*?variable:\s*"--font-bricolage"/);
    expect(layoutSource).toMatch(/Instrument_Sans\(\s*{\s*[\s\S]*?variable:\s*"--font-instrument-sans"/);
  });

  it("enables the optical-size axis on the display face", () => {
    expect(layoutSource).toMatch(/axes:\s*\[\s*"opsz"\s*\]/);
  });

  it("applies both font variables on <html>", () => {
    const htmlClassNameMatch = layoutSource.match(/className=\{`([^`]+)`\}/);
    expect(htmlClassNameMatch, "expected a template-literal className on <html>").not.toBeNull();
    const htmlClassName = htmlClassNameMatch![1];
    expect(htmlClassName).toContain("${bricolage.variable}");
    expect(htmlClassName).toContain("${instrumentSans.variable}");
  });
});

describe("globals.css design-token wiring", () => {
  it("maps the role tokens to the new font variables", () => {
    expect(globalsCss).toMatch(/--font-heading:\s*var\(--font-bricolage\)/);
    expect(globalsCss).toMatch(/--font-sans:\s*var\(--font-instrument-sans\)/);
  });

  it("sets display weight 600 on the heading classes, with optical sizing and tightened tracking", () => {
    const headingMasthead = globalsCss.match(/\.heading-masthead\s*{([^}]+)}/)?.[1] ?? "";
    const headingDisplay = globalsCss.match(/\.heading-display\s*{([^}]+)}/)?.[1] ?? "";
    const headingH2 = globalsCss.match(/\.heading-h2\s*{([^}]+)}/)?.[1] ?? "";

    for (const block of [headingMasthead, headingDisplay, headingH2]) {
      expect(block).toMatch(/font-family:\s*var\(--font-heading\)/);
      expect(block).toMatch(/font-weight:\s*600/);
      expect(block).toMatch(/font-optical-sizing:\s*auto/);
      expect(block).toMatch(/letter-spacing:\s*-0\./);
    }
  });

  it("uses the display face for pull-quote voice and for figures", () => {
    const textVoice = globalsCss.match(/\.text-voice\s*{([^}]+)}/)?.[1] ?? "";
    const figure = globalsCss.match(/\.font-figure\s*{([^}]+)}/)?.[1] ?? "";
    expect(textVoice).toMatch(/font-family:\s*var\(--font-heading\)/);
    expect(figure).toMatch(/font-family:\s*var\(--font-heading\)/);
    expect(figure).toMatch(/tabular-nums/);
  });
});

describe("no stale font references anywhere in src/", () => {
  it("no source file references retired fonts (Instrument Serif, Space Grotesk, IBM Plex Mono, Inter variable)", () => {
    const offenders: string[] = [];
    for (const { file, content } of fileContents) {
      if (/Instrument_Serif|--font-instrument-serif|Instrument Serif|Space_Grotesk|--font-space-grotesk|IBM_Plex_Mono|--font-ibm-plex-mono|--font-inter\b/.test(content)) {
        offenders.push(path.relative(SRC_DIR, file));
      }
    }
    expect(offenders, `Found stale font references:\n${offenders.join("\n")}`).toEqual([]);
  });

  it("no component uses the retired mono annotation / mono figure classes", () => {
    const offenders: string[] = [];
    for (const { file, content } of fileContents) {
      if (/font-mono-annotation|font-mono-figure/.test(content)) offenders.push(path.relative(SRC_DIR, file));
    }
    expect(offenders).toEqual([]);
  });
});

describe("Logotype", () => {
  it("renders the wordmark in the display face", () => {
    expect(logotypeSource).toMatch(/font-heading/);
  });
});

describe("OG image generators are independent of next/font", () => {
  const ogImagePaths = [
    path.join(SRC_DIR, "app/opengraph-image.tsx"),
    path.join(SRC_DIR, "app/services/[slug]/opengraph-image.tsx"),
    path.join(SRC_DIR, "app/work/[slug]/opengraph-image.tsx"),
  ];

  it.each(ogImagePaths)("%s does not import next/font and only uses static sans-serif/monospace font-family strings", (ogPath) => {
    const source = readFileSync(ogPath, "utf8");
    expect(source).not.toMatch(/from\s+"next\/font/);
    const fontFamilyValues = [...source.matchAll(/fontFamily:\s*"([^"]+)"/g)].map((m) => m[1]);
    expect(fontFamilyValues.length).toBeGreaterThan(0);
    for (const value of fontFamilyValues) {
      expect(["sans-serif", "monospace"]).toContain(value);
    }
  });
});
