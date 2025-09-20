import { useTranslation } from "react-i18next";
import { cn } from "../utils/tailwindAdapter";
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
      className={cn("rr-navbar")}
      style={{
        position: isWidget ? "absolute" : "fixed",
        top: 0,
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: isWidget ? "12px 16px" : "16px 32px", // Smaller padding for widget
        zIndex: 100,
        height: isWidget ? "60px" : "auto" // Fixed height for widget
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer"
        }}
        onClick={() => (window.location.href = homepageUrl)}
      >
        <Logo />
      </div>
      <div 
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px"
        }}
      >
        <ToggleButton />
        <a
          href={donateUrl} 
          target="_blank" 
          rel="noopener"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px 24px",
            backgroundColor: "var(--color-button)",
            color: "var(--color-button-text)",
            borderRadius: "6px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            textDecoration: "none",
            fontSize: "15px",
            fontWeight: "bold",
            fontFamily: "var(--font-global)",
            transition: "opacity 0.3s ease"
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
          onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
        >
          {t("Donate")}
        </a>
      </div>
    </div>
  );
};

export default NavBar;
