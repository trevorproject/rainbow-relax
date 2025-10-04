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
    <div 
      className={`rr-flex rr-flex-col rr-justify-center rr-items-center ${isWidget ? 'rr-max-w-none' : 'rr-max-w-[70rem]'} rr-gap-4 rr-px-4`} 
      data-testid="welcome-page" 
      style={{ 
        position: 'relative', 
        zIndex: 1,
        width: '100%',
        height: '100%',
        maxWidth: '100%',
        maxHeight: '100%',
        overflow: 'hidden'
      }}
    >
      {/* Responsive Text Layout - Always vertical for small widgets */}
      <div 
        className="rr-flex rr-flex-col rr-justify-center rr-items-center rr-gap-2 rr-w-full"
        style={{
          maxWidth: '100%',
          padding: 'clamp(0.25rem, 1vw, 1rem)',
          boxSizing: 'border-box'
        }}
      >
        {/* Title */}
        <div className="rr-flex rr-items-center rr-text-center rr-w-full">
          <h2 
            className="rr-font-bold rr-text-[#4E4E4E] rr-text-[--font-global]" 
            style={{ 
              fontSize: "clamp(0.4rem, 3vw, 1.2rem)",
              lineHeight: "clamp(0.5rem, 3.5vw, 1.4rem)",
              margin: 0,
              padding: 0,
              textAlign: 'center',
              wordWrap: 'break-word',
              overflowWrap: 'break-word'
            }}
            data-testid="welcome-title"
          >
            {t("title-text")}
          </h2>
        </div>

        {/* Message */}
        <div className="rr-flex rr-items-center rr-text-center rr-w-full">
          <p 
            className="rr-text-[#4E4E4E] rr-text-[--font-global]" 
            style={{ 
              fontSize: "clamp(0.3rem, 2vw, 0.7rem)",
              lineHeight: "clamp(0.4rem, 2.5vw, 0.8rem)",
              margin: 0,
              padding: 0,
              textAlign: 'center',
              wordWrap: 'break-word',
              overflowWrap: 'break-word'
            }}
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
