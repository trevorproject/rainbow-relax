import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface QuickEscapeProps {
  showQuickEscape: boolean;
}

export default function QuickEscape({ showQuickEscape }: QuickEscapeProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [counter, setCounter] = useState<number>(0);
  const resetTimeoutRef = useRef<number | null>(null);
  const isMobile = "ontouchstart" in window;

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
      <div className="fixed inset-0 flex items-center justify-center z-1">
        <div
          className="w-[85vw] sm:w-[90vw] max-w-[450px] min-h-[27vh] sm:min-h-[30vh] p-10 rounded-[25px] relative flex flex-col justify-center shadow-lg"
          style={{
            backgroundColor: "var(--color-button)",
            color: "var(--color-button-text)",
            fontFamily: "var(--font-global)",
          }}
        >
          <button
            onClick={() => setIsOpen(false)}
            aria-label={t("close-quick-escape")}
            className="absolute top-4 right-6 hover:opacity-70 cursor-pointer"
          >
            <X className="w-[1.3rem] h-[1.3rem] md:w-[1.5rem] md:h-[1.5rem]" />
          </button>
          <h2 className="text-[1.25rem] md:text-[1.6rem] font-bold mb-7">
            {t("quick-exit")}
          </h2>
          <p className="text-[0.9rem] md:text-[1rem] mb-7">
            {isMobile ? t("mobile-escape") : t("press-esc")}
          </p>
          <span
            onClick={() => setIsOpen(false)}
            className="text-[0.9rem] md:text-[1rem] underline cursor-pointer hover:opacity-70"
          >
            {t("got-it")}
          </span>
        </div>
      </div>
    )
  );
}