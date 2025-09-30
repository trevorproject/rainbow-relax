import Logo from "./Logo";
import { useTranslation } from "react-i18next";
import ToggleButton from "./ToggleButton";

const NavBar = () => {
const { t } = useTranslation();

const donateUrl = t("donate-url");
const homepageUrl = t("homepage-url");

  return (
    <div className="fixed flex items-center justify-between w-full px-4 md:px-8 py-4">
      <div
        className="flex items-center"
        onClick={() =>
                    (window.location.href = homepageUrl)
        }
      >
        <Logo className="Logo" />
      </div>
      <div className="flex items-center space-x-4">
        {/* Dropdown Resources*/}
      <label className="flex px-6 sm:px-6 py-2 sm:py-2 text-[var(--color-button-text)] bg-[var(--color-button)] rounded-md shadow-md hover:opacity-80 text-sm sm:text-base max-w-[8rem] items-right justify-right">{t("Resources")}         
            <input type="button"/>
            <select name="Selection" defaultValue="None">
             <option value="Explain">{t("Explanation")}
                <a href={donateUrl} target="_blank" rel="noopener"
                >
               </a>
              </option>
              
              <option value="Resources">{t("Resources") }</option>
              <option value="None"></option>
            </select>
      </label>

        {/* Language toggle button*/}
        <ToggleButton />

      <a
        href={donateUrl} target="_blank" rel="noopener"
        className="flex px-6 sm:px-6 py-2 sm:py-2 text-[var(--color-button-text)] bg-[var(--color-button)] rounded-md shadow-md hover:opacity-80 text-sm sm:text-base max-w-[5.5rem] items-center justify-center"
      >
        <p className="text-[--font-global] text-[15px] font-bold">{t("Donate")}</p>
      </a>

      </div>
    </div>
  );
};

export default NavBar;
