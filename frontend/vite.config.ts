import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Vite configuration
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // Output build directory
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Set alias to "src"
    },
  },
  server: {
    port: 5173, // Set the port for the dev server (optional, as you're running `npm run dev`)
  },
  preview: {
    port: 5173, // Set the port for the preview server (for production build preview)
  },
});
