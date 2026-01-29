import { useEffect, useRef, useCallback, useState } from "react";
import ReactGA from "react-ga4";
import CookieConsent from "react-cookie-consent";
import { track, setGA4Ready, EVENTS } from "../analytics/track";
import { useTranslation } from "react-i18next";
import { getGAConsentValue, setGAConsentValue, hasGAConsent } from "../utils/gaConsent";

/**
 * GA4 Component - Manages Google Analytics consent and initialization
 * 
 * Uses localStorage-based consent storage (via gaConsent utility) for cross-origin iframe compatibility.
 * Cookies are blocked in cross-origin iframes, so localStorage is the primary storage mechanism.
 */
export default function GA4() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith("es") ? "es" : "en";
  const MEASUREMENT_ID = import.meta.env.VITE_GTAG as string | undefined;
  const inited = useRef(false);
  const consentShownRef = useRef(false);
  
  // Show consent banner if user hasn't granted consent and hasn't explicitly declined
  // Uses localStorage-based consent check (works in cross-origin iframes)
  const [showConsent, setShowConsent] = useState(() => {
    const consentValue = getGAConsentValue();
    return !hasGAConsent() && consentValue !== "false";
  });

  // Track when consent banner is shown (only once per session)
  useEffect(() => {
    const hasConsent = hasGAConsent();
    if (!hasConsent && !consentShownRef.current) {
      track(EVENTS.CONSENT_SHOWN, { locale });
      consentShownRef.current = true;
    }
  }, [locale]);

  useEffect(() => {
    ReactGA.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      ad_storage: "denied",
    });
  }, []);

  const safeInit = useCallback(() => {
    if (inited.current || !MEASUREMENT_ID) return;

    // Initialize GA4 - it will automatically use localStorage when cookies are blocked
    // (e.g., in cross-origin iframes where third-party cookies are blocked)
    // GA4's default behavior handles cookie blocking gracefully
    ReactGA.initialize(MEASUREMENT_ID, { gaOptions: { anonymizeIp: true } });
    inited.current = true;

    setGA4Ready(true);
  }, [MEASUREMENT_ID]);

  // Initialize GA4 if consent was already granted (e.g., from previous visit)
  useEffect(() => {
    const hasConsent = hasGAConsent();
    if (hasConsent) {
      safeInit();
      ReactGA.gtag("consent", "update", {
        analytics_storage: "granted",
        ad_user_data: "denied",
        ad_personalization: "denied",
        ad_storage: "denied",
      });
    }
  }, [safeInit]);

  if (!showConsent) return null;

  if (!MEASUREMENT_ID) {
    return (
      <CookieConsent
        location="bottom"
        buttonText={t("acceptcookie")}
        cookieName="cookie1"
        style={{ background: "#ff5a3e" }}
        buttonStyle={{ color: "#595c3fff", fontSize: "13px" }}
        expires={150}
      onAccept={(acceptedByScrolling) => {
        // Store consent in localStorage (works in cross-origin iframes)
        setGAConsentValue("true");
        setShowConsent(false);
        track(EVENTS.CONSENT_ACCEPTED, {
          locale,
          accepted_by_scrolling: Boolean(acceptedByScrolling),
        });
      }}
      enableDeclineButton
      flipButtons
      declineButtonText={t("declinecookie")}
      onDecline={() => {
        // Store declined consent in localStorage
        setGAConsentValue("false");
        setShowConsent(false);
        track(EVENTS.CONSENT_DECLINED, { locale });
      }}
      >
        {t("cookies2")}
      </CookieConsent>
    );
  }

  return (
    <CookieConsent
      location="bottom"
      buttonText={t("acceptcookie")}
      cookieName="cookie1"
      style={{ background: "#ff5a3e" }}
      buttonStyle={{ color: "#595c3fff", fontSize: "13px" }}
      expires={150}
      onAccept={(acceptedByScrolling) => {
        // Store consent in localStorage (works in cross-origin iframes)
        setGAConsentValue("true");
        setShowConsent(false);
        // Initialize GA4 immediately if user clicked accept (not scrolled)
        if (!acceptedByScrolling) {
          safeInit();
          ReactGA.gtag("consent", "update", {
            analytics_storage: "granted",
            ad_user_data: "denied",
            ad_personalization: "denied",
            ad_storage: "denied",
          });
        }
        track(EVENTS.CONSENT_ACCEPTED, {
          locale,
          accepted_by_scrolling: Boolean(acceptedByScrolling),
        });
      }}
      enableDeclineButton
      flipButtons
      declineButtonText={t("declinecookie")}
      onDecline={() => {
        // Store declined consent in localStorage
        setGAConsentValue("false");
        setShowConsent(false);
        ReactGA.gtag("consent", "update", {
          analytics_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
          ad_storage: "denied",
        });
        track(EVENTS.CONSENT_DECLINED, { locale });
      }}
    >
      {t("cookies2")}
    </CookieConsent>
  );
}
