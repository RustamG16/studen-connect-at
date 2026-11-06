import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // GitHub Pages serves this repo at /studen-connect-at/
  base: mode === "production" ? "/studen-connect-at/" : "/",
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  // The home motion chunk is lazy: without this a cold dev cache finds them late and reloads mid-render.
  optimizeDeps: {
    include: ["gsap", "gsap/ScrollTrigger", "@gsap/react", "lenis"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
