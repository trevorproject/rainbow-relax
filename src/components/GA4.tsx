import { useEffect, useRef } from "react";
import ReactGA from "react-ga4";
import CookieConsent, { getCookieConsentValue } from "react-cookie-consent";
import { useTranslation } from "react-i18next";

export default function GA4() {
  const { t } = useTranslation();
  const gtag = import.meta.env.VITE_GTAG;	
  if (gtag==null)
  {
    return null
  }else
  {
    return (
      <CookieConsent
        location="bottom"
        buttonText={t("acceptcookie")}
        cookieName="cookie1"
        style={{ background: "#ff5a3e" }}
        buttonStyle={{ color: "#595c3fff", fontSize: "13px" }}
        expires={150}
         onAccept={(acceptedByScrolling) => {
         if (!acceptedByScrolling) {
           ReactGA.initialize(gtag, {
           gaOptions: {
           anonymizeIp: true,
           },
         })
         }
        }}
        enableDeclineButton flipButtons
        declineButtonText={t("declinecookie")}
          onDecline={() => {
        }}

  useEffect(() => {
    ReactGA.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      ad_storage: "denied",
    });
  }, []);

  const safeInit = () => {
    if (inited.current || !MEASUREMENT_ID) return;
    ReactGA.initialize(MEASUREMENT_ID, { gaOptions: { anonymizeIp: true } });
    inited.current = true;
  };

  useEffect(() => {
    const hasConsent = getCookieConsentValue("cookie1") === "true";
    if (hasConsent) {
      safeInit();
      ReactGA.gtag("consent", "update", {
        analytics_storage: "granted",
        ad_user_data: "denied",
        ad_personalization: "denied",
        ad_storage: "denied",
      });
    }
  }, []);

  return (
    <CookieConsent
      location="bottom"
      buttonText={t("acceptcookie")}
      cookieName="cookie1"
      style={{ background: "#ff5a3e" }}
      buttonStyle={{ color: "#595c3fff", fontSize: "13px" }}
      expires={150}
      onAccept={() => {

        safeInit();
        ReactGA.gtag("consent", "update", {
          analytics_storage: "granted",
          ad_user_data: "denied",
          ad_personalization: "denied",
          ad_storage: "denied",
        });
      }}
      enableDeclineButton
      flipButtons
      declineButtonText={t("declinecookie")}
      onDecline={() => {
        ReactGA.gtag("consent", "update", {
          analytics_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
          ad_storage: "denied",
        });
      }}
    >
      {t("cookies2")}
    </CookieConsent>
  );
}
