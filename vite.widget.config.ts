import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

const resolveRoot = (...segments: string[]) => path.resolve(__dirname, ...segments);

const copyDirectory = (source: string, destination: string) => {
  if (!fs.existsSync(source)) {
    return;
  }

  fs.mkdirSync(destination, { recursive: true });
  const entries = fs.readdirSync(source, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(source, entry.name);
    const destPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

const widgetPackagingPlugin = () => ({
  name: 'widget-packaging',
  apply: 'build',
  closeBundle() {
    const outDir = resolveRoot('dist-widget');
    const widgetDir = path.join(outDir, 'widget');

    if (fs.existsSync(widgetDir)) {
      fs.rmSync(widgetDir, { recursive: true, force: true });
    }
    fs.mkdirSync(widgetDir, { recursive: true });

    const bundleJs = path.join(outDir, 'rainbowRelax.js');
    if (fs.existsSync(bundleJs)) {
      fs.copyFileSync(bundleJs, path.join(widgetDir, 'rainbowRelax.js'));
    }

    const styleCss = path.join(outDir, 'style.css');
    const widgetCss = path.join(widgetDir, 'rainbow-relax.css');
    if (fs.existsSync(styleCss)) {
      fs.copyFileSync(styleCss, widgetCss);
      fs.copyFileSync(styleCss, path.join(outDir, 'rainbow-relax.css'));
    }

    const publicWidgetCss = resolveRoot('public', 'widget', 'rainbow-relax.css');
    if (!fs.existsSync(widgetCss) && fs.existsSync(publicWidgetCss)) {
      fs.copyFileSync(publicWidgetCss, widgetCss);
    }

    // Copy sounds from src/assets/sounds to dist-widget/sounds
    const srcSoundsDir = resolveRoot('src', 'assets', 'sounds');
    const widgetSoundsDir = path.join(widgetDir, 'sounds');
    if (fs.existsSync(srcSoundsDir)) {
      copyDirectory(srcSoundsDir, widgetSoundsDir);
    }

    // Copy logo assets from src/assets to dist-widget
    const srcAssetsDir = resolveRoot('src', 'assets');
    const widgetAssetsDir = path.join(widgetDir, 'assets');
    if (fs.existsSync(srcAssetsDir)) {
      copyDirectory(srcAssetsDir, widgetAssetsDir);
    }

    // Also copy to root dist-widget for direct access
    const distSoundsDir = path.join(outDir, 'sounds');
    if (fs.existsSync(srcSoundsDir)) {
      copyDirectory(srcSoundsDir, distSoundsDir);
    }

    const distAssetsDir = path.join(outDir, 'assets');
    if (fs.existsSync(srcAssetsDir)) {
      copyDirectory(srcAssetsDir, distAssetsDir);
    }
  },
});

export default defineConfig({
  mode: 'production',
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
    widgetPackagingPlugin(),
  ],
  css: {
    postcss: './postcss.widget.config.js',
  },
  build: {
    lib: {
      entry: resolveRoot('src/widget/main.tsx'),
      name: 'RainbowRelaxWidget',
      formats: ['iife'],
      fileName: () => 'rainbowRelax.js',
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined, // Disable chunking for single file
      },
      treeshake: {
        moduleSideEffects: true, // Allow side effects for widget initialization
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
        unknownGlobalSideEffects: false,
        preset: 'recommended',
      },
    },
    outDir: 'dist-widget',
    sourcemap: false, // Disable sourcemaps for smaller bundle
    minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: false, // Remove console.log statements in production
            drop_debugger: true,
        passes: 5, // TODO: Bundle optimization - Increased compression passes
        unsafe: true, // Enable unsafe optimizations
        unsafe_comps: true,
        unsafe_Function: true,
        unsafe_math: true,
        unsafe_symbols: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true,
        // Additional aggressive optimizations
        dead_code: true,
        evaluate: true,
        hoist_funs: true,
        hoist_vars: true,
        if_return: true,
        join_vars: true,
        loops: true,
        reduce_vars: true,
        sequences: true,
        side_effects: false,
        unused: true,
        // TODO: Bundle optimization - Additional compression options
        // FIXME: These may break some code, test thoroughly
        collapse_vars: true,
        conditionals: true,
        comparisons: true,
        booleans: true,
        typeofs: true,
        inline: 2,
        keep_fargs: false,
        keep_fnames: false,
        keep_infinity: false,
        negate_iife: true,
        properties: true,
        pure_getters: true,
        pure_new: true,
        reduce_funcs: true,
        switches: true,
        toplevel: true,
        top_retain: false,
        warnings: false,
      },
      mangle: {
        safari10: true,
        properties: {
          regex: /^_/,
        },
        toplevel: true,
      },
      format: {
        comments: false, // Remove all comments
        ascii_only: true,
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 500,
    target: 'es2015', // Target modern browsers for smaller bundle
  },
  define: {
    'process.env.NODE_ENV': '"production"',
    __DEV__: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: [
      // Exclude heavy dependencies that can be tree-shaken
      'framer-motion',
      'i18next',
      'i18next-browser-languagedetector',
      'react-i18next',
      'react-cookie-consent',
      'react-cookie',
      'react-ga4',
      'howler',
      'lucide-react',
    ],
  },
      // Additional optimizations
      esbuild: {
        drop: ['debugger'], // Remove console statements in production
        legalComments: 'none',
      },
});
