import { useTranslation } from "react-i18next";
import { useAffirmationMessage } from "../hooks/useAffirmationMessages";
import { useNavigation } from "../utils/navigation";
import { useTailwindAdapter } from "../utils/tailwindAdapter";

const ThankYouPage = () => {
  const { t, i18n } = useTranslation();
  const { navigateTo } = useNavigation();
  const cn = useTailwindAdapter();
  
  // Action link styles - consistent styling for all action buttons/links
  const actionLinkClass = cn("font-bold text-black mb-8 px-6 py-3 underline hover:opacity-80 transition cursor-pointer");
  const donateUrl = t("donate-url");
  const getHelpUrl = t("help-url");
  const lang = i18n.language.startsWith("es") ? "es" : "en"; 
  const message = useAffirmationMessage(lang);

  const handleTryAgain = () => {
    navigateTo('/');
  };


  return (
    <div className={cn("mt-6 flex flex-col items-center justify-center w-full gap-y-4 px-4")} style={{ position: 'relative', zIndex: 1 }} data-testid="thank-you-page">
          <h1 
            className={cn("font-bold text-[#4E4E4E] text-center max-w-[90%] sm:max-w-[75%] md:max-w-[50%] mx-auto")}
            style={{ fontSize: "clamp(1rem, 2.5vw, 1.6rem)" }}
          >
        {message && (
          <p>{message}
          </p>
        )}
      </h1>
          <p className={cn("text-center font-bold text-[#4E4E4E] max-w-[600px]")} style={{ fontSize: "clamp(0.7rem, 1.8vw, 1rem)" }}>
            {t("repeat-instruction")}
          </p>
      <div className={cn("flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4")}>
        <a href="#" onClick={(e) => { e.preventDefault(); handleTryAgain(); }} className={actionLinkClass} style={{ fontSize: "clamp(0.6rem, 1.3vw, 0.8rem)" }}>
        {t("try-again-label")}
        </a>
        <a
          href={getHelpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={actionLinkClass}
          style={{ fontSize: "clamp(0.6rem, 1.3vw, 0.8rem)" }}
        >
          {t("get-help-label")}
        </a>
      </div>
      <a
          href={donateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={actionLinkClass}
          style={{ fontSize: "clamp(0.6rem, 1.3vw, 0.8rem)" }}
        >
          {t("Donate")}
        </a>
      
    </div>
  );
};

export default ThankYouPage;
