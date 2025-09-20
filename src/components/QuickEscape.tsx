import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface QuickEscapeProps {
  showQuickEscape: boolean;
}

export default function QuickEscape({ showQuickEscape }: QuickEscapeProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(showQuickEscape);
  const [counter, setCounter] = useState<number>(0);
  const resetTimeoutRef = useRef<number | null>(null);
  const isMobile = "ontouchstart" in window;
  
  // Check if we're in widget mode
  const isWidget = typeof window !== 'undefined' && (window as any).myWidgetConfig;

  const incrementCounter = () => {
    setCounter((prevCounter) => prevCounter + 1);
    if (resetTimeoutRef.current !== null) {
      clearTimeout(resetTimeoutRef.current);
    }
    resetTimeoutRef.current = window.setTimeout(
      () => {
        setCounter(0);
      },
      isMobile ? 500 : 1000
    );
  };

  useEffect(() => {
    if (counter >= 3) {
      setTimeout(() => {
        window.location.href = "https://google.com";
      }, 0);
    }
  }, [counter]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isMobile && event.key === "Escape") {
        incrementCounter();
      }
    };

    const handleTouch = () => {
      if (isMobile) {
        incrementCounter();
      }
    };

    if (isMobile) {
      window.addEventListener("touchstart", handleTouch);
    } else {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (isMobile) {
        window.removeEventListener("touchstart", handleTouch);
      } else {
        window.removeEventListener("keydown", handleKeyDown);
      }
      if (resetTimeoutRef.current !== null)
        clearTimeout(resetTimeoutRef.current);
    };
  }, [isMobile]);

  if (!isOpen) return null;

  return (
    showQuickEscape && (
      <div 
        style={{
          position: isWidget ? "absolute" : "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000, // Higher than navbar
          backgroundColor: "rgba(0, 0, 0, 0.5)" // Semi-transparent backdrop
        }}
      >
        <div
          style={{
            width: "85vw",
            maxWidth: "450px",
            minHeight: "27vh",
            padding: "40px",
            borderRadius: "25px",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            backgroundColor: "var(--color-button)",
            color: "var(--color-button-text)",
            fontFamily: "var(--font-global)",
          }}
        >
          <button
            onClick={() => setIsOpen(false)}
            aria-label={t("close-quick-escape")}
            style={{
              position: "absolute",
              top: "16px",
              right: "24px",
              background: "none",
              border: "none",
              cursor: "pointer",
              opacity: 1,
              transition: "opacity 0.3s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            <X style={{ width: "1.3rem", height: "1.3rem" }} />
          </button>
          <h2 
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              marginBottom: "28px",
              color: "var(--color-button-text)",
              fontFamily: "var(--font-global)"
            }}
          >
            {t("quick-exit")}
          </h2>
          <p 
            style={{
              fontSize: "0.9rem",
              marginBottom: "28px",
              color: "var(--color-button-text)",
              fontFamily: "var(--font-global)"
            }}
          >
            {isMobile ? t("mobile-escape") : t("press-esc")}
          </p>
          <span
            onClick={() => setIsOpen(false)}
            style={{
              fontSize: "0.9rem",
              textDecoration: "underline",
              cursor: "pointer",
              color: "var(--color-button-text)",
              fontFamily: "var(--font-global)",
              opacity: 1,
              transition: "opacity 0.3s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            {t("got-it")}
          </span>
        </div>
      </div>
    )
  );
}
