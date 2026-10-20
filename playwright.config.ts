import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  forbidOnly: !!process.env.CI,
  workers: 2,
  use: {
    baseURL: "http://127.0.0.1:4322",
    launchOptions: { executablePath: process.env.CHROME_PATH || (existsSync("/usr/lib/chromium/chromium") ? "/usr/lib/chromium/chromium" : undefined) },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: { command: "node scripts/serve-build.mjs", url: "http://127.0.0.1:4322", reuseExistingServer: !process.env.CI },
});
