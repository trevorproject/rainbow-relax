import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

interface ConsentPromptProps {
  totalSizeFormatted: string;
  totalSizeBytes: number;
  onConsent: () => void;
}

export const ConsentPrompt = ({
  totalSizeFormatted,
  totalSizeBytes,
  onConsent,
}: ConsentPromptProps) => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const primaryButtonRef = useRef<HTMLButtonElement>(null);

  const TIKTOK_AVERAGE_SIZE_MB = 2.5;
  const tiktokCount = totalSizeBytes > 0 
    ? Math.round((totalSizeBytes / (1024 * 1024)) / TIKTOK_AVERAGE_SIZE_MB)
    : 1;

  useEffect(() => {
    setIsVisible(true);
    primaryButtonRef.current?.focus();
  }, []);

  const handleConsent = () => {
    onConsent();
  };

  const handleDecline = () => {
  };

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  };

  return (
    <div
      data-testid="consent-prompt-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-title"
      aria-describedby="consent-description"
    >
      <div
        data-testid="consent-prompt-dialog"
        className={`bg-[var(--background-global)] rounded-lg shadow-2xl max-w-md w-full mx-4 p-6 md:p-8 transform transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <h2
          id="consent-title"
          data-testid="consent-prompt-title"
          className="text-2xl md:text-3xl font-bold text-[var(--color-text)] mb-4 text-center"
        >
          {t("consent.title")}
        </h2>
        <p
          id="consent-description"
          data-testid="consent-prompt-description"
          className="text-[var(--color-text)] mb-6 text-center text-base md:text-lg"
        >
          {t("consent.description", { size: totalSizeFormatted, tiktoks: tiktokCount })}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            ref={primaryButtonRef}
            data-testid="consent-button-load-full"
            onClick={handleConsent}
            onKeyDown={(e) => handleKeyDown(e, handleConsent)}
            className="flex-1 bg-[var(--color-button)] text-[var(--color-button-text)] font-semibold py-3 px-6 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--color-text)] focus:ring-offset-2 focus:ring-offset-[var(--background-global)] transition-opacity"
            aria-label={t("consent.loadFull")}
          >
            {t("consent.loadFull")}
          </button>
          <button
            data-testid="consent-button-stay-lightweight"
            onClick={handleDecline}
            onKeyDown={(e) => handleKeyDown(e, handleDecline)}
            className="flex-1 bg-transparent border-2 border-[var(--color-text)] text-[var(--color-text)] font-semibold py-3 px-6 rounded-lg hover:bg-[var(--color-text)]/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-text)] focus:ring-offset-2 focus:ring-offset-[var(--background-global)] transition-colors"
            aria-label={t("consent.stayLightweight")}
          >
            {t("consent.stayLightweight")}
          </button>
        </div>
      </div>
    </div>
  );
};

