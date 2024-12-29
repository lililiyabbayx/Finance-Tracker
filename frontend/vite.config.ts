// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // Output directory for the build
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Alias to "src"
    },
  },
  server: {
    port: 5173, // Development server port
  },
  preview: {
    port: 5173, // Production preview server port
    host: "0.0.0.0", // Allow access on local network
  },
});
