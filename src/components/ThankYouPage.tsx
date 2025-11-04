import { useTranslation } from "react-i18next";
import { useAffirmationMessage } from "../hooks/useAffirmationMessages";
import { NavLinkWithParams } from "./common/NavLinkWithParams";

const ThankYouPage = () => {
  const { t, i18n } = useTranslation();
  const linkClass = "font-bold text-[#FFFFFF] text-base sm:text-lg md:text-xl lg:text-2xl mb-8 px-6 py-3 underline hover:opacity-80 transition z-2";
  const donateUrl = t("donate-url");
  const getHelpUrl = t("help-url");
  const lang = i18n.language.startsWith("es") ? "es" : "en"; 
  const message = useAffirmationMessage(lang);

  return (
    <div className="mt-10 flex flex-col items-center justify-center w-full gap-y-6 px-4 z-2">
      <h1 className="font-bold text-[#FFFFFF] text-center text-[clamp(2rem,5vw,3.125rem)] max-w-[90%] sm:max-w-[75%] md:max-w-[50%] mx-auto z-2">
        {message && (
          <p>{message}
          </p>
        )}
      </h1>
      <p className="text-center font-bold text-xl text-[#FFFFFF] max-w-[600px] z-2">
        {t("repeat-instruction")}
      </p> 
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4">
        <NavLinkWithParams to="/" className={linkClass}>
        {t("try-again-label")}
        </NavLinkWithParams>
        <a
          href={getHelpUrl}
          className={linkClass}
          target="_blank"
          rel="noopener"
        >
          {t("get-help-label")}
        </a>
      </div>
      <a
          href={donateUrl}
          className={linkClass}
          target="_blank"
          rel="noopener"
    >
          {t("Donate")}
        </a>
      
    </div>
  );
};

export default ThankYouPage;
