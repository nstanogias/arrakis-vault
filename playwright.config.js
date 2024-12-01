import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./__tests__",
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
  },
});