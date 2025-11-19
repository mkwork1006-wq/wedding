import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/tomotomo-wedding/",
  plugins: [react()],
  server: {
    fs: {
      strict: true
    }
  }
});
