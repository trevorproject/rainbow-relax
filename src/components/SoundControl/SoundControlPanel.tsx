import { motion, AnimatePresence } from "framer-motion";
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  RefObject,
  useState,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import { AudioContext } from "../../context/AudioContext";

type PageVariant = "welcome" | "breathing" | "default";
type ViewportKind = "mobile" | "tablet" | "desktop";
type PanelPos = { top: number; left: number };

type PlacementMode =
  | "right-center"
  | "left-center"
  | "below-center"
  | "above-center"
  | "right-top"
  | "right-bottom"
  | "left-top"
  | "left-bottom";

type PlacementConfig = {
  mode: PlacementMode;
  xOffset?: number;
  yOffset?: number;
  gap?: number;
  pad?: number;
  allowFlip?: boolean;
};

type PerViewportConfig = Record<ViewportKind, PlacementConfig>;

interface SoundControlPanelProps {
  isVisible: boolean;
  onClose: () => void;
  colorClass?: string;
  buttonRef?: RefObject<HTMLButtonElement>;
  pageVariant?: PageVariant;
}

type RectInfo = {
  rect: DOMRect;
  panelW: number;
  panelH: number;
  vw: number;
  vh: number;
  spaceRight: number;
  spaceLeft: number;
  spaceTop: number;
  spaceBottom: number;
};

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

function getViewportKind(vw: number): ViewportKind {
  if (vw < 768) return "mobile";
  if (vw < 1024) return "tablet";
  return "desktop";
}

function buildRectInfo(btn: HTMLElement, panel: HTMLElement): RectInfo {
  const rect = btn.getBoundingClientRect();
  const panelRect = panel.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  return {
    rect,
    panelW: panelRect.width,
    panelH: panelRect.height,
    vw,
    vh,
    spaceRight: vw - rect.right,
    spaceLeft: rect.left,
    spaceTop: rect.top,
    spaceBottom: vh - rect.bottom,
  };
}

const DEFAULT_CONFIG: PlacementConfig = {
  mode: "right-center",
  xOffset: 0,
  yOffset: 0,
  gap: 10,
  pad: 8,
  allowFlip: true,
};

const PLACEMENT_BY_PAGE: Record<PageVariant, PerViewportConfig> = {
  welcome: {
    mobile: { mode: "below-center", xOffset: 150, yOffset: 150, allowFlip: true },
    tablet: { mode: "right-center", xOffset: 0, yOffset: 0, allowFlip: true },
    desktop: { mode: "right-center", xOffset: 0, yOffset: 80, allowFlip: true },
  },
  breathing: {
    mobile: { mode: "below-center", yOffset: 8, allowFlip: true },
    tablet: { mode: "right-center", xOffset: 0, yOffset: 0, allowFlip: true },
    desktop: { mode: "right-center", xOffset: 0, yOffset: 12, allowFlip: true },
  },
  default: {
    mobile: { mode: "below-center", allowFlip: true },
    tablet: { mode: "right-center", allowFlip: true },
    desktop: { mode: "right-center", allowFlip: true },
  },
};

function resolveConfig(pageVariant: PageVariant, kind: ViewportKind): Required<PlacementConfig> {
  const raw = PLACEMENT_BY_PAGE[pageVariant]?.[kind] ?? DEFAULT_CONFIG;
  return {
    mode: raw.mode ?? DEFAULT_CONFIG.mode,
    xOffset: raw.xOffset ?? DEFAULT_CONFIG.xOffset!,
    yOffset: raw.yOffset ?? DEFAULT_CONFIG.yOffset!,
    gap: raw.gap ?? DEFAULT_CONFIG.gap!,
    pad: raw.pad ?? DEFAULT_CONFIG.pad!,
    allowFlip: raw.allowFlip ?? DEFAULT_CONFIG.allowFlip!,
  };
}

function computeFromMode(i: RectInfo, cfg: Required<PlacementConfig>): PanelPos {
  const { rect, panelW, panelH, vw, vh } = i;
  const gap = cfg.gap;
  const pad = cfg.pad;

  const centeredLeft = rect.left + rect.width / 2 - panelW / 2;
  const centeredTop = rect.top + rect.height / 2 - panelH / 2;

  const leftForRight = rect.right + gap;
  const leftForLeft = rect.left - panelW - gap;

  const topForBelow = rect.bottom + gap;
  const topForAbove = rect.top - panelH - gap;

  let left = 0;
  let top = 0;

  switch (cfg.mode) {
    case "right-center":
      left = leftForRight;
      top = centeredTop;
      break;
    case "left-center":
      left = leftForLeft;
      top = centeredTop;
      break;
    case "below-center":
      left = centeredLeft;
      top = topForBelow;
      break;
    case "above-center":
      left = centeredLeft;
      top = topForAbove;
      break;
    case "right-top":
      left = leftForRight;
      top = rect.top;
      break;
    case "right-bottom":
      left = leftForRight;
      top = rect.bottom - panelH;
      break;
    case "left-top":
      left = leftForLeft;
      top = rect.top;
      break;
    case "left-bottom":
      left = leftForLeft;
      top = rect.bottom - panelH;
      break;
  }

  left += cfg.xOffset;
  top += cfg.yOffset;

  left = clamp(left, pad, vw - panelW - pad);
  top = clamp(top, pad, vh - panelH - pad);

  return { left, top };
}

function flippedMode(mode: PlacementMode): PlacementMode {
  switch (mode) {
    case "right-center": return "left-center";
    case "left-center": return "right-center";
    case "right-top": return "left-top";
    case "left-top": return "right-top";
    case "right-bottom": return "left-bottom";
    case "left-bottom": return "right-bottom";
    case "below-center": return "above-center";
    case "above-center": return "below-center";
  }
}

function wouldOverflow(i: RectInfo, cfg: Required<PlacementConfig>): boolean {
  const { rect, panelW, panelH, vw, vh } = i;
  const gap = cfg.gap;
  const pad = cfg.pad;

  if (cfg.mode.startsWith("right")) {
    return rect.right + gap + panelW + pad > vw;
  }
  if (cfg.mode.startsWith("left")) {
    return rect.left - gap - panelW - pad < 0;
  }
  if (cfg.mode === "below-center") {
    return rect.bottom + gap + panelH + pad > vh;
  }
  if (cfg.mode === "above-center") {
    return rect.top - gap - panelH - pad < 0;
  }
  return false;
}

export default function SoundControlPanel({
  isVisible,
  onClose,
  colorClass = "border-blue-500",
  buttonRef,
  pageVariant = "default",
}: SoundControlPanelProps) {
  const { t } = useTranslation();
  const audioContext = useContext(AudioContext);

  const panelRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<number | null>(null);
  const [pos, setPos] = useState<PanelPos>({ top: 0, left: 0 });

  if (!audioContext) return null;

  const {
    backgroundEnabled,
    setBackgroundEnabled,
    instructionsEnabled,
    setInstructionsEnabled,
    guidedVoiceEnabled,
    setGuidedVoiceEnabled,
  } = audioContext;

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

  const updatePosition = useCallback(() => {
    const btn = buttonRef?.current;
    const panel = panelRef.current;
    if (!btn || !panel) return;

    const info = buildRectInfo(btn, panel);
    const kind = getViewportKind(info.vw);

    let cfg = resolveConfig(pageVariant, kind);

    if (cfg.allowFlip && wouldOverflow(info, cfg)) {
      cfg = { ...cfg, mode: flippedMode(cfg.mode) };
    }

    const nextPos = computeFromMode(info, cfg);
    setPos(nextPos);
  }, [buttonRef, pageVariant]);

  useLayoutEffect(() => {
    if (!isVisible) return;
    const raf = requestAnimationFrame(() => updatePosition());
    return () => cancelAnimationFrame(raf);
  }, [isVisible, updatePosition]);

  useEffect(() => {
    if (!isVisible) return;

    const onResize = () => updatePosition();
    const onScroll = () => updatePosition();

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [isVisible, updatePosition]);

  useEffect(() => {
    if (!isVisible) return;

    const handleMouseLeave = () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = window.setTimeout(() => onClose(), 500);
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
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, [isVisible, onClose]);

  useEffect(() => {
    if (!isVisible) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isClickOnButton = buttonRef?.current?.contains(target);
      const isClickOnPanel = panelRef.current?.contains(target);
      if (!isClickOnButton && !isClickOnPanel) onClose();
    };

    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isVisible, onClose, buttonRef]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={panelRef}
          data-testid="sound-control-panel"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          style={{ position: "fixed", top: pos.top, left: pos.left }}
          className={`z-[9999] bg-[var(--color-button)] rounded-lg shadow-lg p-4 border-2 ${colorClass} w-[260px] max-w-[calc(100vw-1rem)]`}
          role="dialog"
          aria-label={t("sound.settings")}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-semibold mb-4 text-[var(--color-button-text)]">
            {t("sound.settings")}
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-[var(--color-button-text)] cursor-pointer">
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
              <label className="text-sm text-[var(--color-button-text)] cursor-pointer">
                {t("sound.instructions")}
              </label>
              <ToggleSwitch
                id="instructions-toggle"
                data-testid="instructions-toggle"
                checked={instructionsEnabled}
                onChange={setInstructionsEnabled}
                aria-label={t("sound.instructions")}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm text-[var(--color-button-text)] cursor-pointer">
                {t("sound.exercise-guide")}
              </label>
              <ToggleSwitch
                id="guide-toggle"
                data-testid="exercise-guide-toggle"
                checked={guidedVoiceEnabled}
                onChange={setGuidedVoiceEnabled}
                aria-label={t("sound.exercise-guide")}
              />
            </div>
          </div>

          <button
            data-testid="mute-all-button"
            onClick={handleMuteAll}
            className={[
              "mt-4 w-full px-3 py-2 text-sm font-semibold rounded-md text-white transition-opacity hover:opacity-90",
              allMuted ? "bg-green-600" : "bg-red-600",
            ].join(" ")}
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

function ToggleSwitch({
  id,
  checked,
  onChange,
  "aria-label": ariaLabel,
  "data-testid": dataTestId,
}: ToggleSwitchProps) {
  return (
    <button
      id={id}
      data-testid={dataTestId}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={[
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--gradient-1-1)]",
        checked ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600",
        "border border-white/20",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block h-4 w-4 transform rounded-full transition-transform",
          "bg-white shadow-sm",
          checked ? "translate-x-6" : "translate-x-1",
        ].join(" ")}
      />
    </button>
  );
}
