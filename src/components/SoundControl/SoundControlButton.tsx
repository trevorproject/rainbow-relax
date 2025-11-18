import { useState, useContext } from "react";
import { Settings, VolumeX, Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { AudioContext } from "../../context/AudioContext";
import SoundControlPanel from "./SoundControlPanel";

export default function SoundControlButton() {
  const { t } = useTranslation();
  const location = useLocation();
  const audioContext = useContext(AudioContext);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  
  // Determine positioning based on current route
  const isWelcomePage = location.pathname === "/" || location.pathname === "/index.html";
  const isInstructionsPage = location.pathname === "/breathing";
  
  // Position near start controls on WelcomePage, near pause/play on Instructions
  // Use z-50+ to be above NavBar and clickable
  const positionClass = isWelcomePage 
    ? "fixed right-4 top-32 md:top-36 z-[61]" // Above panel (z-[60]) to remain clickable
    : isInstructionsPage
    ? "fixed right-4 top-32 md:top-36 z-[61]" // Above panel (z-[60]) to remain clickable
    : "fixed right-4 top-20 md:top-24 z-[61]"; // Above panel (z-[60]) to remain clickable

  const {
    backgroundEnabled,
    instructionsEnabled,
    guidedVoiceEnabled,
  } = audioContext;

  const anyMuted =
    !backgroundEnabled || !instructionsEnabled || !guidedVoiceEnabled;
  const allEnabled = backgroundEnabled && instructionsEnabled && guidedVoiceEnabled;

  const handleMouseEnter = () => {
    // On desktop, show panel on hover
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

  return (
    <div className="relative">
      <motion.button
        data-testid="sound-control-button"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        className={`${positionClass} p-3 rounded-full bg-[var(--color-button)] text-[var(--color-button-text)] shadow-lg hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--gradient-1-1)]`}
        aria-label={t("sound.settings")}
        aria-expanded={isPanelVisible}
        aria-haspopup="true"
      >
        {allEnabled ? (
          <Volume2 size={20} className="text-[var(--color-button-text)]" />
        ) : anyMuted ? (
          <VolumeX size={20} className="text-[var(--color-button-text)]" />
        ) : (
          <Settings size={20} className="text-[var(--color-button-text)]" />
        )}
      </motion.button>

      <SoundControlPanel
        isVisible={isPanelVisible}
        onClose={handlePanelClose}
      />
    </div>
  );
}

