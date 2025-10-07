import ReactGA from "react-ga4";
import CookieConsent from "react-cookie-consent";
import { useTranslation } from "react-i18next";

const GA4 = () => {
  const { t } = useTranslation();
  var gtag = import.meta.env.VITE_GTAG;	
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

      >
        {t("cookies2")}


      </CookieConsent>)
    }
  }
export default GA4;
