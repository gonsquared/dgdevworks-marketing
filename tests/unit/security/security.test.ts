import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const SRC_DIR = path.resolve(__dirname, "../../../src");

function listSourceFiles(dir: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];
  for (const entry of entries) {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      files.push(...listSourceFiles(full));
    } else if (/\.(tsx?|jsx?)$/.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

const sourceFiles = listSourceFiles(SRC_DIR);
const fileContents = sourceFiles.map((f) => ({ file: f, content: readFileSync(f, "utf8") }));

describe("Security: external links (docs/design-system.md §8)", () => {
  it("every target=\"_blank\" anchor also carries rel=\"noopener noreferrer\" (prevents reverse-tabnabbing)", () => {
    const offenders: string[] = [];
    for (const { file, content } of fileContents) {
      // Find <a ...> opening tags spanning target="_blank" and check they also declare rel="noopener noreferrer".
      const anchorRegex = /<a\b[^>]*>/g;
      let match: RegExpExecArray | null;
      while ((match = anchorRegex.exec(content))) {
        const tag = match[0];
        if (tag.includes('target="_blank"') || tag.includes("target=\"_blank\"")) {
          if (!tag.includes('rel="noopener noreferrer"')) {
            offenders.push(`${path.relative(SRC_DIR, file)}: ${tag}`);
          }
        }
      }
    }
    expect(offenders, `Found target="_blank" anchors missing rel="noopener noreferrer":\n${offenders.join("\n")}`).toEqual(
      []
    );
  });

  it("Button component's `external` prop always applies target=_blank + rel=noopener noreferrer (already covered functionally in Button.test.tsx) — statically confirm the source encodes this", () => {
    const buttonSource = readFileSync(path.join(SRC_DIR, "components/ui/Button.tsx"), "utf8");
    expect(buttonSource).toMatch(/target="_blank"/);
    expect(buttonSource).toMatch(/rel="noopener noreferrer"/);
  });
});

describe("Security: no open-redirect vectors", () => {
  it("no source file reads or forwards a `next`/`redirect` query param anywhere in the codebase", () => {
    const offenders: string[] = [];
    for (const { file, content } of fileContents) {
      if (/[?&](next|redirect)=/.test(content) || /searchParams\.get\(["'](next|redirect)["']\)/.test(content)) {
        offenders.push(path.relative(SRC_DIR, file));
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe("Security: no hardcoded secrets outside NEXT_PUBLIC_* env var usage", () => {
  it("no source file contains a hardcoded Discord webhook URL other than the documented placeholder", () => {
    const offenders: string[] = [];
    const realWebhookPattern = /discord\.com\/api\/webhooks\/\d{10,}\/[A-Za-z0-9_-]{20,}/;
    for (const { file, content } of fileContents) {
      if (realWebhookPattern.test(content) && !content.includes("PLACEHOLDER")) {
        offenders.push(path.relative(SRC_DIR, file));
      }
    }
    expect(offenders).toEqual([]);
  });

  it("the discord webhook and booking URL are only ever read via process.env.NEXT_PUBLIC_* accessors (src/lib/env.ts), not duplicated ad hoc", () => {
    const envSource = readFileSync(path.join(SRC_DIR, "lib/env.ts"), "utf8");
    expect(envSource).toContain("NEXT_PUBLIC_DISCORD_WEBHOOK_URL");
    expect(envSource).toContain("NEXT_PUBLIC_BOOKING_URL");

    const otherFiles = fileContents.filter(({ file }) => !file.endsWith("lib/env.ts"));
    const offenders = otherFiles
      .filter(({ content }) => /process\.env\.NEXT_PUBLIC_(DISCORD_WEBHOOK_URL|BOOKING_URL|SITE_URL)/.test(content))
      .map(({ file }) => path.relative(SRC_DIR, file));
    expect(offenders, "process.env read ad hoc outside src/lib/env.ts").toEqual([]);
  });
});

describe("Security: error handling does not leak implementation details", () => {
  it("ContactForm's user-facing error copy never includes raw fetch/HTTP/stack terminology", () => {
    const source = readFileSync(path.join(SRC_DIR, "components/ContactForm.tsx"), "utf8");
    const friendlyMessages = source.match(/return\s+"[^"]*";/g) ?? [];
    for (const msg of friendlyMessages) {
      expect(msg).not.toMatch(/fetch|stack trace|TypeError|500|ECONNREFUSED/i);
    }
  });
});
