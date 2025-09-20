import React from 'react';
import { createRoot } from 'react-dom/client';
import WidgetAppShell from './WidgetApp';

// Widget configuration interface
export interface WidgetConfig {
  containerId: string;
  showQuickExit?: boolean;
  donateURL?: string;
  getHelpURL?: string;
  GTAG?: string;
  width?: string;
  height?: string;
  cdnBase?: string; // Optional CDN base URL for assets
}

// Global widget API
export class RainbowRelaxWidget {
  private root: any = null;
  private container: HTMLElement | null = null;
  private config: WidgetConfig | null = null;

  init(config: WidgetConfig): boolean {
    try {
      // Validate required config
      if (!config.containerId) {
        console.warn('Rainbow Relax: containerId is required');
        return false;
      }

      // Find container element
      const container = document.getElementById(config.containerId);
      if (!container) {
        console.warn(`Rainbow Relax: Container with id "${config.containerId}" not found`);
        return false;
      }

      // Check if already initialized
      if (this.root && this.container) {
        console.warn('Rainbow Relax: Widget already initialized');
        return false;
      }

      // Store config and container
      this.config = config;
      this.container = container;

      // Set container styles
      this.setupContainer();

            // Store config globally for components to access
            if (typeof window !== 'undefined') {
              (window as any).myWidgetConfig = config;
      }

      // Create React root and render
      this.root = createRoot(container);
      this.root.render(
        React.createElement(React.StrictMode, null,
          React.createElement(WidgetAppShell, null)
        )
      );

      console.log('Rainbow Relax: Widget initialized successfully');
      return true;
    } catch (error) {
      console.error('Rainbow Relax: Failed to initialize widget:', error);
      return false;
    }
  }

  private setupContainer(): void {
    if (!this.container || !this.config) return;

    // Apply width and height if specified
    if (this.config.width) {
      this.container.style.width = this.config.width;
    }
    if (this.config.height) {
      this.container.style.height = this.config.height;
    }

    this.container.style.position = 'relative';
    this.container.style.overflow = 'visible'; // Allow animations to be visible
    this.container.style.boxSizing = 'border-box';
    
    // Ensure minimum dimensions if not specified
    if (!this.config.width) {
      this.container.style.width = '100%';
    }
    if (!this.config.height) {
      this.container.style.height = '600px'; // Fixed height instead of minHeight
    }
    
    // Ensure the container can properly contain the content
    this.container.style.display = 'block';
  }

  destroy(): void {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    
    if (this.container) {
      this.container.innerHTML = '';
      this.container = null;
    }
    
    this.config = null;
    
    // Clean up global config
        if (typeof window !== 'undefined') {
          delete (window as any).myWidgetConfig;
    }
    
    console.log('Rainbow Relax: Widget destroyed');
  }

  getVersion(): string {
    return '1.0.0';
  }

  isInitialized(): boolean {
    return !!(this.root && this.container);
  }
}

// Global API setup
function setupGlobalAPI() {
  if (typeof window === 'undefined') return;

  // Keep track of widget instances
  let primaryWidget: RainbowRelaxWidget | null = null;

  // Create global namespace
  (window as any).RainbowRelax = {
    init: (config: WidgetConfig) => {
      // If we already have a primary widget, destroy it first
      if (primaryWidget) {
        primaryWidget.destroy();
      }
      primaryWidget = new RainbowRelaxWidget();
      return primaryWidget.init(config);
    },
    destroy: () => {
      if (primaryWidget) {
        primaryWidget.destroy();
        primaryWidget = null;
      }
    },
    version: '1.0.0',
    isInitialized: () => {
      return primaryWidget ? primaryWidget.isInitialized() : false;
    },
    // Allow creating multiple instances for advanced use cases
    createInstance: () => new RainbowRelaxWidget(),
  };

  // Auto-init if config is present
  if ((window as any).myWidgetConfig) {
    const config = (window as any).myWidgetConfig as WidgetConfig;
    if (config.containerId) {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          (window as any).RainbowRelax.init(config);
        });
      } else {
        (window as any).RainbowRelax.init(config);
      }
    }
  }
}

// Initialize global API when script loads
setupGlobalAPI();

export default RainbowRelaxWidget;
