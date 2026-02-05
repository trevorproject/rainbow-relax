import { useEffect, useRef, useCallback, useState } from "react";
import ReactGA from "react-ga4";
import ConsentBanner from "./ConsentBanner";
import { track, setGA4Ready, EVENTS } from "../analytics/track";
import { useTranslation } from "react-i18next";
import { getGAConsentValue, setGAConsentValue, hasGAConsent } from "../utils/gaConsent";

export default function GA4() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language?.startsWith("es") ? "es" : "en";
  const MEASUREMENT_ID = import.meta.env.VITE_GTAG as string | undefined;
  const inited = useRef(false);
  const consentShownRef = useRef(false);
  
  const [showConsent, setShowConsent] = useState(() => {
    const consentValue = getGAConsentValue();
    return !hasGAConsent() && consentValue !== "false";
  });

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

    ReactGA.initialize(MEASUREMENT_ID, { gaOptions: { anonymizeIp: true } });
    inited.current = true;

    setGA4Ready(true);
  }, [MEASUREMENT_ID]);

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
      <ConsentBanner
        acceptButtonText={t("acceptcookie")}
        declineButtonText={t("declinecookie")}
        style={{ background: "#ff5a3e" }}
        buttonStyle={{ color: "#595c3fff", fontSize: "13px" }}
        onAccept={(acceptedByScrolling) => {
          setGAConsentValue("true");
          setShowConsent(false);
          track(EVENTS.CONSENT_ACCEPTED, {
            locale,
            accepted_by_scrolling: Boolean(acceptedByScrolling),
          });
        }}
        onDecline={() => {
          setGAConsentValue("false");
          setShowConsent(false);
          track(EVENTS.CONSENT_DECLINED, { locale });
        }}
      >
        {t("cookies2")}
      </ConsentBanner>
    );
  }

  return (
    <ConsentBanner
      acceptButtonText={t("acceptcookie")}
      declineButtonText={t("declinecookie")}
      style={{ background: "#ff5a3e" }}
      buttonStyle={{ color: "#595c3fff", fontSize: "13px" }}
      onAccept={(acceptedByScrolling) => {
        setGAConsentValue("true");
        setShowConsent(false);
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
      onDecline={() => {
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
    </ConsentBanner>
  );
}
