import { motion } from "framer-motion";
import { ArrowLeft, Pause, Play, Volume2, VolumeX } from "lucide-react";
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
}) {  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { changeAnimation, isPaused, togglePause, resetAnimation } = useContext(MainAnimationContext);
  const audioContext = useContext(AudioContext);

  const minutesCount = location.state?.minutes || 1;
  const exerciseType = location.state?.exerciseType || "4-7-8";
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
    exerciseType,    minutes: minutesCount,
  });
    const shouldPlayMusic = !showIntro && timeLeft > 0 && !isPaused;
  const { 
    setBackgroundMusic, 
    stopBackgroundMusic, 
    isSoundEnabled, 
    setIsSoundEnabled,
    handleUserInteraction,
    initAudio
  } = audioContext;  
  const toggleSound = () => {
    handleUserInteraction();
    setIsSoundEnabled(!isSoundEnabled);
  };

  useEffect(() => {
    initAudio(exerciseType);
  }, [initAudio, exerciseType]);

  useEffect(() => {
    setBackgroundMusic(isSoundEnabled && shouldPlayMusic);
  }, [isSoundEnabled, shouldPlayMusic, setBackgroundMusic]);
  useEffect(() => {
    if (timeLeft === 0 && !showIntro && !exerciseCompleted) {
      setExerciseCompleted(true);
      if (animationTimeoutRef.current) {
        window.clearTimeout(animationTimeoutRef.current);
      }
      document.body.classList.remove('max-md:overflow-hidden', 'max-md:fixed', 'max-md:inset-0');
      navigate("/thank-you");
      resetAnimation();
    }
  }, [timeLeft, showIntro, exerciseCompleted, navigate]);

  useEffect(() => {
    if (hasResetRef.current) return;
    hasResetRef.current = true;
    document.body.classList.add('max-md:overflow-hidden', 'max-md:fixed', 'max-md:inset-0');
    
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
      document.body.classList.remove('max-md:overflow-hidden', 'max-md:fixed', 'max-md:inset-0');
      hasResetRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!animationSet.waitSet) {
      changeAnimation("wait");
      setAnimationSet(prev => ({ ...prev, waitSet: true }));
      
      animationTimeoutRef.current = window.setTimeout(() => {
        changeAnimation("4-7-8");
        setAnimationSet(prev => ({ ...prev, exerciseSet: true }));
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
      stopBackgroundMusic();
    };
  }, [stopBackgroundMusic]);
  
  useEffect(() => {
    if (!showIntro && !animationSet.exerciseSet) {
      changeAnimation("4-7-8");
      setAnimationSet(prev => ({ ...prev, exerciseSet: true }));
    }
  }, [showIntro, changeAnimation, animationSet.exerciseSet]);

  const handlePauseToggle = () => {
    togglePause();
  };

  const handleBack = () => {
    stopBackgroundMusic();
    if (animationTimeoutRef.current) {
      window.clearTimeout(animationTimeoutRef.current);
    }
    document.body.classList.remove('max-md:overflow-hidden', 'max-md:fixed', 'max-md:inset-0');
    resetAnimation();
    
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
          onClick={handleBack}        />
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

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 cursor-pointer"
              onClick={toggleSound}
            >
              <div className="flex items-center justify-center gap-2 mt-16 text-gray-700 hover:text-gray-900 transition-colors">
                {isSoundEnabled ? (
                  <>
                    <Volume2 size={36} />
                    <span className="text-base">{t("sound-enabled")}</span>
                  </>
                ) : (
                  <>
                    <VolumeX size={36} />
                    <span className="text-base">{t("sound-disabled")}</span>
                  </>
                )}
              </div>
            </motion.div>          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-grow w-full px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col justify-between items-center text-center min-h-[90vh] gap-6 px-4 py-24 md:py-8 w-full"
          >
            <h2 className="text-4xl font-bold -mt-24 md:mt-0">{formatTime(timeLeft)}</h2>

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
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="mt-8 cursor-pointer"
                onClick={toggleSound}
              >
                <div className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                  {isSoundEnabled ? (
                    <>
                      <Volume2 size={20} />
                      <span className="text-xs">{t("sound-enabled")}</span>
                    </>
                  ) : (
                    <>
                      <VolumeX size={20} />
                      <span className="text-xs">{t("sound-disabled")}</span>
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
