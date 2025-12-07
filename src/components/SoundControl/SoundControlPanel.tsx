import { motion, AnimatePresence } from "framer-motion";
import { useContext, useEffect, useRef, RefObject } from "react";
import { useTranslation } from "react-i18next";
import { AudioContext } from "../../context/AudioContext";

interface SoundControlPanelProps {
  isVisible: boolean;
  onClose: () => void;
  colorClass?: string;
  buttonRef?: RefObject<HTMLButtonElement>;
}

export default function SoundControlPanel({
  isVisible,
  onClose,
  colorClass = "border-blue-500",
  buttonRef,
}: SoundControlPanelProps) {
  const { t } = useTranslation();
  const audioContext = useContext(AudioContext);
  const panelRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<number | null>(null);

  const {
    backgroundEnabled,
    setBackgroundEnabled,
    instructionsEnabled,
    setInstructionsEnabled,
    guidedVoiceEnabled,
    setGuidedVoiceEnabled,
  } = audioContext;

  // Auto-hide on mouse leave (with delay)
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

  // Close on click outside (mobile)
  // Exclude both the button and the panel from outside click detection
  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isClickOnButton = buttonRef?.current?.contains(target);
      const isClickOnPanel = panelRef.current?.contains(target);
      
      // Only close if click is outside both button and panel
      if (!isClickOnButton && !isClickOnPanel) {
        onClose();
      }
    };

    // Use a small delay to avoid immediate close on mobile
    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isVisible, onClose, buttonRef]);

  const allMuted =
    !backgroundEnabled && !instructionsEnabled && !guidedVoiceEnabled;

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

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={panelRef}
          data-testid="sound-control-panel"
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`absolute z-[100] bg-[var(--color-button)] rounded-lg shadow-lg p-4 min-w-[200px] md:min-w-[240px] max-w-[calc(100vw-1rem)] border-2 ${colorClass} right-0 top-full mt-2`}
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
            {/* Background Sounds Toggle */}
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

            {/* Instructions Toggle */}
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

            {/* Exercise Guide Toggle */}
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

          {/* Mute All Button */}
          <button
            data-testid="mute-all-button"
            onClick={handleMuteAll}
            className="mt-4 w-full px-3 py-2 text-sm font-semibold rounded-md bg-[var(--gradient-1-1)] text-white hover:opacity-80 transition-opacity"
            aria-label={allMuted ? t("sound.unmute-all") : t("sound.mute-all")}
          >
            {allMuted ? t("sound.unmute-all") : t("sound.mute-all")}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
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
  return (
    <button
      id={id}
      data-testid={dataTestId}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
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

