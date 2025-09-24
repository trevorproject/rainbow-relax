import { useTranslation } from "react-i18next";
import Logo from "./Logo";
import ToggleButton from "./ToggleButton";

const NavBar = () => {
  const { t } = useTranslation();

  const donateUrl = t("donate-url");
  const homepageUrl = t("homepage-url");

  // Check if we're in widget mode
  const isWidget = typeof window !== 'undefined' && 
    (window as typeof window & { myWidgetConfig?: unknown }).myWidgetConfig;

  return (
        <div className={`${isWidget ? 'rr-relative' : 'rr-fixed'} rr-flex rr-items-center rr-justify-between rr-w-full rr-px-4 md:rr-px-8 rr-py-4`} data-testid="navbar" style={{ zIndex: 2 }}>
      <div
        className="rr-flex rr-items-center rr-cursor-pointer"
        onClick={() => (window.location.href = homepageUrl)}
        data-testid="logo-container"
      >
        <Logo />
      </div>
      <div 
        className="rr-flex rr-items-center rr-space-x-4"
        data-testid="navbar-actions"
      >
        <ToggleButton />
            <a
              href={donateUrl} 
              target="_blank" 
              rel="noopener"
              className="rr-flex rr-px-4 sm:rr-px-4 rr-py-1 sm:rr-py-1 rr-text-[var(--color-button-text)] rr-bg-[var(--color-button)] rr-rounded-md rr-shadow-md rr-hover:opacity-80 rr-max-w-[4.5rem] rr-items-center rr-justify-center"
              data-testid="donate-button"
            >
              <p className="rr-text-[--font-global] rr-font-bold" style={{ fontSize: "clamp(0.5rem, 1vw, 0.7rem)" }}>{t("Donate")}</p>
            </a>
      </div>
    </div>
  );
};

export default NavBar;
