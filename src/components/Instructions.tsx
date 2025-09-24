import { motion } from "framer-motion";
import { ArrowLeft, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigation } from "../utils/navigation";
import { RoutesEnum } from "../router/routesEnum";
import { useBreathingExercise } from "../hooks/useBreathingInstructions";
import { useContext, useEffect, useRef, useState } from "react";
import { MainAnimationContext } from "../context/MainAnimationContext";
import { AudioContext } from "../context/AudioContext";
import { useTailwindAdapter } from "../utils/tailwindAdapter";

export default function BreathingInstructions({
  onBack,
  minutes = 1,
  exerciseType = "4-7-8",
}: {
  onBack?: () => void;
  minutes?: number;
  exerciseType?: string;
}) {
  const { t } = useTranslation();
  const { navigateTo } = useNavigation();
  const cn = useTailwindAdapter();

  const { changeAnimation, isPaused, togglePause, resetAnimation } =
    useContext(MainAnimationContext);
  const audioContext = useContext(AudioContext);

  const minutesCount = minutes;
  const exerciseTypeValue = exerciseType;
  const animationTimeoutRef = useRef<number | null>(null);
  const hasResetRef = useRef<boolean>(false);
  const [animationSet, setAnimationSet] = useState<{
    waitSet: boolean;
    exerciseSet: boolean;
  }>({ waitSet: false, exerciseSet: false });
  const [exerciseCompleted, setExerciseCompleted] = useState(false);

  const {
    exercise,
    showIntro,
    timeLeft,
    currentInstruction,
    formatTime,
    resetExercise,
  } = useBreathingExercise({
    exerciseType: exerciseTypeValue,
    minutes: minutesCount,
  });
  const shouldPlayMusic = !showIntro && timeLeft > 0 && !isPaused;
  const {
    volumeDownMusic,
    stopMusicAndInstructions,
    setBackgroundMusic,
    setGuidedVoice,
    isSoundEnabled,
    setIsSoundEnabled,
    volumeUpMusic,
    initAudio,
  } = audioContext;
  const toggleSound = () => {
    try {
      if (isSoundEnabled) {
        volumeDownMusic();
        setIsSoundEnabled(false);
      } else {
        volumeUpMusic();
        setIsSoundEnabled(true);
      }
    } catch (error) {
      console.error('Error in toggleSound:', error);
      // Fallback: just toggle the state without audio functions
      setIsSoundEnabled(!isSoundEnabled);
    }
  };

  const StopMusic = () => {
    stopMusicAndInstructions();
  };

  useEffect(() => {
    initAudio(exerciseTypeValue as "4-7-8");
  }, [initAudio, exerciseTypeValue]);

  useEffect(() => {
    // Simple, clear audio management without race conditions
    setBackgroundMusic(isSoundEnabled && shouldPlayMusic);
    
    if (isSoundEnabled) {
      if (showIntro) {
        // Play intro voice (no duration - plays until naturally ended)
        setGuidedVoice(true);
      } else if (shouldPlayMusic && timeLeft > 0) {
        // Play voice instructions for the remaining time
        setGuidedVoice(true);
      } else {
        // Stop voice audio
        setGuidedVoice(false);
      }
    } else {
      // Sound disabled - stop all voice audio
      setGuidedVoice(false);
    }
  }, [isSoundEnabled, shouldPlayMusic, showIntro, timeLeft, setBackgroundMusic, setGuidedVoice]);

  useEffect(() => {
    if (timeLeft === 0 && !showIntro && !exerciseCompleted) {
      setExerciseCompleted(true);
      if (animationTimeoutRef.current) {
        window.clearTimeout(animationTimeoutRef.current);
      }
      document.body.classList.remove(
        "max-md:overflow-hidden",
        "max-md:fixed",
        "max-md:inset-0"
      );
      navigateTo(RoutesEnum.THANKYOU);
      resetAnimation();
    }
  }, [timeLeft, showIntro, exerciseCompleted, navigateTo]);

  useEffect(() => {
    if (hasResetRef.current) return;
    hasResetRef.current = true;
    document.body.classList.add(
      "max-md:overflow-hidden",
      "max-md:fixed",
      "max-md:inset-0"
    );

    resetAnimation();
    resetExercise();
    setAnimationSet({ waitSet: false, exerciseSet: false });
    if (animationTimeoutRef.current) {
      window.clearTimeout(animationTimeoutRef.current);
    }

    return () => {
      if (animationTimeoutRef.current) {
        window.clearTimeout(animationTimeoutRef.current);
      }
      document.body.classList.remove(
        "max-md:overflow-hidden",
        "max-md:fixed",
        "max-md:inset-0"
      );
      hasResetRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!animationSet.waitSet) {
      changeAnimation("wait");
      setAnimationSet((prev) => ({ ...prev, waitSet: true }));

      animationTimeoutRef.current = window.setTimeout(() => {
        changeAnimation("4-7-8");
        setAnimationSet((prev) => ({ ...prev, exerciseSet: true }));
      }, 8000);
    }

    return () => {
      if (animationTimeoutRef.current) {
        window.clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [changeAnimation, animationSet.waitSet]);

  useEffect(() => {
    return () => {
      stopMusicAndInstructions();
    };
  }, [stopMusicAndInstructions]);

  useEffect(() => {
    if (!showIntro && !animationSet.exerciseSet) {
      changeAnimation("4-7-8");
      setAnimationSet((prev) => ({ ...prev, exerciseSet: true }));
    }
  }, [showIntro, changeAnimation, animationSet.exerciseSet]);

  const handlePauseToggle = () => {
    togglePause();
    StopMusic();
  };

  const handleBack = () => {
    stopMusicAndInstructions();
    if (animationTimeoutRef.current) {
      window.clearTimeout(animationTimeoutRef.current);
    }
    document.body.classList.remove(
      "max-md:overflow-hidden",
      "max-md:fixed",
      "max-md:inset-0"
    );
    resetAnimation();

    if (onBack) {
      onBack();
    } else {
      navigateTo(RoutesEnum.HOME);
    }
  };

  return (
    <div className={cn("breathing-instructions flex flex-col items-center min-h-full w-full text-gray-800 overflow-hidden absolute inset-0")}>
      <motion.div
        className={cn("absolute top-8 left-8 z-10")}
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <ArrowLeft
          size={24}
          className={cn("text-gray-700 cursor-pointer hover:opacity-70 transition-opacity duration-300")}
          onClick={handleBack}
        />
      </motion.div>

      {showIntro ? (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.7 }}
          className={cn("w-full flex flex-col items-center justify-center text-center pt-46 pb-8")}
        >
          <div className={cn("px-8 py-8")}>
            <h1 className={cn("text-3xl md:text-4xl")} style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}>{t(exercise.name)}</h1>
            <h2 className={cn("text-2xl md:text-3xl mt-2")} style={{ fontSize: "clamp(1.2rem, 3vw, 2rem)" }}>
              {t("breath-exercise-label")}
            </h2>
            <p className={cn("text-gray-700 text-lg md:text-xl mt-28")} style={{ fontSize: "clamp(0.9rem, 2.5vw, 1.25rem)" }}>
              {t(`instructions.${exerciseType}.instructions-text`)}
            </p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={cn("mt-8 cursor-pointer")}
              onClick={toggleSound}
            >
              <div className={cn("flex items-center justify-center gap-2 mt-16 text-gray-700 hover:text-gray-900 transition-colors")}>
                {isSoundEnabled ? (
                  <>
                    <Volume2 size={36} />
                    <span className={cn("text-base")} style={{ fontSize: "clamp(0.8rem, 2vw, 1rem)" }}>{t("sound-enabled")}</span>
                  </>
                ) : (
                  <>
                    <VolumeX size={36} />
                    <span className={cn("text-base")} style={{ fontSize: "clamp(0.8rem, 2vw, 1rem)" }}>{t("sound-disabled")}</span>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <div className={cn("flex flex-col items-center justify-center flex-grow w-full px-4")}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className={cn("flex flex-col justify-between items-center text-center min-h-[90vh] gap-6 px-4 py-24 md:py-8 w-full")}
          >
            <h2 className={cn("text-4xl font-bold -mt-24 md:mt-0")} style={{ fontSize: "clamp(2rem, 6vw, 3rem)" }}>
              {formatTime(timeLeft)}
            </h2>

            <div className={cn("flex flex-col items-center")}>
              {timeLeft > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn("mb-4")}
                >
                  <button
                    onClick={handlePauseToggle}
                    className={cn("transition-transform duration-300 cursor-pointer hover:scale-125 hover:opacity-70")}
                  >
                    {isPaused ? (
                      <Play size={32} className={cn("text-black")} />
                    ) : (
                      <Pause size={32} className={cn("text-black")} />
                    )}
                  </button>
                </motion.div>
              )}

              <motion.p
                key={exercise.instructions[currentInstruction].key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 0.3 }}
                className={cn("text-lg md:text-xl text-gray-700 text-center max-w-md mx-auto")}
                style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)" }}
              >
                {t(
                  `instructions.${exerciseType}.${exercise.instructions[currentInstruction].key}`
                )}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                className={cn("mt-8 cursor-pointer")}
                onClick={toggleSound}
              >
                <div className={cn("flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition-colors")}>
                  {isSoundEnabled ? (
                    <>
                      <Volume2 size={20} />
                      <span className={cn("text-xs")} style={{ fontSize: "clamp(0.6rem, 1.5vw, 0.75rem)" }}>{t("sound-enabled")}</span>
                    </>
                  ) : (
                    <>
                      <VolumeX size={20} />
                      <span className={cn("text-xs")} style={{ fontSize: "clamp(0.6rem, 1.5vw, 0.75rem)" }}>{t("sound-disabled")}</span>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
