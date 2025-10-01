import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MainAnimationContext } from "../context/MainAnimationContext";
import QuickStartPreset from "./QuickStartPreset";
import { detectWidgetMode } from "../utils/widgetEnvironment";

const WelcomePage = () => {
  const { t } = useTranslation();
  const animation = useContext(MainAnimationContext);

  useEffect(() => {
    animation.changeAnimation("main");
  }, []);


  // Check if we're in widget mode
  const isWidget = detectWidgetMode();

  return (
    <div className={`rr-flex rr-flex-col rr-justify-center rr-items-center ${isWidget ? 'rr-max-w-none rr-max-h-[50vh]' : 'rr-max-w-[70rem]'} rr-gap-4 rr-px-4`} data-testid="welcome-page" style={{ position: 'relative', zIndex: 1 }}>
      {/* Responsive Text Layout - Columns on larger screens, rows on smaller */}
      <div className="rr-flex rr-flex-col sm:rr-flex-row rr-justify-center rr-items-center sm:rr-items-start rr-gap-4 sm:rr-gap-6 rr-w-full rr-max-w-4xl">
        {/* Left Column - Title */}
        <div className="rr-flex rr-flex-1 rr-max-w-[20rem] rr-items-center sm:rr-items-start rr-text-center sm:rr-text-left">
          <h2 
            className="rr-font-bold rr-text-[#4E4E4E] rr-text-[--font-global]" 
            style={{ fontSize: "clamp(0.8rem, 2vw, 1.4rem)" }}
            data-testid="welcome-title"
          >
            {t("title-text")}
          </h2>
        </div>

        {/* Right Column - Message */}
        <div className="rr-flex rr-flex-1 rr-max-w-[40rem] rr-items-center sm:rr-items-start rr-text-center sm:rr-text-left">
          <p 
            className="rr-text-[#4E4E4E] rr-text-[--font-global]" 
            style={{ fontSize: "clamp(0.5rem, 1.5vw, 0.8rem)" }}
            data-testid="welcome-message"
          >
            {t("main-message")}
          </p>
        </div>
      </div>

      {/* Centered Timer Buttons */}
      <QuickStartPreset
        onClick={() => {
          // Change animation to wait state when starting exercise
          animation.changeAnimation("wait");
        }}
      />
    </div>
  );
};

export default WelcomePage;
