import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 8084,
    strictPort: true,
    hmr: {
      port: 8084,
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});
