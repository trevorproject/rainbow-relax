import Logo from "./Logo";
import { useTranslation } from "react-i18next";
import ToggleButton from "./ToggleButton";
import { useWidgetConfig } from "../context/WidgetConfigContext";


const NavBar = () => {
const { t } = useTranslation();
const { config } = useWidgetConfig();

const donateUrl = config.donationUrl;
const homepageUrl = config.homeUrl;
const helpUrl = config.helpUrl; 

  return (
    <div className="fixed flex items-center justify-between w-full px-4 md:px-8 py-4">
      <div
        className="flex items-center cursor-pointer"
        onClick={() =>
                    homepageUrl && (window.location.href = homepageUrl)
        }
      >
        <Logo className="Logo" />
      </div>

       

      <div className="flex items-center space-x-4">
        <ToggleButton />

        {donateUrl && (
          <a
            href={donateUrl} target="_blank" rel="noopener"
            className="flex px-6 sm:px-6 py-2 sm:py-2 text-[var(--color-button-text)] bg-[var(--color-button)] rounded-md shadow-md hover:opacity-80 text-sm sm:text-base max-w-[5.5rem] items-center justify-center"
          >
            <p className="text-[--font-global] text-[15px] font-bold">{t("Donate")}</p>
          </a>
        )}

        {helpUrl && (
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
