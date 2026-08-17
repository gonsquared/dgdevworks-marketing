import { defineConfig, devices } from "@playwright/test";

const PORT = 4310;
const BASE_URL = `http://127.0.0.1:${PORT}`;

/**
 * E2E config (E6-F1-S2): runs against the actual static export output
 * (`out/`) served as static files — a production-equivalent build, per the
 * story's acceptance criterion — rather than the Next dev server.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  timeout: 30_000,
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npx serve out -l ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
