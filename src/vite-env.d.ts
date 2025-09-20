/// <reference types="vite/client" />

declare global {
  interface Window {
    myWidgetConfig?: {
      containerId?: string;
      showQuickExit?: boolean;
      donateURL?: string;
      getHelpURL?: string;
      GTAG?: string;
      width?: string;
      height?: string;
    };
    RainbowRelax?: {
      init: (config: any) => boolean;
      destroy: () => void;
      isInitialized: () => boolean;
      version: string;
    };
  }
}
