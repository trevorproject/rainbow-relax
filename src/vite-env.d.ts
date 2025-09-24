/// <reference types="vite/client" />

import type { WidgetRuntimeConfig } from "./utils/widgetEnvironment";

// Global window types
declare global {
  interface Window {
    myWidgetConfig?: WidgetRuntimeConfig;
    MyWidget?: {
      init: (config: WidgetRuntimeConfig) => void;
      destroy?: () => void;
    };
    dataLayer_rl?: unknown[];
    gtag_rl?: (...args: unknown[]) => void;
  }
}

export type WidgetConfig = WidgetRuntimeConfig;
