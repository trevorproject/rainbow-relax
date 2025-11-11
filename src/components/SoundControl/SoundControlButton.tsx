import { useState, useContext } from "react";
import { Settings, VolumeX } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { AudioContext } from "../../context/AudioContext";
import SoundControlPanel from "./SoundControlPanel";

export default function SoundControlButton() {
  const { t } = useTranslation();
  const audioContext = useContext(AudioContext);
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  const {
    backgroundEnabled,
    instructionsEnabled,
    guidedVoiceEnabled,
  } = audioContext;

  const anyMuted =
    !backgroundEnabled || !instructionsEnabled || !guidedVoiceEnabled;

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
        className="fixed right-4 top-20 md:top-24 z-40 p-3 rounded-full bg-[var(--color-button)] text-[var(--color-button-text)] shadow-lg hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--gradient-1-1)]"
        aria-label={t("sound-settings")}
        aria-expanded={isPanelVisible}
        aria-haspopup="true"
      >
        {anyMuted ? (
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

