import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
  },
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  test: {
    environment: "jsdom",
    globals: true,
    include: ["frontend/src/**/*.test.{js,jsx}"],
    setupFiles: ["frontend/src/test-setup.js"],
  },
});
