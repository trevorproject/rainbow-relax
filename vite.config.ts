import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: './', // Use relative paths for assets
  server: {
    host: true,
    port: 8085,
    strictPort: true,
    hmr: {
      port: 8085,
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
