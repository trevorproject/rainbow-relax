import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Timer } from "lucide-react";
import { useNavigation } from "../utils/navigation";
import { useTailwindAdapter } from "../utils/tailwindAdapter";

interface Params {
  onClick: (cycles: number) => void;
}
const QuickStartPreset = ({ onClick }: Params) => {
  const { t } = useTranslation();
  const [showCustomOptions, setShowCustomOptions] = useState(false);
  const [customMinutes, setCustomMinutes] = useState<number | string>("");
  const isCustomValid = customMinutes !== "" && !isNaN(Number(customMinutes)) && Number(customMinutes) >= 0;
  const { navigateTo } = useNavigation();
  const cn = useTailwindAdapter();

  const handleNavigate = (minutes: number) => {
    onClick(minutes);
    navigateTo("/breathing", { minutes });
  };

  return (
    <div 
      className={cn("rr-flex rr-flex-col rr-items-center rr-justify-center rr-w-full rr-gap-1 rr-p-1")}
      data-testid="quick-start-preset"
    >
      <div 
        className={cn("rr-flex rr-flex-wrap rr-justify-center rr-items-center rr-gap-1 rr-w-full")}
      >
        <button
          onClick={() => handleNavigate(1)}
          type="button"
          className={cn("rr-rounded-full rr-flex rr-items-center rr-justify-center rr-cursor-pointer rr-transition-all rr-text-center rr-border-none rr-outline-none rr-bg-[#4A7543] rr-text-white rr-font-bold hover:rr-bg-[#4A7543] hover:rr-scale-105 focus:rr-outline-2 focus:rr-outline-[#4A7543] focus:rr-outline-offset-2")}
          style={{ 
            backgroundColor: 'var(--circle-level-3)', 
            color: 'var(--color-button-text)',
            aspectRatio: '1/1',
            width: 'clamp(48px, 12vw, 80px)',
            height: 'clamp(48px, 12vw, 80px)',
            minWidth: '48px',
            minHeight: '48px'
          }}
          data-testid="start-exercise-button-1min"
        >
          <span className={cn("rr-text-white rr-font-bold")} style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.875rem)' }}>
            1 min
          </span>
        </button>
        <button
          onClick={() => handleNavigate(3)}
          type="button"
          className={cn("rr-rounded-full rr-flex rr-items-center rr-justify-center rr-cursor-pointer rr-transition-all rr-text-center rr-border-none rr-outline-none rr-bg-[#4A7543] rr-text-white rr-font-bold hover:rr-bg-[#4A7543] hover:rr-scale-105 focus:rr-outline-2 focus:rr-outline-[#4A7543] focus:rr-outline-offset-2")}
          style={{ 
            backgroundColor: 'var(--circle-level-3)', 
            color: 'var(--color-button-text)',
            aspectRatio: '1/1',
            width: 'clamp(48px, 12vw, 80px)',
            height: 'clamp(48px, 12vw, 80px)',
            minWidth: '48px',
            minHeight: '48px'
          }}
          data-testid="start-exercise-button-3min"
        >
          <span className={cn("rr-text-white rr-font-bold")} style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.875rem)' }}>
            3 min
          </span>
        </button>
        <button
          onClick={() => handleNavigate(5)}
          type="button"
          className={cn("rr-rounded-full rr-flex rr-items-center rr-justify-center rr-cursor-pointer rr-transition-all rr-text-center rr-border-none rr-outline-none rr-bg-[#4A7543] rr-text-white rr-font-bold hover:rr-bg-[#4A7543] hover:rr-scale-105 focus:rr-outline-2 focus:rr-outline-[#4A7543] focus:rr-outline-offset-2")}
          style={{ 
            backgroundColor: 'var(--circle-level-3)', 
            color: 'var(--color-button-text)',
            aspectRatio: '1/1',
            width: 'clamp(48px, 12vw, 80px)',
            height: 'clamp(48px, 12vw, 80px)',
            minWidth: '48px',
            minHeight: '48px'
          }}
          data-testid="start-exercise-button-5min"
        >
          <span className={cn("rr-text-white rr-font-bold")} style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.875rem)' }}>
            5 min
          </span>
        </button>
        <button
          onClick={() => setShowCustomOptions(!showCustomOptions)}
          type="button"
          aria-label={t("Custom")}
          className={cn("rr-rounded-full rr-flex rr-items-center rr-justify-center rr-cursor-pointer rr-transition-all rr-text-center rr-border-none rr-outline-none rr-bg-[#4A7543] rr-text-white rr-font-bold hover:rr-bg-[#4A7543] hover:rr-scale-105 focus:rr-outline-2 focus:rr-outline-[#4A7543] focus:rr-outline-offset-2")}
          style={{ 
            backgroundColor: 'var(--circle-level-3)', 
            color: 'var(--color-button-text)',
            aspectRatio: '1/1',
            width: 'clamp(48px, 12vw, 80px)',
            height: 'clamp(48px, 12vw, 80px)',
            minWidth: '48px',
            minHeight: '48px'
          }}
          data-testid="custom-time-button"
        >
          <Timer className={cn("rr-text-white")} style={{ width: 'clamp(1.25rem, 4vw, 1.5rem)', height: 'clamp(1.25rem, 4vw, 1.5rem)' }} />
        </button>
      </div>
      {showCustomOptions && (
        <div className={cn("rr-flex rr-flex-col rr-items-center rr-gap-3")}>
          <div className={cn("rr-w-20 sm:rr-w-32 md:rr-w-40 lg:rr-w-48 rr-h-6 sm:rr-h-8 md:rr-h-10 rr-bg-white rr-rounded-lg rr-flex rr-items-center rr-justify-center rr-px-2")} data-testid="custom-time-input-container">
            <input
              type="number"
              min="0"
              step="1"
              value={customMinutes}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "") {
                  setCustomMinutes("");
                } else {
                  const num = Number(value);
                  if (!isNaN(num) && num >= 0) {
                    setCustomMinutes(value);
                  }
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && isCustomValid) {
                  const num = Number(customMinutes);
                  if (!isNaN(num) && num >= 0) {
                    handleNavigate(num);
                    setCustomMinutes("");
                  }
                }
              }}
              placeholder={t("cycles-number")}
                  className={cn("rr-w-full rr-h-full rr-bg-transparent rr-outline-none rr-text-center rr-text-gray-700 rr-text-3xs sm:rr-text-2xs")}
              data-testid="custom-time-input"
            />
          </div>
          <button
            type="button"
            disabled={!isCustomValid}
            onClick={() => {
              const num = Number(customMinutes);
              if (!isNaN(num) && num >= 0) {
                handleNavigate(num);
                setCustomMinutes("");
              }
            }}
            className={cn(`rr-w-16 sm:rr-w-20 md:rr-w-24 lg:rr-w-28 rr-h-6 sm:rr-h-8 md:rr-h-10 rr-rounded-lg rr-flex rr-items-center rr-justify-center rr-bg-[var(--color-button)] ${
              isCustomValid ? "rr-cursor-pointer" : "rr-opacity-50 rr-cursor-not-allowed"
            }`)}
            data-testid="custom-start-button"
          >
                <span className={cn("rr-text-3xs sm:rr-text-2xs rr-text-white rr-font-bold")}>
              {t("Start")}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default QuickStartPreset;
