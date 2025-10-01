import { useTranslation } from "react-i18next";
import { useAffirmationMessage } from "../hooks/useAffirmationMessages";
import { useNavigation } from "../utils/navigation";

const ThankYouPage = () => {
  const { t, i18n } = useTranslation();
  const { navigateTo } = useNavigation();
      const linkClass = "rr-font-bold rr-text-black rr-mb-8 rr-px-6 rr-py-3 rr-underline hover:rr-opacity-80 rr-transition rr-cursor-pointer";
  const donateUrl = t("donate-url");
  const getHelpUrl = t("help-url");
  const lang = i18n.language.startsWith("es") ? "es" : "en"; 
  const message = useAffirmationMessage(lang);

  const handleTryAgain = () => {
    navigateTo('/');
  };

  const handleGetHelp = () => {
    window.open(getHelpUrl, '_blank');
  };

  const handleDonate = () => {
    window.open(donateUrl, '_blank');
  };

  return (
    <div className="rr-mt-6 rr-flex rr-flex-col rr-items-center rr-justify-center rr-w-full rr-gap-y-4 rr-px-4" style={{ position: 'relative', zIndex: 1 }} data-testid="thank-you-page">
          <h1 
            className="rr-font-bold rr-text-[#4E4E4E] rr-text-center rr-max-w-[90%] sm:rr-max-w-[75%] md:rr-max-w-[50%] rr-mx-auto"
            style={{ fontSize: "clamp(1rem, 2.5vw, 1.6rem)" }}
          >
        {message && (
          <p>{message}
          </p>
        )}
      </h1>
          <p className="rr-text-center rr-font-bold rr-text-[#4E4E4E] rr-max-w-[600px]" style={{ fontSize: "clamp(0.7rem, 1.8vw, 1rem)" }}>
            {t("repeat-instruction")}
          </p>
      <div className="rr-flex rr-flex-col sm:rr-flex-row rr-flex-wrap rr-justify-center rr-gap-2 sm:rr-gap-4">
        <a href="#" onClick={(e) => { e.preventDefault(); handleTryAgain(); }} className={linkClass} style={{ fontSize: "clamp(0.6rem, 1.3vw, 0.8rem)" }}>
        {t("try-again-label")}
        </a>
        <a
          href={getHelpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          style={{ fontSize: "clamp(0.6rem, 1.3vw, 0.8rem)" }}
        >
          {t("get-help-label")}
        </a>
      </div>
      <a
          href={donateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          style={{ fontSize: "clamp(0.6rem, 1.3vw, 0.8rem)" }}
        >
          {t("Donate")}
        </a>
      
    </div>
  );
};

export default ThankYouPage;
