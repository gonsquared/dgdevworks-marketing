import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

/**
 * E1-F1-S2 / E1-F1-S3 acceptance-criteria coverage for the Instrument Serif
 * -> Space Grotesk heading font swap. These are source-inspection tests
 * (same pattern as tests/unit/security/security.test.ts) rather than
 * rendered-DOM tests, because `next/font/google` is resolved at Next's own
 * build time and isn't meaningfully renderable under plain Vitest/jsdom
 * (layout.tsx is intentionally excluded from coverage in vitest.config.ts
 * for the same reason). `next build` itself (zero errors, no font
 * warnings) is verified independently by qa-agent as part of this gate,
 * not re-asserted here.
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

const layoutPath = path.join(SRC_DIR, "app/layout.tsx");
const layoutSource = readFileSync(layoutPath, "utf8");
const globalsCssPath = path.join(SRC_DIR, "app/globals.css");
const globalsCss = readFileSync(globalsCssPath, "utf8");
const logotypePath = path.join(SRC_DIR, "components/layout/Logotype.tsx");
const logotypeSource = readFileSync(logotypePath, "utf8");

describe("E1-F1-S2 — replacement font wired into layout.tsx", () => {
  it("imports the replacement font (Space_Grotesk) from next/font/google instead of Instrument_Serif", () => {
    expect(layoutSource).toMatch(/import\s*{[^}]*\bSpace_Grotesk\b[^}]*}\s*from\s*"next\/font\/google"/);
    expect(layoutSource).not.toMatch(/Instrument_Serif/);
  });

  it("configures the font with a variable name that reflects the new font, not the old one", () => {
    expect(layoutSource).toMatch(/Space_Grotesk\(\s*{\s*[\s\S]*?variable:\s*"--font-space-grotesk"/);
    expect(layoutSource).not.toMatch(/--font-instrument-serif/);
  });

  it("applies the new font's variable on <html> alongside the existing inter/ibmPlexMono variables", () => {
    const htmlClassNameMatch = layoutSource.match(/className=\{`([^`]+)`\}/);
    expect(htmlClassNameMatch, "expected a template-literal className on <html>").not.toBeNull();
    const htmlClassName = htmlClassNameMatch![1];
    expect(htmlClassName).toContain("${inter.variable}");
    expect(htmlClassName).toContain("${spaceGrotesk.variable}");
    expect(htmlClassName).toContain("${ibmPlexMono.variable}");
  });
});

describe("E1-F1-S2 — globals.css design-token wiring", () => {
  it("maps the --font-heading role token to the new font variable, not the old one", () => {
    expect(globalsCss).toMatch(/--font-heading:\s*var\(--font-space-grotesk\)/);
    expect(globalsCss).not.toMatch(/--font-heading:\s*var\(--font-instrument-serif\)/);
  });

  it("no longer carries the stale Instrument-Serif weight-400-only warning comment", () => {
    expect(globalsCss).not.toMatch(/Instrument Serif ships weight 400 only/);
    expect(globalsCss).not.toMatch(/never set font-weight above 400 on anything using var\(--font-heading\)/);
  });

  it("applies the documented weight assignment (500 for heading classes, 400 for the pull-quote voice)", () => {
    const headingMasthead = globalsCss.match(/\.heading-masthead\s*{([^}]+)}/)?.[1] ?? "";
    const headingDisplay = globalsCss.match(/\.heading-display\s*{([^}]+)}/)?.[1] ?? "";
    const headingH2 = globalsCss.match(/\.heading-h2\s*{([^}]+)}/)?.[1] ?? "";
    const textVoice = globalsCss.match(/\.text-voice\s*{([^}]+)}/)?.[1] ?? "";

    for (const block of [headingMasthead, headingDisplay, headingH2]) {
      expect(block).toMatch(/font-family:\s*var\(--font-heading\)/);
      expect(block).toMatch(/font-weight:\s*500/);
    }
    expect(textVoice).toMatch(/font-family:\s*var\(--font-heading\)/);
    expect(textVoice).toMatch(/font-weight:\s*400/);
  });
});

describe("E1-F1-S2 — no remaining Instrument Serif references anywhere in src/", () => {
  it("no source file references Instrument_Serif, --font-instrument-serif, or the string \"Instrument Serif\"", () => {
    const offenders: string[] = [];
    for (const { file, content } of fileContents) {
      if (/Instrument_Serif|--font-instrument-serif|Instrument Serif/.test(content)) {
        offenders.push(path.relative(SRC_DIR, file));
      }
    }
    expect(offenders, `Found stale Instrument Serif references:\n${offenders.join("\n")}`).toEqual([]);
  });
});

describe("E1-F1-S3 — Logotype doc-comment accuracy", () => {
  it("describes the font actually applied to the 'DevWorks' text (--font-sans/Inter via .heading-h4), not the old --font-heading/Instrument Serif claim", () => {
    const docCommentMatch = logotypeSource.match(/\/\*\*[\s\S]*?\*\//);
    expect(docCommentMatch, "expected a doc comment above the Logotype export").not.toBeNull();
    const docComment = docCommentMatch![0];

    expect(docComment).toMatch(/heading-h4/);
    expect(docComment).toMatch(/--font-sans/);
    expect(docComment.toLowerCase()).toContain("inter");
    expect(docComment).not.toMatch(/Instrument Serif/);
    // Guard against a future regression re-introducing the old inaccurate
    // claim that the logotype text renders in --font-heading.
    expect(docComment).not.toMatch(/text uses `?--font-heading`?/);
  });

  it("Logotype's rendered element still actually uses .heading-h4 (keeps the doc comment honest)", () => {
    expect(logotypeSource).toMatch(/heading-h4/);
  });
});

describe("E1-F1-S3 — OG image generators are independent of next/font", () => {
  const ogImagePaths = [
    path.join(SRC_DIR, "app/opengraph-image.tsx"),
    path.join(SRC_DIR, "app/services/[slug]/opengraph-image.tsx"),
    path.join(SRC_DIR, "app/work/[slug]/opengraph-image.tsx"),
  ];

  it.each(ogImagePaths)("%s does not import next/font and only uses static sans-serif/monospace font-family strings", (ogPath) => {
    const source = readFileSync(ogPath, "utf8");
    expect(source).not.toMatch(/from\s+"next\/font/);
    expect(source).not.toMatch(/Space_Grotesk|Instrument_Serif/);
    const fontFamilyValues = [...source.matchAll(/fontFamily:\s*"([^"]+)"/g)].map((m) => m[1]);
    expect(fontFamilyValues.length).toBeGreaterThan(0);
    for (const value of fontFamilyValues) {
      expect(["sans-serif", "monospace"]).toContain(value);
    }
  });
});
