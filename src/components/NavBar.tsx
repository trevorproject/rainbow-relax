import Logo from "./Logo";
import { useTranslation } from "react-i18next";
import ToggleButton from "./ToggleButton";
import { useWidgetConfig } from "../context/WidgetConfigContext";


const NavBar = () => {
const { t } = useTranslation();
const { config } = useWidgetConfig();

// Helper function to determine if a button should be shown
const shouldShowButton = (url: string | null) => {
  if (url === 'no') return false;
  if (url) return true;
  return true; // Show with default URL
};

// Get URLs with fallback to defaults
const donateUrl = config.donationUrl || t("donate-url");
const homepageUrl = config.homeUrl || t("homepage-url");
const helpUrl = config.helpUrl || t("help-url"); 

  return (
    <div className="fixed flex items-center justify-between w-full px-4 md:px-8 py-4">
      <div
        className="flex items-center cursor-pointer"
        onClick={() =>
                    (window.location.href = homepageUrl)
        }
      >
        <Logo className="Logo" />
      </div>

       

      <div className="flex items-center space-x-4">
        {/* Language toggle button*/}
        <ToggleButton />

        {/* Donate button - show if not explicitly hidden */}
        {shouldShowButton(config.donationUrl) && (
          <a
            href={donateUrl} target="_blank" rel="noopener"
            className="flex px-6 sm:px-6 py-2 sm:py-2 text-[var(--color-button-text)] bg-[var(--color-button)] rounded-md shadow-md hover:opacity-80 text-sm sm:text-base max-w-[5.5rem] items-center justify-center"
          >
            <p className="text-[--font-global] text-[15px] font-bold">{t("Donate")}</p>
          </a>
        )}

        {/* Help button - show if not explicitly hidden */}
        {shouldShowButton(config.helpUrl) && (
          <a
            href={helpUrl} target="_blank" rel="noopener"
            className="flex px-6 sm:px-6 py-2 sm:py-2 text-[var(--color-button-text)] bg-[var(--color-button)] rounded-md shadow-md hover:opacity-80 text-sm sm:text-base max-w-[5.5rem] items-center justify-center"
          >
            <p className="text-[--font-global] text-[15px] font-bold">{t("Help")}</p>
          </a>
        )}
        
      </div>
    </div>
  );
};

export default NavBar;
