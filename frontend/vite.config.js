import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // ✅ Vercel expects build output here
  },
  server: {
    port: 3000, // optional, for local dev
    open: true, // optional, opens browser on dev
  },
});
