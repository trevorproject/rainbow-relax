import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import mexicoFlag from "../assets/mexico-flag.png";
import usaFlag from "../assets/usa-flag.png";
import { track, EVENTS, screenMap } from "../analytics/track";

const ToggleButton = () => {
  const { i18n } = useTranslation();
  const location = useLocation();

  const [isOn, setIsOn] = useState(
    i18n.language?.startsWith("es") ? true : false
  );

  const screen =
    (screenMap[location.pathname] ??
      location.pathname.replace(/^\//, "")) || "welcome";

  const handleChangeLanguage = () => {
    const fromLang = i18n.language?.startsWith("es") ? "es" : "en";
    const toLang = fromLang === "es" ? "en" : "es";

    setIsOn((prev) => !prev);

    i18n.changeLanguage(toLang);

    track(EVENTS.LANGUAGE_CHANGED, {
      from_lang: fromLang,
      to_lang: toLang,
      screen,
    });
  };

  return (
    <button
      onClick={handleChangeLanguage}
      className="w-16 h-8 sm:w-16 sm:h-8 rounded-full relative bg-[var(--color-button)]"
      data-testid="language-toggle"
      type="button"
      aria-label={isOn ? "Es" : "En"}
    >
      <div
        className={`w-6 h-6 sm:w-6 sm:h-6 rounded-full absolute top-1 transition-transform bg-cover bg-center flex justify-end items-center ${
          isOn
            ? "translate-x-0 sm:translate-x-0"
            : "translate-x-7 sm:translate-x-7"
        }`}
        data-testid={isOn ? "language-toggle-es" : "language-toggle-en"}
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
      />
    </button>
  );
};

export default ToggleButton;
