/**
 * Renders a JSON-LD <script type="application/ld+json"> block from a plain
 * data object. All JSON-LD content in this project comes from typed data
 * in src/data/* and src/lib/seo.ts — never from raw user input — so
 * serializing via JSON.stringify (with "<" escaped to prevent a
 * `</script>` breakout) is safe here.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
