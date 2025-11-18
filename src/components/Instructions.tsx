import { motion } from "framer-motion";
import { ArrowLeft, Pause, Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useBreathingExercise } from "../hooks/useBreathingInstructions";
import { useContext, useEffect, useRef, useState } from "react";
import { MainAnimationContext } from "../context/MainAnimationContext";
import { AudioContext } from "../context/AudioContext";

export default function BreathingInstructions({
  onBack,
}: {
  onBack?: () => void;
}) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [isPaused, setIsPaused] = useState(false);
   const animationProvider = useContext(MainAnimationContext);

  const audioContext = useContext(AudioContext);

  const minutesCount = location.state?.minutes || 1;
  const exerciseType = location.state?.exerciseType || "4-7-8";
  const animationTimeoutRef = useRef<number | null>(null);
  const hasResetRef = useRef<boolean>(false);
  const [animationSet, setAnimationSet] = useState<{
    waitSet: boolean;
    exerciseSet: boolean;
  }>({ waitSet: false, exerciseSet: false });

  const {
    exercise,
    showIntro,
    timeLeft,
    currentInstruction,
    formatTime,
    resetExercise,
  } = useBreathingExercise({
    exerciseType,
    minutes: minutesCount,
  });
  const shouldPlayMusic = !showIntro && timeLeft > 0 && !isPaused;
  const {
    stopMusicAndInstructions,
    setBackgroundMusic,
    setGuidedVoice,
    backgroundEnabled,
    instructionsEnabled,
    guidedVoiceEnabled,
    initAudio,
  } = audioContext;

  const StopMusic = () => {
    stopMusicAndInstructions();
  };

  useEffect(() => {
    initAudio(exerciseType);
  }, [exerciseType, initAudio]);

  useEffect(() => {
    setBackgroundMusic((backgroundEnabled || instructionsEnabled) && shouldPlayMusic);
    setGuidedVoice(guidedVoiceEnabled && showIntro);
  }, [backgroundEnabled, instructionsEnabled, guidedVoiceEnabled, shouldPlayMusic, showIntro, setBackgroundMusic, setGuidedVoice]);

  useEffect(() => {
    if (timeLeft === 0 && !showIntro) {

      if (animationTimeoutRef.current) {
        window.clearTimeout(animationTimeoutRef.current);
      }
      document.body.classList.remove(
        "max-md:overflow-hidden",
        "max-md:fixed",
        "max-md:inset-0"
      );
      navigate("/thank-you");
    }
  }, [timeLeft, showIntro, navigate]);

  useEffect(() => {
    if (hasResetRef.current) return;
    hasResetRef.current = true;
    document.body.classList.add(
      "max-md:overflow-hidden",
      "max-md:fixed",
      "max-md:inset-0"
    );
    resetExercise()
    const timeoutId = animationTimeoutRef.current;
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
      document.body.classList.remove(
        "max-md:overflow-hidden",
        "max-md:fixed",
        "max-md:inset-0"
      );
      hasResetRef.current = false;
    };
  }, [resetExercise]);

  useEffect(() => {
    if (!animationSet.waitSet && showIntro) {
      animationProvider.changeAnimation("wait")
      setAnimationSet((prev) => ({ ...prev, waitSet: true }));
    }
    if (!showIntro && !animationSet.exerciseSet) {
      // When intro ends (after 13s), change to exercise animation
        animationProvider.changeAnimation("Exercise478");
        setAnimationSet((prev) => ({ ...prev, exerciseSet: true }));
    }

    const timeoutId = animationTimeoutRef.current;
    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [animationSet.waitSet, animationSet.exerciseSet, showIntro, exerciseType, animationProvider]);

  useEffect(() => {
    return () => {
      stopMusicAndInstructions();
    };
  }, [stopMusicAndInstructions]);

  useEffect(() => {
    if (!showIntro && !animationSet.exerciseSet && !isPaused) {
      setAnimationSet((prev) => ({ ...prev, exerciseSet: true }));
    }
  }, [showIntro, animationSet.exerciseSet, isPaused]);

const handlePauseToggle = () => {
    if (!isPaused) {
      animationProvider.pause();
      StopMusic();
    } else {
      animationProvider.resume();
      
    }
    setIsPaused(!isPaused);
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

    if (onBack) {
      onBack();
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen w-full text-[#ffffff] overflow-hidden fixed inset-0">
      <motion.div
        className="fixed top-8 left-8"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <ArrowLeft
          size={24}
          className="text-[#ffffff] cursor-pointer hover:opacity-70 transition-opacity duration-300"
          onClick={handleBack}
          data-testid="back-button"
        />
      </motion.div>

      {showIntro ? (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 2 }}
          className="w-full flex flex-col items-center justify-center text-center pt-46 pb-8"
        >
          <div className="px-8 py-8">
            <h1 className="text-3xl md:text-4xl">{t(exercise.name)}</h1>
            <h2 className="text-2xl md:text-3xl mt-2">
              {t("breath-exercise-label")}
            </h2>
            <p className="text-[#ffffff] text-lg md:text-xl mt-28">
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
            className="flex flex-col justify-between items-center text-center min-h-[90vh] gap-6 px-4 py-24 md:py-8 w-full"
          >
            <h2 className="text-4xl font-bold -mt-24 md:mt-0" data-testid="timer">
              {formatTime(timeLeft)}
            </h2>

            <div className="flex flex-col items-center">
              {timeLeft > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-4"
                >
                  <button
                    onClick={handlePauseToggle}
                    className="transition-transform duration-300 cursor-pointer hover:scale-125 hover:opacity-70"
                    data-testid={isPaused ? "play-button" : "pause-button"}
                  >
                    {isPaused ? (
                      <Play size={32} className="text-[#ffffff]" />
                    ) : (
                      <Pause size={32} className="text-[#ffffff]" />
                    )}
                  </button>
                </motion.div>
              )}

              <motion.p
                key={exercise.instructions[currentInstruction].key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 0.3 }}
                className="text-lg md:text-xl text-[#ffffff] text-center max-w-md mx-auto"
                data-testid="instruction-text"
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
