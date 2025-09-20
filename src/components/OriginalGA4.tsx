import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

// Simple cookie consent component to replace react-cookie-consent
const SimpleCookieConsent = ({ 
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

const OriginalGA4 = () => {
  const { t } = useTranslation();
  const [shouldShowConsent, setShouldShowConsent] = useState(false);
  
  useEffect(() => {
    const gtag = import.meta.env.VITE_GTAG;
    // In development, we can force show consent for layout testing by checking a dev flag
    const isDev = import.meta.env.DEV;
    const forceShowConsent = isDev && import.meta.env.VITE_FORCE_SHOW_GA_CONSENT === 'true';
    
    if (gtag || forceShowConsent) {
      setShouldShowConsent(true);
    }
  }, []);

  const initializeGA = () => {
    const gtag = import.meta.env.VITE_GTAG;
    const isDev = import.meta.env.DEV;
    const forceShowConsent = isDev && import.meta.env.VITE_FORCE_SHOW_GA_CONSENT === 'true';
    
    // Don't initialize GA if it's just for development consent testing
    if (!gtag && forceShowConsent) {
      console.log('GA4 consent shown for development layout testing only');
      return;
    }
    
    if (!gtag) return;

    // Add GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gtag}`;
    document.head.appendChild(script);

    // Initialize GA4
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag_fn(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag_fn;

    gtag_fn('js', new Date());
    gtag_fn('config', gtag, {
      anonymize_ip: true,
    });

    console.log('GA4 initialized with ID:', gtag);
  };

  if (!shouldShowConsent) {
    return null;
  }

  return (
    <SimpleCookieConsent
      buttonText={t("acceptcookie")}
      declineButtonText={t("declinecookie")}
      onAccept={(acceptedByScrolling) => {
        if (acceptedByScrolling) {
          // triggered if user scrolls past threshold
        } else {
          // Initialize GA4
          initializeGA();
        }
      }}
      onDecline={() => {
        console.log('GA4 declined by user');
      }}
    >
      {t("cookies2")}
    </SimpleCookieConsent>
  );
};

export default OriginalGA4;
