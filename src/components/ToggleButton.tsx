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
      className="w-16 h-8 sm:w-16 sm:h-8 rounded-full relative bg-[var(--color-button)]"
      data-testid="language-toggle"
    >
      <div
        className={`w-6 h-6 sm:w-6 sm:h-6 rounded-full absolute top-1 transition-transform bg-cover bg-center flex justify-end items-center ${
          isOn
            ? "translate-x-0 sm:translate-x-0"
            : "translate-x-7 sm:translate-x-7"
        }`}
      >
        <p className="text-[--font-global] text-[--color-button-text] text-[12px]">
          {isOn ? "Es" : "En"}
        </p>
      </div>
      <div
        className={`w-6 h-6 sm:w-6 sm:h-6 rounded-full absolute top-1 transition-transform bg-cover bg-center ${
          isOn
            ? "translate-x-9 sm:translate-x-9"
            : "translate-x-1 sm:translate-x-1"
        }`}
        style={{
          backgroundImage: isOn ? `url(${mexicoFlag})` : `url(${usaFlag})`,
        }}
      ></div>
    </button>
  );
};

export default ToggleButton;
