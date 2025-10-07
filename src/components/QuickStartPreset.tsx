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
      className={cn("flex flex-col items-center justify-center w-full gap-1 p-1")}
      data-testid="quick-start-preset"
    >
      <div 
        className={cn("flex flex-wrap justify-center items-center gap-1 w-full")}
      >
        <button
          onClick={() => handleNavigate(1)}
          type="button"
          className={cn("rounded-full flex items-center justify-center cursor-pointer transition-all text-center border-none outline-none bg-[#4A7543] text-white font-bold hover:bg-[#4A7543] hover:scale-105 focus:outline-2 focus:outline-[#4A7543] focus:outline-offset-2")}
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
          <span className={cn("text-white font-bold")} style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.875rem)' }}>
            1 min
          </span>
        </button>
        <button
          onClick={() => handleNavigate(3)}
          type="button"
          className={cn("rounded-full flex items-center justify-center cursor-pointer transition-all text-center border-none outline-none bg-[#4A7543] text-white font-bold hover:bg-[#4A7543] hover:scale-105 focus:outline-2 focus:outline-[#4A7543] focus:outline-offset-2")}
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
          <span className={cn("text-white font-bold")} style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.875rem)' }}>
            3 min
          </span>
        </button>
        <button
          onClick={() => handleNavigate(5)}
          type="button"
          className={cn("rounded-full flex items-center justify-center cursor-pointer transition-all text-center border-none outline-none bg-[#4A7543] text-white font-bold hover:bg-[#4A7543] hover:scale-105 focus:outline-2 focus:outline-[#4A7543] focus:outline-offset-2")}
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
          <span className={cn("text-white font-bold")} style={{ fontSize: 'clamp(0.6rem, 2.5vw, 0.875rem)' }}>
            5 min
          </span>
        </button>
        <button
          onClick={() => setShowCustomOptions(!showCustomOptions)}
          type="button"
          aria-label={t("Custom")}
          className={cn("rounded-full flex items-center justify-center cursor-pointer transition-all text-center border-none outline-none bg-[#4A7543] text-white font-bold hover:bg-[#4A7543] hover:scale-105 focus:outline-2 focus:outline-[#4A7543] focus:outline-offset-2")}
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
          <Timer className={cn("text-white")} style={{ width: 'clamp(1.25rem, 4vw, 1.5rem)', height: 'clamp(1.25rem, 4vw, 1.5rem)' }} />
        </button>
      </div>
      {showCustomOptions && (
        <div className={cn("flex flex-col items-center gap-3")}>
          <div className={cn("w-20 sm:w-32 md:w-40 lg:w-48 h-6 sm:h-8 md:h-10 bg-white rounded-lg flex items-center justify-center px-2")} data-testid="custom-time-input-container">
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
                  className={cn("w-full h-full bg-transparent outline-none text-center text-gray-700 text-3xs sm:text-2xs")}
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
            className={cn(`w-16 sm:w-20 md:w-24 lg:w-28 h-6 sm:h-8 md:h-10 rounded-lg flex items-center justify-center bg-[var(--color-button)] ${
              isCustomValid ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
            }`)}
            data-testid="custom-start-button"
          >
                <span className={cn("text-3xs sm:text-2xs text-white font-bold")}>
              {t("Start")}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default QuickStartPreset;
