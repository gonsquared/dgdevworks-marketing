// vitest-axe@0.1.0 declares its matchers.js entry point as `export type *`,
// which incorrectly makes its one real runtime export (`toHaveNoViolations`)
// unusable as a value under TypeScript's isolatedModules. This ambient
// override restores a correct, value-usable declaration for our test setup.
declare module "vitest-axe/matchers" {
  import type { AxeResults } from "axe-core";

  export function toHaveNoViolations(results: AxeResults): {
    pass: boolean;
    message: () => string;
    actual: unknown;
  };
}
