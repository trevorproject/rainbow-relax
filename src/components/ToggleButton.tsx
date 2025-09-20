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
        width: "64px",
        height: "32px",
        borderRadius: "16px",
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
    >
      {/* Left side - En */}
      <div
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          transition: "all 0.3s ease",
          backgroundImage: !isOn ? `url(${usaFlag})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: !isOn ? "2px solid white" : "none",
          boxShadow: !isOn ? "0 2px 4px rgba(0,0,0,0.2)" : "none",
          opacity: !isOn ? 1 : 0.3
        }}
      />
      
      {/* Right side - Es */}
      <div
        style={{
          width: "24px",
          height: "24px",
          borderRadius: "50%",
          transition: "all 0.3s ease",
          backgroundImage: isOn ? `url(${mexicoFlag})` : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          border: isOn ? "2px solid white" : "none",
          boxShadow: isOn ? "0 2px 4px rgba(0,0,0,0.2)" : "none",
          opacity: isOn ? 1 : 0.3
        }}
      />
      
      {/* Text labels outside the circles */}
      <span style={{ 
        position: "absolute", 
        bottom: "-18px", 
        left: !isOn ? "2px" : "auto",
        right: isOn ? "2px" : "auto",
        fontSize: "8px", 
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
