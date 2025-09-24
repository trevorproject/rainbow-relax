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
    <div className={`rr-flex rr-flex-wrap rr-justify-center rr-items-start ${isWidget ? 'rr-max-w-none rr-max-h-[50vh]' : 'rr-max-w-[70rem]'} rr-gap-4 rr-px-4 md:rr-gap-[1.5rem] md:rr-px-6`} data-testid="welcome-page" style={{ position: 'relative', zIndex: 1 }}>
      <div className="rr-flex rr-max-w-[20rem] rr-items-start">
            <h2 
              className="rr-font-bold rr-text-[#4E4E4E] rr-text-[--font-global] rr-text-center md:rr-text-left" 
              style={{ fontSize: "clamp(0.8rem, 2vw, 1.4rem)" }}
              data-testid="welcome-title"
            >
              {t("title-text")}
            </h2>
      </div>

      <div className="rr-flex rr-flex-col rr-max-w-[40rem] rr-items-start">
            <p 
              className="rr-text-[#4E4E4E] rr-text-center rr-text-[--font-global]" 
              style={{ fontSize: "clamp(0.5rem, 1.5vw, 0.8rem)" }}
              data-testid="welcome-message"
            >
              {t("main-message")}
            </p>
        <QuickStartPreset
          onClick={() => {
            // Change animation to wait state when starting exercise
            animation.changeAnimation("wait");
          }}
        />
      </div>
    </div>
  );
};

export default WelcomePage;
