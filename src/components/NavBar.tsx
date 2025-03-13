import trevorLogo from "../assets/trevor.svg";
import { init } from "../i18n/init";
import { useTranslation } from "react-i18next";
import ToggleButton from "./ToggleButton";

init();

const NavBar = () => {
  const { t } = useTranslation();

  return (
    <div className="fixed flex items-center justify-between w-full px-4 md:px-8 py-4">
      <div
        className="flex items-center"
        onClick={() =>
          (window.location.href = "https://www.thetrevorproject.mx/")
        }
      >
        <img src={trevorLogo} className="h-20 sm:h-30" alt="Trevor Logo" />
      </div>
      <div className="flex items-center space-x-4">
        <ToggleButton />
        <button className="px-6 sm:px-8 py-2 sm:py-4 text-[var(--color-button-text)] bg-[var(--color-button)] rounded-md shadow-md hover:opacity-80 text-sm sm:text-base ">
          <p className="text-[--font-global] ">{t("Donate")}</p>
        </button>
      </div>
    </div>
  );
};

export default NavBar;
