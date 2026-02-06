import { useEffect, useRef, useState } from "react";

interface ConsentBannerProps {
  children: React.ReactNode;
  onAccept: (acceptedByScrolling: boolean) => void;
  onDecline: () => void;
  acceptButtonText: string;
  declineButtonText: string;
  style?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
}

export default function ConsentBanner({
  children,
  onAccept,
  onDecline,
  acceptButtonText,
  declineButtonText,
  style,
  buttonStyle,
}: ConsentBannerProps) {
  const [hasScrolled, setHasScrolled] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasAcceptedRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if user scrolled down significantly (more than 100px)
      if (window.scrollY > 100 && !hasAcceptedRef.current) {
        setHasScrolled(true);
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        scrollTimeoutRef.current = setTimeout(() => {
          if (!hasAcceptedRef.current) {
            hasAcceptedRef.current = true;
            onAccept(true);
          }
        }, 1000); // Accept after 1 second of scrolling
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [onAccept]);

  const handleAccept = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    if (!hasAcceptedRef.current) {
      hasAcceptedRef.current = true;
      onAccept(hasScrolled);
    }
  };

  const handleDecline = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    onDecline();
  };

  const defaultStyle: React.CSSProperties = {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#ff5a3e",
    padding: "20px",
    zIndex: 9999,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontSize: "14px",
    lineHeight: "1.5",
    animation: "slideUp 0.3s ease-out",
    ...style,
  };

  const defaultButtonStyle: React.CSSProperties = {
    color: "#595c3fff",
    fontSize: "13px",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "opacity 0.2s ease, transform 0.1s ease",
    whiteSpace: "nowrap",
    ...buttonStyle,
  };

  const textStyle: React.CSSProperties = {
    color: "#fff",
    flex: "1 1 auto",
    marginRight: "20px",
    fontSize: "14px",
    lineHeight: "1.5",
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: "10px",
    flexDirection: "row-reverse",
    flexShrink: 0,
  };

  return (
    <>
      <div className="cookie-consent-banner" style={defaultStyle}>
        <div style={textStyle}>
          {children}
        </div>
        <div style={buttonContainerStyle}>
          <button
            onClick={handleAccept}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
              e.currentTarget.style.transform = "scale(0.98)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "scale(1)";
            }}
            style={{
              ...defaultButtonStyle,
              background: "#fff",
            }}
          >
            {acceptButtonText}
          </button>
          <button
            onClick={handleDecline}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = "0.9";
              e.currentTarget.style.transform = "scale(0.98)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "scale(1)";
            }}
            style={{
              ...defaultButtonStyle,
              background: "transparent",
              color: "#fff",
              border: "1px solid #fff",
            }}
          >
            {declineButtonText}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @media (max-width: 768px) {
          .cookie-consent-banner {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 15px !important;
            padding: 15px !important;
          }
          .cookie-consent-banner > div:first-child {
            margin-right: 0 !important;
            margin-bottom: 0 !important;
          }
          .cookie-consent-banner > div:last-child {
            width: 100%;
            justify-content: flex-end;
          }
        }
      `}</style>
    </>
  );
}
