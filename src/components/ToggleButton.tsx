import { useState } from "react";
import { useTranslation } from "react-i18next";
import mexicoFlag from "../assets/mexico-flag.png";
import usaFlag from "../assets/usa-flag.png";
import { useTailwindAdapter } from "../utils/tailwindAdapter";

const ToggleButton = () => {
  const { i18n } = useTranslation();
  const [isOn, setIsOn] = useState(i18n.language === "es" ? true : false);
  const cn = useTailwindAdapter();

  const handleChangeLanguage = () => {
    setIsOn(!isOn);
    i18n.changeLanguage(i18n.language === "es" ? "en" : "es");
  };

  return (
    <button
      onClick={handleChangeLanguage}
      className={cn("rr-relative rr-flex rr-items-center rr-justify-between rr-p-0\.5 rr-cursor-pointer rr-transition-all rr-duration-300 rr-ease-in-out rr-border-none")}
      style={{
        width: "clamp(48px, 8vw, 64px)",
        height: "clamp(24px, 4vw, 32px)",
        borderRadius: "clamp(12px, 2vw, 16px)",
        backgroundColor: "var(--color-button)",
      }}
      aria-label="Toggle language"
      data-testid="language-toggle"
    >
      {/* Left side - En */}
      <div
        className={cn("rr-rounded-full rr-transition-all rr-duration-300 rr-ease-in-out rr-bg-cover rr-bg-center")}
        style={{
          width: "clamp(18px, 3vw, 24px)",
          height: "clamp(18px, 3vw, 24px)",
          backgroundImage: !isOn ? `url(${usaFlag})` : "none",
          border: !isOn ? "2px solid white" : "none",
          boxShadow: !isOn ? "0 2px 4px rgba(0,0,0,0.2)" : "none",
          opacity: !isOn ? 1 : 0.3
        }}
        data-testid="english-flag"
      />
      
      {/* Right side - Es */}
      <div
        className={cn("rr-rounded-full rr-transition-all rr-duration-300 rr-ease-in-out rr-bg-cover rr-bg-center")}
        style={{
          width: "clamp(18px, 3vw, 24px)",
          height: "clamp(18px, 3vw, 24px)",
          backgroundImage: isOn ? `url(${mexicoFlag})` : "none",
          border: isOn ? "2px solid white" : "none",
          boxShadow: isOn ? "0 2px 4px rgba(0,0,0,0.2)" : "none",
          opacity: isOn ? 1 : 0.3
        }}
        data-testid="spanish-flag"
      />
      
      {/* Text labels outside the circles */}
      <span 
        className={cn("rr-absolute rr-font-bold rr-transition-all rr-duration-300 rr-ease-in-out")}
        style={{ 
          bottom: "clamp(-16px, -2.5vw, -18px)", 
          left: !isOn ? "2px" : "auto",
          right: isOn ? "2px" : "auto",
          fontSize: "clamp(6px, 1.5vw, 10px)", 
          color: "var(--color-button)", 
        }}
      >
        {!isOn ? "En" : "Es"}
      </span>
    </button>
  );
};

export default ToggleButton;
