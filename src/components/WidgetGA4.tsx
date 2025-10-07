import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

interface WidgetGA4Config {
  GTAG?: string;
  debug?: boolean;
  enhancedEcommerce?: boolean;
  customDimensions?: Record<string, string>;
  showConsentBanner?: boolean;
}

const WidgetCookieConsent = ({ 
  onAccept, 
  onDecline, 
  buttonText, 
  declineButtonText, 
  children 
}: {
  onAccept: (acceptedByScrolling: boolean) => void;
  onDecline: () => void;
  buttonText: string;
  declineButtonText: string;
  children: React.ReactNode;
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "#ff5a3e",
        color: "white",
        padding: "15px",
        zIndex: 9999,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px"
      }}
    >
      <div style={{ flex: 1, minWidth: "200px" }}>
        {children}
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={() => {
            setIsVisible(false);
            onDecline();
          }}
          style={{
            background: "transparent",
            border: "1px solid white",
            color: "white",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "13px"
          }}
        >
          {declineButtonText}
        </button>
        <button
          onClick={() => {
            setIsVisible(false);
            onAccept(false);
          }}
          style={{
            background: "#595c3fff",
            border: "none",
            color: "white",
            padding: "8px 16px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "13px"
          }}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

const WidgetGA4 = () => {
  const { t } = useTranslation();
  const [shouldShowConsent, setShouldShowConsent] = useState(false);
  
  const initializeWidgetGA = useCallback(() => {
    if (typeof window === 'undefined' || !window.myWidgetConfig) return;
    
    const config = window.myWidgetConfig as WidgetGA4Config;
    const gtag = config.GTAG;
    
    if (!gtag || !gtag.trim()) {
      console.warn('Widget GA4: No GTAG provided in configuration');
      return;
    }

    try {
      // Create isolated dataLayer for widget
      window.dataLayer_rl = window.dataLayer_rl || [];
      
      // Create isolated gtag function with enhanced error handling
      function gtag_rl(...args: unknown[]) {
        try {
          window.dataLayer_rl!.push(args);
          
          // Debug logging if enabled
          if (config.debug) {
            console.log('GA4 Event:', args);
          }
        } catch (error) {
          console.error('Widget GA4: Error pushing to dataLayer:', error);
        }
      }
      
      // Expose widget gtag globally for components to use
      window.gtag_rl = gtag_rl;

      // Add GA4 script with custom dataLayer and error handling
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gtag}&l=dataLayer_rl`;
      
      script.onerror = () => {
        console.error('Widget GA4: Failed to load Google Analytics script');
      };
      
      script.onload = () => {
        console.log('GA4: Script loaded');
      };
      
      document.head.appendChild(script);

      // Initialize GA4 with enhanced isolated settings
      gtag_rl('js', new Date());
      gtag_rl('config', gtag, {
        send_page_view: false, // Don't send automatic page views
        anonymize_ip: true,
        allow_google_signals: false, // Disable Google signals for privacy
        allow_ad_personalization_signals: false, // Disable ad personalization
        custom_map: {
          custom_parameter_1: 'widget_source',
          custom_parameter_2: 'widget_version'
        },
        // Add custom dimensions if provided
        ...(config.customDimensions && {
          custom_map: {
            ...config.customDimensions
          }
        })
      });

      // Send initial widget load event with enhanced tracking
      gtag_rl('event', 'widget_loaded', {
        event_category: 'rainbow_relax_widget',
        event_label: 'widget_initialization',
        custom_parameter_1: 'rainbow_relax_embed',
        custom_parameter_2: '1.0.0',
        value: 1
      });

      // Track widget configuration
      gtag_rl('event', 'widget_config', {
        event_category: 'rainbow_relax_widget',
        event_label: 'configuration',
        custom_parameter_1: config.debug ? 'debug_enabled' : 'debug_disabled',
        custom_parameter_2: config.enhancedEcommerce ? 'ecommerce_enabled' : 'ecommerce_disabled'
      });

      console.log('GA4 initialized for ID:', gtag);
      
      // Store initialization state
      if (typeof window !== 'undefined') {
        (window as any).widgetGA4Initialized = true;
      }
      
    } catch (error) {
      console.error('Widget GA4: Critical error during initialization:', error);
    }
  }, []);

  useEffect(() => {
    // Add a small delay to ensure config is fully loaded
    const timer = setTimeout(() => {
      // Check if we're in widget mode and GTAG is provided in config
      if (typeof window !== 'undefined' && (window as any).myWidgetConfig) {
        const config = (window as any).myWidgetConfig;
        console.log('[WidgetGA4] Config:', config);
        console.log('[WidgetGA4] showConsentBanner:', config.showConsentBanner);
        if (config.GTAG && config.GTAG.trim()) {
          if (config.showConsentBanner === false) {
            console.log('[WidgetGA4] Auto-initializing GA4 (no consent banner)');
            // Auto-initialize GA4 if consent banner is disabled
            initializeWidgetGA();
          } else {
            console.log('[WidgetGA4] Showing consent banner');
            // Show consent banner by default
            setShouldShowConsent(true);
          }
        }
      } else {
        console.log('[WidgetGA4] No config found or window not available');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [initializeWidgetGA]);

  // Cleanup function for widget destruction
  useEffect(() => {
    return () => {
      // Clean up GA4 when component unmounts
      if (typeof window !== 'undefined' && (window as any).widgetGA4Initialized) {
        try {
          // Send widget unload event
          if (window.gtag_rl) {
            window.gtag_rl('event', 'widget_unloaded', {
              event_category: 'rainbow_relax_widget',
              event_label: 'widget_destruction',
              custom_parameter_1: 'rainbow_relax_embed'
            });
          }
          
          // Clear the dataLayer
          if (window.dataLayer_rl) {
            window.dataLayer_rl.length = 0;
          }
          
          // Remove global references
          delete (window as any).gtag_rl;
          delete (window as any).dataLayer_rl;
          delete (window as any).widgetGA4Initialized;
          
          console.log('GA4: Cleaned up');
        } catch (error) {
          console.error('Widget GA4: Error during cleanup:', error);
        }
      }
    };
  }, []);

  if (!shouldShowConsent) {
    return null;
  }

  return (
    <WidgetCookieConsent
      buttonText={t("acceptcookie")}
      declineButtonText={t("declinecookie")}
      onAccept={(acceptedByScrolling) => {
        if (acceptedByScrolling) {
          // triggered if user scrolls past threshold
        } else {
          // Initialize isolated GA4
          initializeWidgetGA();
        }
      }}
      onDecline={() => {
        console.log('GA4 declined by user');
        // Track decline event
        if (window.gtag_rl) {
          window.gtag_rl('event', 'widget_ga_declined', {
            event_category: 'rainbow_relax_widget',
            event_label: 'user_consent',
            custom_parameter_1: 'consent_declined'
          });
        }
      }}
    >
      {t("cookies2")}
    </WidgetCookieConsent>
  );
};


export default WidgetGA4;
