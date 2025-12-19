import { useState, useContext, useRef, useMemo, useCallback } from "react";
import { Settings, VolumeX, Volume2 } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { AudioContext } from "../../context/AudioContext";
import SoundControlPanel from "./SoundControlPanel";

interface SoundControlButtonProps {
  className?: string;
}

type ColorClasses = { bg: string; border: string; ring: string };

type PageVariant = "welcome" | "breathing" | "default";

export default function SoundControlButton({ className = "" }: SoundControlButtonProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const audioContext = useContext(AudioContext);

  if (!audioContext) return null;

  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isWelcomePage = location.pathname === "/" || location.pathname === "/index.html";
  const isBreathingPage = location.pathname.startsWith("/breathing");

  const pageVariant: PageVariant = isWelcomePage ? "welcome" : isBreathingPage ? "breathing" : "default";

  const defaultPositionClass = useMemo(() => {
    if (pageVariant === "welcome") return "fixed right-2 top-32 md:top-36 z-[49]";
    if (pageVariant === "breathing") return "fixed right-2 top-2 md:right-4 md:top-4 z-[49]";
    return "fixed right-2 top-4 md:right-4 md:top-4 z-[49]";
  }, [pageVariant]);

  const { backgroundEnabled, instructionsEnabled, guidedVoiceEnabled } = audioContext;

  const mutedCount = useMemo(() => {
    return (backgroundEnabled ? 0 : 1) + (instructionsEnabled ? 0 : 1) + (guidedVoiceEnabled ? 0 : 1);
  }, [backgroundEnabled, instructionsEnabled, guidedVoiceEnabled]);

  const allEnabled = mutedCount === 0;
  const allMuted = mutedCount === 3;

  const colorClasses: ColorClasses = useMemo(() => {
    if (allEnabled) return { bg: "bg-green-500", border: "border-green-500", ring: "ring-green-500" };
    if (mutedCount === 1) return { bg: "bg-yellow-500", border: "border-yellow-500", ring: "ring-yellow-500" };
    if (mutedCount === 2) return { bg: "bg-orange-500", border: "border-orange-500", ring: "ring-orange-500" };
    return { bg: "bg-red-500", border: "border-red-500", ring: "ring-red-500" };
  }, [allEnabled, mutedCount]);

  const buttonBgClass = colorClasses.bg;
  const hoverEnabledRef = useRef(true);
  const openedByHoverRef = useRef(false);

  const handleMouseEnter = useCallback(() => {
    if (window.innerWidth >= 768 && hoverEnabledRef.current) {
      openedByHoverRef.current = true;
      setIsPanelVisible(true);
    }
  }, []);

  const handleClick = useCallback(() => {
    hoverEnabledRef.current = false;

    if (openedByHoverRef.current) {
      openedByHoverRef.current = false;
      setIsPanelVisible(false);
    } else {
      setIsPanelVisible((v) => !v);
    }

    window.setTimeout(() => {
      hoverEnabledRef.current = true;
    }, 250);
  }, []);

  const handlePanelClose = useCallback(() => {
    openedByHoverRef.current = false;
    setIsPanelVisible(false);
  }, []);

  const containerClassName = className?.trim() ? className : defaultPositionClass;
  const wrapperClass = `${containerClassName} relative`;

  const Icon = allEnabled ? Volume2 : allMuted ? VolumeX : Settings;

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
        <Icon size={20} className="text-white" />
      </motion.button>

      <SoundControlPanel
        isVisible={isPanelVisible}
        onClose={handlePanelClose}
        colorClass={colorClasses.border}
        buttonRef={buttonRef}
        pageVariant={pageVariant}
      />
    </div>
  );
}
