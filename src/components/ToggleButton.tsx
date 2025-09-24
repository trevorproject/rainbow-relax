import { useState } from "react";
import { useTranslation } from "react-i18next";
import mexicoFlag from "../assets/mexico-flag.png";
import usaFlag from "../assets/usa-flag.png";

const ToggleButton = () => {
  const { i18n } = useTranslation();
  const [isOn, setIsOn] = useState(i18n.language === "es" ? true : false);

  const handleChangeLanguage = () => {
    setIsOn(!isOn);
    i18n.changeLanguage(i18n.language === "es" ? "en" : "es");
  };

  return (
    <button
      onClick={handleChangeLanguage}
      style={{
        width: "clamp(48px, 8vw, 64px)",
        height: "clamp(24px, 4vw, 32px)",
        borderRadius: "clamp(12px, 2vw, 16px)",
        position: "relative",
        backgroundColor: "var(--color-button)",
        border: "none",
        cursor: "pointer",
        transition: "all 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "2px"
      }}
      aria-label="Toggle language"
      data-testid="language-toggle"
    >
      {/* Left side - En */}
      <div
        style={{
          width: "clamp(18px, 3vw, 24px)",
          height: "clamp(18px, 3vw, 24px)",
          borderRadius: "50%",
          transition: "all 0.3s ease",
          backgroundImage: !isOn ? `url(${usaFlag})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: !isOn ? "2px solid white" : "none",
          boxShadow: !isOn ? "0 2px 4px rgba(0,0,0,0.2)" : "none",
          opacity: !isOn ? 1 : 0.3
        }}
        data-testid="english-flag"
      />
      
      {/* Right side - Es */}
      <div
        style={{
          width: "clamp(18px, 3vw, 24px)",
          height: "clamp(18px, 3vw, 24px)",
          borderRadius: "50%",
          transition: "all 0.3s ease",
          backgroundImage: isOn ? `url(${mexicoFlag})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: isOn ? "2px solid white" : "none",
          boxShadow: isOn ? "0 2px 4px rgba(0,0,0,0.2)" : "none",
          opacity: isOn ? 1 : 0.3
        }}
        data-testid="spanish-flag"
      />
      
      {/* Text labels outside the circles */}
      <span style={{ 
        position: "absolute", 
        bottom: "clamp(-16px, -2.5vw, -18px)", 
        left: !isOn ? "2px" : "auto",
        right: isOn ? "2px" : "auto",
        fontSize: "clamp(6px, 1.5vw, 10px)", 
        color: "var(--color-button)", 
        fontWeight: "bold",
        transition: "all 0.3s ease"
      }}>
        {!isOn ? "En" : "Es"}
      </span>
    </button>
  );
};

export default ToggleButton;
