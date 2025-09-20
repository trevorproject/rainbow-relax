import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Simple cookie consent component for widget
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
  
  useEffect(() => {
    // Check if we're in widget mode and GTAG is provided in config
    if (typeof window !== 'undefined' && (window as any).myWidgetConfig) {
      const config = (window as any).myWidgetConfig;
      if (config.GTAG && config.GTAG.trim()) {
        setShouldShowConsent(true);
      }
    }
  }, []);

  const initializeWidgetGA = () => {
    if (typeof window === 'undefined' || !(window as any).myWidgetConfig) return;
    
    const config = (window as any).myWidgetConfig;
    const gtag = config.GTAG;
    
    if (!gtag || !gtag.trim()) return;

    // Create isolated dataLayer for widget
    (window as any).dataLayer_rl = (window as any).dataLayer_rl || [];
    
    // Create isolated gtag function
    function gtag_rl(...args: any[]) {
      (window as any).dataLayer_rl.push(args);
    }
    
    // Expose widget gtag globally for components to use
    (window as any).gtag_rl = gtag_rl;

    // Add GA4 script with custom dataLayer
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gtag}&l=dataLayer_rl`;
    document.head.appendChild(script);

    // Initialize GA4 with isolated settings
    gtag_rl('js', new Date());
    gtag_rl('config', gtag, {
      send_page_view: false, // Don't send automatic page views
      anonymize_ip: true,
      custom_map: {
        custom_parameter_1: 'widget_source'
      }
    });

    // Send initial widget load event
    gtag_rl('event', 'widget_loaded', {
      event_category: 'rainbow_relax_widget',
      event_label: 'widget_initialization',
      custom_parameter_1: 'rainbow_relax_embed'
    });

    console.log('Widget GA4 initialized with isolated dataLayer for ID:', gtag);
  };

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
        console.log('Widget GA4 declined by user');
      }}
    >
      {t("cookies2")}
    </WidgetCookieConsent>
  );
};

export default WidgetGA4;
