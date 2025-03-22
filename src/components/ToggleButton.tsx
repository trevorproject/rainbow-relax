import { useState } from "react";
import { useTranslation } from "react-i18next";
import mexicoFlag from "../assets/mexico-flag.png";
import usaFlag from "../assets/usa-flag.png";

const ToggleButton = () => {
  const { i18n } = useTranslation();
  const [isOn, setIsOn] = useState(i18n.language === "es" ? false : true);

  const handleChangeLanguage = () => {
    setIsOn(!isOn);
    i18n.changeLanguage(i18n.language === "en" ? "es" : "en");
  };

  return (
    <button
      onClick={handleChangeLanguage}
      className="w-10 h-6 sm:w-14 sm:h-8 rounded-full relative bg-[var(--color-button)]"
    >
      <div
        className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full absolute top-1 transition-transform bg-cover bg-center flex justify-center items-center ${
          isOn
            ? "translate-x-1 sm:translate-x-1"
            : "translate-x-5 sm:translate-x-7"
        }`}
      >
        <p className="text-[--font-global] text-white text-[12px]">
          {isOn ? "En" : "Es"}
        </p>
      </div>
      <div
        className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full absolute top-1 transition-transform bg-cover bg-center ${
          isOn
            ? "translate-x-5 sm:translate-x-7"
            : "translate-x-1 sm:translate-x-1"
        }`}
        style={{
          backgroundImage: !isOn ? `url(${mexicoFlag})` : `url(${usaFlag})`,
        }}
      ></div>
    </button>
  );
};

export default ToggleButton;
