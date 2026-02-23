import { useState, useContext, useRef } from "react";
import { Settings, VolumeX, Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { AudioContext } from "../../context/AudioContext";
import SoundControlPanel from "./SoundControlPanel";

interface SoundControlButtonProps {
  className?: string;
}

export default function SoundControlButton({ className = "" }: SoundControlButtonProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const audioContext = useContext(AudioContext);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isWelcomePage = location.pathname === "/" || location.pathname === "/index.html";
  const defaultPositionClass = isWelcomePage
    ? "fixed right-2 top-32 md:top-36 z-[49]"
    : "fixed right-2 top-4 md:top-4 z-[49]";

  const {
    backgroundEnabled,
    instructionsEnabled,
    guidedVoiceEnabled,
  } = audioContext;

  const allEnabled = backgroundEnabled && instructionsEnabled && guidedVoiceEnabled;

  const mutedCount = (!backgroundEnabled ? 1 : 0) +
                     (!instructionsEnabled ? 1 : 0) +
                     (!guidedVoiceEnabled ? 1 : 0);

  const getColorClasses = () => {
    if (mutedCount === 0) return { bg: "bg-blue-500", border: "border-blue-500", ring: "ring-blue-500" };
    if (mutedCount === 1) return { bg: "bg-green-500", border: "border-green-500", ring: "ring-green-500" };
    if (mutedCount === 2) return { bg: "bg-yellow-500", border: "border-yellow-500", ring: "ring-yellow-500" };
    return { bg: "bg-red-500", border: "border-red-500", ring: "ring-red-500" };
  };

  const colorClasses = getColorClasses();
  const buttonBgClass = allEnabled ? "bg-green-500" : colorClasses.bg;

  const handleMouseEnter = () => {
    if (window.innerWidth >= 768) {
      setIsPanelVisible(true);
    }
  };

  const handleClick = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  const handlePanelClose = () => {
    setIsPanelVisible(false);
  };

  const containerClassName = className || defaultPositionClass;
  const wrapperClass = className ? containerClassName : `${containerClassName}`;
  const mobilePosition = isWelcomePage ? "top" : "auto";

  return (
    <div data-testid="sound-control-container" className={wrapperClass}>
      <motion.button
        ref={buttonRef}
        data-testid="sound-control-button"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        className={`p-3 rounded-full ${buttonBgClass} text-white shadow-lg hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 ${colorClasses.ring} border-2 ${colorClasses.border}`}
        aria-label={t("sound.settings")}
        aria-expanded={isPanelVisible}
        aria-haspopup="true"
      >
        {allEnabled ? (
          <Volume2 size={20} className="text-white" />
        ) : mutedCount > 0 ? (
          <VolumeX size={20} className="text-white" />
        ) : (
          <Settings size={20} className="text-white" />
        )}
      </motion.button>

      <SoundControlPanel
        isVisible={isPanelVisible}
        onClose={handlePanelClose}
        colorClass={colorClasses.border}
        buttonRef={buttonRef}
        mobilePosition={mobilePosition}
      />
    </div>
  );
}