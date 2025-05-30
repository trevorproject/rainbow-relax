
import { motion } from "framer-motion";
import { ArrowLeft, Pause, Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useBreathingExercise } from "../hooks/useBreathingInstructions";
import { useContext, useEffect } from "react";
import { MainAnimationContext } from "../context/MainAnimationContext";
import { useRef } from "react";

export default function BreathingInstructions({
  onBack,
}: {
  onBack?: () => void;
}) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const animation = useContext(MainAnimationContext);

  const minutesCount = location.state?.minutes || 1;
  const exerciseType = location.state?.exerciseType || "4-7-8";
  const timeoutRef = useRef<number | null>(null);

  const {
    exercise,
    showIntro,
    timeLeft,
    isPaused,
    currentInstruction,
    formatTime,
    togglePause,
  } = useBreathingExercise({
    exerciseType,
    minutes: minutesCount,
  });

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      animation.changeAnimation("4-7-8");
    }, 8000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleBack = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (onBack) {
      onBack();
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full text-gray-800 overflow-hidden fixed inset-0">
      <motion.div
        className="fixed top-8 left-8"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <ArrowLeft
          size={24}
          className="text-gray-700 cursor-pointer hover:opacity-70 transition-opacity duration-300"
          onClick={handleBack}
        />
      </motion.div>

      {showIntro ? (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.7 }}
          className="w-full flex flex-col items-center justify-center text-center pt-46 pb-8"
        >
          <div className="px-8 py-8">
            <h1 className="text-3xl md:text-4xl">{t(exercise.name)}</h1>
            <h2 className="text-2xl md:text-3xl mt-2">
              {t("breath-exercise-label")}
            </h2>
            <p className="text-gray-700 text-lg md:text-xl mt-28">
              {t(`instructions.${exerciseType}.instructions-text`)}
            </p>

          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-grow w-full px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col justify-between items-center text-center min-h-[90vh] gap-6 px-4 py-8 w-full"
          >
            <h2 className="text-4xl font-bold">{formatTime(timeLeft)}</h2>

            <div className="flex flex-col items-center">
              {timeLeft > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-4"
                >
                  <button
                    onClick={togglePause}
                    className="transition-transform duration-300 cursor-pointer hover:scale-125 hover:opacity-70"
                  >
                    {isPaused ? (
                      <Play size={32} className="text-black" />
                    ) : (
                      <Pause size={32} className="text-black" />
                    )}
                  </button>
                </motion.div>
              )}

              <motion.p
                key={exercise.instructions[currentInstruction].key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 0.3 }}
                className="text-lg md:text-xl text-gray-700 text-center max-w-md mx-auto"
              >
                {t(
                  `instructions.${exerciseType}.${exercise.instructions[currentInstruction].key}`
                )}
              </motion.p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
