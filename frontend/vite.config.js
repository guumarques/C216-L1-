import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    // Os testes E2E (tests/e2e) são do Playwright, não do Vitest
    include: ["src/**/*.test.{js,jsx}"],
  },
});
