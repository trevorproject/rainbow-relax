import { motion, AnimatePresence } from "framer-motion";
import { useContext, useEffect, useRef, RefObject, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { AudioContext } from "../../context/AudioContext";

interface SoundControlPanelProps {
  isVisible: boolean;
  onClose: () => void;
  colorClass?: string;
  buttonRef?: RefObject<HTMLButtonElement>;
  mobilePosition?: "top" | "auto"; // nueva prop
}

export default function SoundControlPanel({
  isVisible,
  onClose,
  colorClass = "border-blue-500",
  buttonRef,
  mobilePosition = "auto",
}: SoundControlPanelProps) {
  const { t } = useTranslation();
  const audioContext = useContext(AudioContext);
  const panelRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  const [position, setPosition] = useState({
    top: "auto" as number | "auto",
    bottom: "auto" as number | "auto",
    left: "auto" as number | "auto",
    right: "auto" as number | "auto",
  });

  const {
    backgroundEnabled,
    setBackgroundEnabled,
    instructionsEnabled,
    setInstructionsEnabled,
    guidedVoiceEnabled,
    setGuidedVoiceEnabled,
  } = audioContext;

  useEffect(() => {
    if (!isVisible) return;

    const handleMouseLeave = () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      hideTimeoutRef.current = window.setTimeout(() => {
        onClose();
      }, 500);
    };

    const handleMouseEnter = () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };

    const panel = panelRef.current;
    if (panel) {
      panel.addEventListener("mouseleave", handleMouseLeave);
      panel.addEventListener("mouseenter", handleMouseEnter);
    }

    return () => {
      if (panel) {
        panel.removeEventListener("mouseleave", handleMouseLeave);
        panel.removeEventListener("mouseenter", handleMouseEnter);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [isVisible, onClose]);

  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isClickOnButton = buttonRef?.current?.contains(target);
      const isClickOnPanel = panelRef.current?.contains(target);

      if (!isClickOnButton && !isClickOnPanel) {
        onClose();
      }
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isVisible, onClose, buttonRef]);

  const updatePosition = useCallback(() => {
    if (!buttonRef?.current || !panelRef.current) return;

    const btn = buttonRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    const panelWidth = panelRef.current.offsetWidth;
    const panelHeight = panelRef.current.offsetHeight;
    const buffer = 8;
    const isMobile = window.innerWidth < 768;

    let top: number | "auto" = "auto";
    let bottom: number | "auto" = "auto";

    if (isMobile && mobilePosition === "top") {
      bottom = viewport.height - btn.top + buffer;
    } else {
      const spaceBelow = viewport.height - btn.bottom;
      const spaceAbove = btn.top;

      if (spaceBelow >= panelHeight + buffer) {
        top = btn.bottom + buffer;
      } else if (spaceAbove >= panelHeight + buffer) {
        bottom = viewport.height - btn.top + buffer;
      } else {
        if (spaceBelow > spaceAbove) {
          top = btn.bottom + buffer;
        } else {
          bottom = viewport.height - btn.top + buffer;
        }
      }
    }

    let left: number | "auto" = "auto";
    let right: number | "auto" = "auto";

    const spaceRight = viewport.width - btn.right;
    const spaceLeft = btn.left;

    if (spaceRight >= panelWidth + buffer) {
      left = btn.left;
    } else if (spaceLeft >= panelWidth + buffer) {
      right = viewport.width - btn.right;
    } else {
      left = buffer;
    }

    setPosition({ top, bottom, left, right });
  }, [buttonRef, mobilePosition]);

  useEffect(() => {
    if (!isVisible) return;

    const rafId = requestAnimationFrame(() => {
      updatePosition();
    });

    const handleResize = () => {
      updatePosition();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isVisible, updatePosition]);

  const allMuted = !backgroundEnabled && !instructionsEnabled && !guidedVoiceEnabled;

  const handleMuteAll = () => {
    if (allMuted) {
      setBackgroundEnabled(true);
      setInstructionsEnabled(true);
      setGuidedVoiceEnabled(true);
    } else {
      setBackgroundEnabled(false);
      setInstructionsEnabled(false);
      setGuidedVoiceEnabled(false);
    }
  };

  if (!isVisible) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        ref={panelRef}
        data-testid="sound-control-panel"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`fixed z-[9999] bg-[var(--color-button)] rounded-lg shadow-lg p-4 min-w-[200px] md:min-w-[240px] max-w-[calc(100vw-1rem)] border-2 ${colorClass}`}
        style={{
          top: position.top !== "auto" ? position.top : undefined,
          bottom: position.bottom !== "auto" ? position.bottom : undefined,
          left: position.left !== "auto" ? position.left : undefined,
          right: position.right !== "auto" ? position.right : undefined,
        }}
        role="dialog"
        aria-label={t("sound.settings")}
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => {
          if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = null;
          }
        }}
      >
        <h3 data-testid="sound-panel-title" className="text-lg font-semibold mb-4 text-[var(--color-button-text)]">
          {t("sound.settings")}
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor="background-toggle"
              className="text-sm text-[var(--color-button-text)] cursor-pointer"
            >
              {t("sound.background-sounds")}
            </label>
            <ToggleSwitch
              id="background-toggle"
              data-testid="background-sounds-toggle"
              checked={backgroundEnabled}
              onChange={setBackgroundEnabled}
              aria-label={t("sound.background-sounds")}
            />
          </div>

          <div className="flex items-center justify-between">
            <label
              htmlFor="instructions-toggle"
              className="text-sm text-[var(--color-button-text)] cursor-pointer"
            >
              {t("sound.instructions")}
            </label>
            <ToggleSwitch
              id="instructions-toggle"
              data-testid="instructions-toggle"
              checked={instructionsEnabled}
              onChange={setInstructionsEnabled}
              aria-label={t("sound-instructions")}
            />
          </div>

          <div className="flex items-center justify-between">
            <label
              htmlFor="guide-toggle"
              className="text-sm text-[var(--color-button-text)] cursor-pointer"
            >
              {t("sound.exercise-guide")}
            </label>
            <ToggleSwitch
              id="guide-toggle"
              data-testid="exercise-guide-toggle"
              checked={guidedVoiceEnabled}
              onChange={setGuidedVoiceEnabled}
              aria-label={t("exercise-guide")}
            />
          </div>
        </div>

        <button
          data-testid="mute-all-button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleMuteAll();
          }}
          className="mt-4 w-full px-3 py-2 text-sm font-semibold rounded-md bg-[var(--gradient-1-1)] text-white hover:opacity-80 transition-opacity"
          aria-label={allMuted ? t("sound.unmute-all") : t("sound.mute-all")}
        >
          {allMuted ? t("sound.unmute-all") : t("sound.mute-all")}
        </button>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

interface ToggleSwitchProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  "aria-label": string;
  "data-testid"?: string;
}

function ToggleSwitch({ id, checked, onChange, "aria-label": ariaLabel, "data-testid": dataTestId }: ToggleSwitchProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(!checked);
  };

  return (
    <button
      id={id}
      data-testid={dataTestId}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={handleClick}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--gradient-1-1)] ${
        checked
          ? "bg-[var(--gradient-1-1)]"
          : "bg-gray-300 dark:bg-gray-600"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}