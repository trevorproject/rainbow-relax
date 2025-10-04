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
    <div 
      className={`${isWidget ? 'rr-relative' : 'rr-fixed'} rr-flex rr-items-center rr-justify-between rr-w-full`} 
      data-testid="navbar" 
      style={{ 
        zIndex: 2,
        padding: "clamp(0.02rem, 0.1vw, 0.15rem) clamp(0.05rem, 0.2vw, 0.3rem)",
        boxSizing: "border-box",
        maxWidth: "100%",
        overflow: "visible",
        minHeight: "clamp(2rem, 5vw, 4rem)", // Increased to accommodate larger logo
        height: "auto"
      }}
    >
      <div
        className="rr-flex rr-items-start rr-cursor-pointer"
        onClick={() => (window.location.href = homepageUrl)}
        data-testid="logo-container"
        style={{
          maxWidth: "100%", // Allow logo to use full width if needed
          overflow: "visible",
          flexShrink: 0, // Don't shrink the logo container
          minWidth: 0,
          height: "auto",
          display: "flex",
          alignItems: "flex-start"
        }}
      >
        <Logo />
      </div>
      <div 
        className="rr-flex rr-items-start"
        data-testid="navbar-actions"
        style={{
          gap: "clamp(0.05rem, 0.3vw, 0.4rem)",
          maxWidth: "50%",
          overflow: "visible",
          flexShrink: 1,
          minWidth: 0,
          height: "auto",
          alignSelf: "flex-start"
        }}
      >
        <ToggleButton />
        <a
          href={donateUrl} 
          target="_blank" 
          rel="noopener"
          className="rr-flex rr-text-[var(--color-button-text)] rr-bg-[var(--color-button)] rr-rounded-md rr-shadow-md rr-hover:opacity-80 rr-items-center rr-justify-center"
          data-testid="donate-button"
          style={{
            padding: "clamp(0.02rem, 0.1vw, 0.2rem) clamp(0.05rem, 0.2vw, 0.3rem)",
            fontSize: "clamp(0.12rem, 0.6vw, 0.4rem)",
            minWidth: "clamp(0.6rem, 2vw, 2rem)",
            maxWidth: "100%",
            boxSizing: "border-box",
            textDecoration: "none",
            flexShrink: 1
          }}
        >
              <p 
                className="rr-text-[--font-global] rr-font-bold rr-text-3xs sm:rr-text-2xs md:rr-text-xs" 
                style={{ 
                  fontSize: "clamp(0.12rem, 0.6vw, 0.4rem)",
                  margin: 0,
                  padding: 0,
                  lineHeight: 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
            {t("Donate")}
          </p>
        </a>
      </div>
    </div>
  );
};

export default NavBar;
