import React from 'react';
import { createRoot } from 'react-dom/client';
import { WidgetAppShell } from './WidgetApp';
import { assetLoader } from './AssetLoader';
import { normalizeWidgetConfig, getScriptBaseUrl } from '../utils/widgetEnvironment';
import type { WidgetRuntimeConfig } from '../utils/widgetEnvironment';

// Make React available globally for the widget
(window as typeof window & { React?: typeof React }).React = React;
(window as typeof window & { ReactDOM?: typeof import('react-dom') }).ReactDOM = { createRoot } as any;

// Make asset loader available globally immediately
(window as typeof window & { assetLoader?: typeof assetLoader }).assetLoader = assetLoader;

// Make detectWidgetMode available globally
import { detectWidgetMode } from '../utils/widgetEnvironment';
(window as typeof window & { detectWidgetMode?: typeof detectWidgetMode }).detectWidgetMode = detectWidgetMode;

// Widget configuration interface
type WidgetConfig = WidgetRuntimeConfig;

// Extend global window object
declare global {
  interface Window {
    myWidgetConfig?: WidgetConfig;
    MyWidget?: {
      init: (config: WidgetConfig) => void;
      destroy?: () => void;
    };
    dataLayer_rl?: unknown[];
    gtag_rl?: (...args: unknown[]) => void;
  }
}

(function () {
  function loadWidgetCSS() {
    // Check if CSS is already loaded
    if (document.querySelector('link[href*="rainbow-relax.css"]')) {
      return;
    }
    
    const scriptBaseUrl = getScriptBaseUrl();
    const cssUrl = `${scriptBaseUrl}rainbow-relax.css`;
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssUrl;
    link.onerror = () => {
      console.warn('[Widget] Failed to load CSS');
    };
    document.head.appendChild(link);
  }

  function initWidget(config: WidgetConfig = {}) {
    const containerId = config.containerId || 'rainbow-relax-container';
    const container = document.getElementById(containerId);
    
    if (!container) {
      console.warn(`[Widget] Container "${containerId}" not found.`);
      return false;
    }

    // Load CSS first
    loadWidgetCSS();


    const normalized = normalizeWidgetConfig({ ...config, containerId });
    const finalConfig: WidgetConfig = {
      showQuickExit: normalized.showQuickExit ?? false,
      donateURL: normalized.donateURL || 'https://www.paypal.com/donate/?hosted_button_id=G5E9W3NZ8D7WW',
      getHelpURL: normalized.getHelpURL || 'https://www.thetrevorproject.mx/ayuda/',
      GTAG: normalized.GTAG || 'G-XXX',
      showConsentBanner: normalized.showConsentBanner ?? true,
      width: normalized.width || '500px',
      height: normalized.height || '500px',
      containerId,
      cdnBase: normalized.cdnBase || getScriptBaseUrl(),
      assetBase: normalized.assetBase || normalized.cdnBase || getScriptBaseUrl(),
      audioBase: normalized.audioBase || normalized.cdnBase || `${getScriptBaseUrl()}sounds/`,
      audioEnabled: normalized.audioEnabled !== false,
      debug: normalized.debug || false,
    };

    window.myWidgetConfig = finalConfig;

    const assetBase = finalConfig.assetBase || finalConfig.cdnBase || getScriptBaseUrl();
    assetLoader.setCDNBase(assetBase);
    assetLoader.preloadCriticalAssets().catch(() => {
      console.warn('[Widget] Failed to preload critical assets');
    });

    // Make asset loader available globally for components
    (window as typeof window & { assetLoader?: typeof assetLoader }).assetLoader = assetLoader;
    
    // Trigger custom event to notify components that widget is ready
    window.dispatchEvent(new CustomEvent('widgetReady', { detail: finalConfig }));

    // Apply container styles for widget mode (fixed dimensions)
    container.style.width = finalConfig.width || '500px';
    container.style.height = finalConfig.height || '500px';
    container.style.position = 'relative';
    container.style.overflow = 'hidden';
    container.style.backgroundColor = '#F3E9DC';
    container.style.fontFamily = "'Manrope', sans-serif";
    
    // Add data-testid for testing
    container.setAttribute('data-testid', 'rainbow-relax-container');

    // Clear any existing content
    container.innerHTML = '';

    try {
      const root = createRoot(container);
      root.render(React.createElement(WidgetAppShell));
      
      
      if (config.debug) {
        console.log('[Widget] Container initialized');
      }
      
      return true;
    } catch (error) {
      console.error('[Widget] Failed to initialize widget:', error);
      return false;
    }
  }

  function destroyWidget() {
    const container = document.getElementById('rainbow-relax-container') || 
                     document.querySelector('[id*="widget-container"]');
    if (container) {
      container.innerHTML = '';
    }
  }

  // Expose globally
  window.MyWidget = { init: initWidget, destroy: destroyWidget };

  // Auto-initialization function
  function tryAutoInit() {
    // Try to find a container with the default ID
    const defaultContainer = document.getElementById('rainbow-relax-container');
    
    if (defaultContainer) {
      const config = window.myWidgetConfig || {};
      initWidget(config);
    } else if (window.myWidgetConfig) {
      initWidget(window.myWidgetConfig);
    }
  }

  // Try auto-init immediately
  tryAutoInit();

  // Also try after DOM is loaded in case container isn't ready yet
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryAutoInit);
  }
})();

// Force this file to be treated as having side effects

export {};
