import trevorLogo from "../assets/trevor.svg";
import { useTranslation } from "react-i18next";
import ToggleButton from "./ToggleButton";

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
        <img src={trevorLogo} className="h-20 sm:h-20" alt="Trevor Logo" />
      </div>
      <div className="flex items-center space-x-4">
        {/* Language toggle button*/}
        <ToggleButton />
        <button className="flex px-6 sm:px-6 py-2 sm:py-2 text-[var(--color-button-text)] bg-[var(--color-button)] rounded-md shadow-md hover:opacity-80 text-sm sm:text-base max-w-[5.5rem] items-center justify-center"
        onClick={() => window.open("https://www.thetrevorproject.mx/dona/", "_blank")}>
          <p className="text-[--font-global] text-[15px]">{t("Donate")}</p>
        </button>
      </div>
    </div>
  );
};

export default NavBar;
