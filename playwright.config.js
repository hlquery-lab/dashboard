import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  use: {
    baseURL: "http://127.0.0.1:5174",
    headless: true,
    reducedMotion: "reduce",
    screenshot: "only-on-failure",
    viewport: { width: 1440, height: 1080 },
  },
  webServer: {
    command: "npm run dev -- --strictPort",
    url: "http://127.0.0.1:5174",
    reuseExistingServer: !process.env.CI,
  },
});
