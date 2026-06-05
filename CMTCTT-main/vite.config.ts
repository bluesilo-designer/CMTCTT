import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  // Explicitly enable SPA history fallback — prevents 404 on hard refresh/direct URL
  appType: "spa",
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    host: true,
    headers: {
      "Cache-Control": "no-store",
    },
  },
  // Same fallback for `vite preview` (serving the built dist/)
  preview: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    host: true,
  },
});
