import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }), 
    tailwindcss({
      config: path.resolve(__dirname, 'tailwind.widget.config.js'),
    })
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/widget/main.tsx'),
      name: 'RainbowRelax',
      formats: ['iife'],
      fileName: () => 'rainbowRelax.js',
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined, // Disable chunking for single file
      },
    },
    outDir: 'dist-widget',
    sourcemap: false, // Disable sourcemaps for smaller bundle
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log statements in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.warn'],
        passes: 2, // Run compression multiple times
        unsafe: true, // Enable unsafe optimizations
        unsafe_comps: true,
        unsafe_Function: true,
        unsafe_math: true,
        unsafe_symbols: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true,
      },
      mangle: {
        safari10: true,
        properties: {
          regex: /^_/,
        },
      },
      format: {
        comments: false, // Remove all comments
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 500,
  },
  define: {
    'process.env.NODE_ENV': '"production"',
    __DEV__: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});


