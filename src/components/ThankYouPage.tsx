import { useTranslation } from "react-i18next";
import { useAffirmationMessage } from "../hooks/useAffirmationMessages";
import { NavLink } from "react-router";

const ThankYouPage = () => {
  const { t, i18n } = useTranslation();
  const linkClass = "font-bold text-[#4E4E4E] text-base sm:text-lg md:text-xl lg:text-2xl mb-8 px-6 py-3 underline hover:opacity-80 transition";
  const donateUrl = import.meta.env.VITE_DONATE_URL;
  const getHelpUrl = import.meta.env.VITE_GET_HELP;
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
          to= {donateUrl}
          className={linkClass}
    >
          {t("Donate")}
        </NavLink>
      
    </div>
  );
};

export default ThankYouPage;