import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Timer } from "lucide-react";
import { useNavigation } from "../utils/navigation";
// import { useTailwindAdapter } from "../utils/tailwindAdapter";

interface Params {
  onClick: (cycles: number) => void;
}
const QuickStartPreset = ({ onClick }: Params) => {
  const { t } = useTranslation();
  const [showCustomOptions, setShowCustomOptions] = useState(false);
  const [customMinutes, setCustomMinutes] = useState<number | string>("");
  const isCustomValid = customMinutes !== "" && !isNaN(Number(customMinutes)) && Number(customMinutes) >= 0;
  const { navigateTo } = useNavigation();
  // const cn = useTailwindAdapter();
  const cn = (classes: string) => classes; // Use original classes for now

  const handleNavigate = (minutes: number) => {
    onClick(minutes);
    navigateTo("/breathing", { minutes });
  };

  return (
    <div className="quick-start-preset" style={{ marginTop: "0.0rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", gap: "0.3rem" }} data-testid="quick-start-preset">
      <div className="button-container" style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "clamp(0.1rem, 0.8vw, 0.6rem)", alignItems: "center", width: "100%", maxWidth: "100%" }}>
        <button
          onClick={() => handleNavigate(1)}
          type="button"
          className="breathing-button"
          style={{ 
            width: "clamp(1rem, 5vw, 3rem)",
            height: "clamp(1rem, 5vw, 3rem)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            textAlign: "center",
            border: "none",
            outline: "none",
            backgroundColor: "var(--circle-level-3)",
            color: "var(--color-button-text)",
            fontWeight: "bold",
            fontFamily: "var(--font-global)",
            fontSize: "clamp(0.3rem, 1.2vw, 0.7rem)"
          }}
          data-testid="start-exercise-button-1min"
        >
          <p
            className={cn("text-white font-bold")}
            style={{ fontFamily: "var(--font-global)" }}
          >
            1 min
          </p>
        </button>
        <button
          onClick={() => handleNavigate(3)}
          type="button"
          className="breathing-button"
          style={{ 
            width: "clamp(2rem, 5vw, 3rem)",
            height: "clamp(2rem, 5vw, 3rem)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            textAlign: "center",
            border: "none",
            outline: "none",
            backgroundColor: "var(--circle-level-3)",
            color: "var(--color-button-text)",
            fontWeight: "bold",
            fontFamily: "var(--font-global)",
            fontSize: "clamp(0.3rem, 1.2vw, 0.7rem)"
          }}
          data-testid="start-exercise-button-3min"
        >
          <p
            className={cn("text-white font-bold")}
            style={{ fontFamily: "var(--font-global)" }}
          >
            3 min
          </p>
        </button>
        <button
          onClick={() => handleNavigate(5)}
          type="button"
          className="breathing-button"
          style={{ 
            width: "clamp(2rem, 5vw, 3rem)",
            height: "clamp(2rem, 5vw, 3rem)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            textAlign: "center",
            border: "none",
            outline: "none",
            backgroundColor: "var(--circle-level-3)",
            color: "var(--color-button-text)",
            fontWeight: "bold",
            fontFamily: "var(--font-global)",
            fontSize: "clamp(0.3rem, 1.2vw, 0.7rem)"
          }}
          data-testid="start-exercise-button-5min"
        >
          <p
            className={cn("text-white font-bold")}
            style={{ fontFamily: "var(--font-global)" }}
          >
            5 min
          </p>
        </button>
        <button
          onClick={() => setShowCustomOptions(!showCustomOptions)}
          type="button"
          aria-label={t("Custom")}
          className="breathing-button"
          style={{ 
            width: "clamp(2rem, 5vw, 3rem)",
            height: "clamp(2rem, 5vw, 3rem)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            textAlign: "center",
            border: "none",
            outline: "none",
            backgroundColor: "var(--circle-level-3)",
            color: "var(--color-button-text)",
            fontWeight: "bold",
            fontFamily: "var(--font-global)",
            fontSize: "clamp(0.3rem, 1.2vw, 0.7rem)"
          }}
          data-testid="custom-time-button"
        >
          <p
            className="text-white font-bold"
            style={{
              fontFamily: "var(--font-global)",
            }}
          >
            <Timer className="text-white w-6 h-6 md:w-8 md:h-8" />
          </p>
        </button>
      </div>
      {showCustomOptions && (
        <div className="rr-flex rr-flex-col rr-items-center rr-gap-3">
          <div className={cn("w-85 sm:w-64 md:w-80 lg:w-96 bg-white rr-rounded-lg rr-flex rr-items-center rr-justify-center rr-px-4")} style={{ height: "clamp(1rem, 2vw, 1.2rem)" }} data-testid="custom-time-input-container">
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
              className={cn("w-full h-full bg-transparent outline-none text-center text-gray-700 text-sm")}
              style={{ fontFamily: "var(--font-global)" }}
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
            className={cn(`w-25 sm:w-32 md:w-40 lg:w-48 rr-rounded-lg rr-flex rr-items-center rr-justify-center ${
              isCustomValid ? "rr-cursor-pointer" : "rr-opacity-50 cursor-not-allowed"
            }`)}
            style={{ height: "clamp(1rem, 2vw, 1.2rem)", backgroundColor: "var(--color-button)" }}
            data-testid="custom-start-button"
          >
            <h2
              className={cn("rr-text-sm rr-text-white rr-font-bold")}
              style={{
                fontFamily: "var(--font-global)",
                margin: 0,
                padding: 0,
                lineHeight: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white"
              }}
            >
              {t("Start")}
            </h2>
          </button>
        </div>
      )}
    </div>
  );
};

export default QuickStartPreset;
