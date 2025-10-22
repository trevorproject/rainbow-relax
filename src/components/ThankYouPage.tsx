import { useTranslation } from "react-i18next";
import { useAffirmationMessage } from "../hooks/useAffirmationMessages";
import { NavLink } from "react-router";
import SurveyInline from "./SurveyInline";
import { getCookieConsentValue } from "react-cookie-consent";

const ThankYouPage = () => {
  const { t, i18n } = useTranslation();
  const linkClass = "inline-flex items-center justify-center min-h-12 px-6 py-3 rounded-2xl border border-black/10 font-bold text-base sm:text-lg md:text-xl lg:text-2xl transition focus:outline-none focus:ring-2 focus:ring-black/30 mb-8 bg-[#C75A19] text-white hover:opacity-95";
  const linkClassDonate = "inline-flex items-center justify-center min-h-12 px-6 py-3 rounded-2xl border border-[#2F5731] font-bold text-base sm:text-lg md:text-xl lg:text-2xl transition focus:outline-none focus:ring-2 focus:ring-black/30 mb-8 bg-[#2F5731] text-white hover:opacity-95" 
  const donateUrl = t("donate-url");
  const getHelpUrl = t("help-url");
  const lang = i18n.language.startsWith("es") ? "es" : "en";
  const message = useAffirmationMessage(lang);

  return (
    <div className="mt-10 flex flex-col items-center justify-center w-full gap-y-6 px-4">
      <h1 className="font-bold text-[#4E4E4E] text-center text-[clamp(2rem,5vw,3.125rem)] max-w-[90%] sm:max-w-[75%] md:max-w-[50%] mx-auto">
        {message && (
          <p>{message}
          </p>
        )}
      </h1>

      <div className="survey-inline">
        {getCookieConsentValue("cookie1") === "true" && <SurveyInline />}
      </div>

      <p className="text-center font-bold text-xl text-[#4E4E4E] max-w-[600px]">
        {t("repeat-instruction")}
      </p>

      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4">
        <NavLink to="/" className={linkClass}>
          {t("try-again-label")}
        </NavLink>
        <NavLink
          to={getHelpUrl}
          className={linkClass}
        >
          {t("get-help-label")}
        </NavLink>
      </div>

      <NavLink
        to={donateUrl}
        className={linkClassDonate}
      >
        {t("Donate")}
      </NavLink>
    </div>
  );
};

export default ThankYouPage;
