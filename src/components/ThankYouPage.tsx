import { useTranslation } from "react-i18next";
import { useAffirmationMessage } from "../hooks/useAffirmationMessages";
import { NavLink } from "react-router";
import SurveyInline from "./SurveyInline";

const ThankYouPage = () => {
  const { t, i18n } = useTranslation();
  const linkClass =
    "font-bold text-[#4E4E4E] text-base sm:text-lg md:text-xl lg:text-2xl mb-8 px-6 py-3 underline hover:opacity-80 transition";
  const donateUrl = t("donate-url");
  const getHelpUrl = t("help-url");
  const lang = i18n.language.startsWith("es") ? "es" : "en";
  const message = useAffirmationMessage(lang);

  const btnStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    padding: "12px 24px",
    borderRadius: 16,
    border: "1px solid rgba(0,0,0,0.12)",
    backgroundColor: "#C75A19",
    color: "#FFFFFF",
    textDecoration: "none",
    fontWeight: 700,
    cursor: "pointer",
  };


  const primaryBtnStyle: React.CSSProperties = {
    ...btnStyle,
    backgroundColor: "#2F5731",
    color: "#ffffff",
    border: "1px solid #2F5731",
  };

  return (
    <div className="mt-10 flex flex-col items-center justify-center w-full gap-y-6 px-4">
      <h1 className="font-bold text-[#4E4E4E] text-center text-[clamp(2rem,5vw,3.125rem)] max-w-[90%] sm:max-w-[75%] md:max-w-[50%] mx-auto">
        {message && (
          <p>{message}
          </p>
        )}
      </h1>

      <div className="survey-inline">
        <SurveyInline></SurveyInline>
      </div>

      <p className="text-center font-bold text-xl text-[#4E4E4E] max-w-[600px]">
        {t("repeat-instruction")}
      </p>

      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4">
        <NavLink to="/" className={linkClass} style={btnStyle} role="button">
          {t("try-again-label")}
        </NavLink>
        <NavLink
          to={getHelpUrl}
          className={linkClass}
          style={btnStyle}
          role="button"
        >
          {t("get-help-label")}
        </NavLink>
      </div>

      <NavLink
        to={donateUrl}
        className={linkClass}
        style={primaryBtnStyle}
        role="button"
      >
        {t("Donate")}
      </NavLink>
    </div>
  );
};

export default ThankYouPage;
