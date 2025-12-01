import Logo from "./Logo";
import { useTranslation } from "react-i18next";
import ToggleButton from "./ToggleButton";
import { useWidgetConfig } from "../context/WidgetConfigContext";
import { useLocation } from "react-router-dom";
import { track, screenMap, EVENTS } from "../analytics/track";

const NavBar = () => {
  const { i18n, t } = useTranslation();
  const locale = i18n.language?.startsWith("es") ? "es" : "en";
  const { config } = useWidgetConfig();
  const location = useLocation();

  const screen =
    (screenMap[location.pathname] ??
      location.pathname.replace(/^\//, "")) || "welcome";

  const donateUrl = config.donationUrl;
  const homepageUrl = config.homeUrl;
  const helpUrl = config.helpUrl;

  const handleLogoClick = () => {
    track(EVENTS.LOGO_CLICK, { locale, screen });
    if (homepageUrl) window.location.href = homepageUrl;
  };

  const handleDonateClick = () => {
    track(EVENTS.DONATE_CLICK, { locale, screen, source: "navbar" });
  };

  const handleHelpClick = () => {
    track(EVENTS.GET_HELP_CLICK, { locale, screen, source: "navbar" });
  };

  return (
    <div className="fixed flex items-center justify-between w-full px-4 md:px-8 py-4">
      <button
        type="button"
        className="flex items-center cursor-pointer"
        onClick={handleLogoClick}
        aria-label="Home"
      >
        <Logo className="Logo" />
      </button>

      <div className="flex items-center space-x-4">
        <ToggleButton />

        {donateUrl && (
          <a
            href={donateUrl}
            target="_blank"
            rel="noopener"
            onClick={handleDonateClick}
            className="flex px-6 sm:px-6 py-2 sm:py-2 text-[var(--color-button-text)] bg-[var(--color-button)] rounded-md shadow-md hover:opacity-80 text-sm sm:text-base max-w-[5.5rem] items-center justify-center"
          >
            <p className="text-[--font-global] text-[15px] font-bold">
              {t("Donate")}
            </p>
          </a>
        )}

        {helpUrl && (
          <a
            href={helpUrl}
            target="_blank"
            rel="noopener"
            onClick={handleHelpClick}
            className="flex px-6 sm:px-6 py-2 sm:py-2 text-[var(--color-button-text)] bg-[var(--color-button)] rounded-md shadow-md hover:opacity-80 text-sm sm:text-base max-w-[5.5rem] items-center justify-center"
          >
            <p className="text-[--font-global] text-[15px] font-bold">
              {t("Help")}
            </p>
          </a>
        )}
      </div>
    </div>
  );
};

export default NavBar;