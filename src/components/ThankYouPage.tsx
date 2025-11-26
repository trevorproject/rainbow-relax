import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAffirmationMessage } from "../hooks/useAffirmationMessages";
import { NavLinkWithParams } from "./common/NavLinkWithParams";
import { getCookieConsentValue } from "react-cookie-consent";
import SurveyInline from "./SurveyInline";
import { track, EVENTS } from "../analytics/track";

const ThankYouPage = () => {
  const { t, i18n } = useTranslation();
  const linkClass =
    "inline-flex items-center justify-center min-h-12 px-6 py-3 rounded-2xl border border-black/10 font-bold text-base sm:text-lg md:text-xl lg:text-2xl transition focus:outline-none focus:ring-2 focus:ring-black/30 mb-8 bg-[var(--color-button)] text-white hover:opacity-95";
  const donateUrl = t("donate-url");
  const getHelpUrl = t("help-url");
  const lang = i18n.language.startsWith("es") ? "es" : "en";
  const message = useAffirmationMessage(lang);

  useEffect(() => {
    track(EVENTS.THANK_YOU_VIEWED, { locale: lang });
  }, [lang]);

  return (
    <div className="mt-10 flex flex-col items-center justify-center w-full gap-y-6 px-4 text-[white]">
      <h1 className="font-bold text-center text-[clamp(2rem,5vw,3.125rem)] max-w-[90%] sm:max-w-[75%] md:max-w-[50%] mx-auto">
        {message && <p>{message}</p>}
      </h1>

      <div className="survey-inline">
        {getCookieConsentValue("cookie1") === "true" && <SurveyInline />}
      </div>

      <p className="text-center font-bold text-xl text-[white] max-w-[600px]">
        {t("repeat-instruction")}
      </p>

      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4">
        <NavLinkWithParams
          to="/"
          className={linkClass}
          onClick={() =>
            track(EVENTS.TRY_AGAIN_CLICK, {
              screen: "thank_you",
              locale: lang,
            })
          }
        >
          {t("try-again-label")}
        </NavLinkWithParams>
        <a
          href={getHelpUrl}
          className={linkClass}
          target="_blank"
          rel="noopener"
          onClick={() =>
            track(EVENTS.GET_HELP_CLICK, {
              screen: "thank_you",
              locale: lang,
              source: "thank_you",
            })
          }
        >
          {t("get-help-label")}
        </a>
      </div>
      <a
        href={donateUrl}
        className={linkClass}
        target="_blank"
        rel="noopener"
        onClick={() =>
          track(EVENTS.DONATE_CLICK, {
            screen: "thank_you",
            locale: lang,
            source: "thank_you",
          })
        }
      >
        {t("Donate")}
      </a>
    </div>
  );
};

export default ThankYouPage;