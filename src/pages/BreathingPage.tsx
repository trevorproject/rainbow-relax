import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Pause, Play } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useBreathingExercise } from "../hooks/useBreathingExercise";
import { useContext, useEffect, useRef, useState } from "react";
import { AnimationContext } from "../context/AnimationContext";
import { AudioContext } from "../context/AudioContext";
import { useBreathingTimer } from "../hooks/useBreathingTimer";
import { track, EVENTS } from "../utils/analytics";
import { SoundControlButton } from "../components/SoundControl";
import { RoutesEnum } from "../router/routesEnum";

export default function BreathingPage({ onBack }: { onBack?: () => void }) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const animationProvider = useContext(AnimationContext);
  const isPaused = animationProvider.isPaused;
  const audioContext = useContext(AudioContext);

  const minutesCount = location.state?.minutes || 1;
  const exerciseType = location.state?.exerciseType || "4-7-8";
  const hasResetRef = useRef<boolean>(false);
  const [animationSet, setAnimationSet] = useState<{ waitSet: boolean; exerciseSet: boolean }>(
    { waitSet: false, exerciseSet: false }
  );

  const { exercise, showIntro, timeLeft, currentInstruction, formatTime, resetExercise } =
    useBreathingExercise({ exerciseType, minutes: minutesCount });

  const breathingTimer = useBreathingTimer({
    cycleDuration: exercise.cycleDuration,
    enabled: !showIntro && timeLeft > 0,
  });

  const shouldPlayMusic = !showIntro && timeLeft > 0 && !isPaused;
  const { stopMusicAndInstructions, setBackgroundMusic, setGuidedVoice, initAudio } = audioContext;

  const locale = i18n.language?.startsWith("es") ? "es" : "en";
  const screen = "breathing";
  const pattern = exerciseType;
  const duration_bucket = presetToBucket(minutesCount);
  const totalSeconds = minutesCount * 60;
  const elapsedSeconds = Math.max(0, totalSeconds - timeLeft);
  const [pausesCount, setPausesCount] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => { initAudio(exerciseType); }, [exerciseType, initAudio]);

  useEffect(() => {
    if (!isPaused) {
      if (shouldPlayMusic) setBackgroundMusic(true);
      if (showIntro) setGuidedVoice(true);
    }
    // cyclePosition intentionally excluded — seek sync on pause/resume is handled by
    // handlePauseToggle which passes the position directly. This effect only starts/stops playback.
    // backgroundEnabled, instructionsEnabled, guidedVoiceEnabled excluded intentionally —
    // volume changes are handled by persistence functions in useAudio.
  }, [shouldPlayMusic, showIntro, setBackgroundMusic, setGuidedVoice, isPaused]);

  useEffect(() => {
    if (timeLeft === 0 && !showIntro) {
      navigate(RoutesEnum.THANKYOU);
    }
  }, [timeLeft, showIntro, navigate]);

  useEffect(() => {
    if (hasResetRef.current) return;
    hasResetRef.current = true;
    document.body.classList.add("max-md:overflow-hidden");
    resetExercise();
    return () => {
      document.body.classList.remove("max-md:overflow-hidden");
      hasResetRef.current = false;
    };
  }, [resetExercise]);

  useEffect(() => {
    if (!animationSet.waitSet && showIntro) {
      animationProvider.changeAnimation("wait");
      setAnimationSet((prev) => ({ ...prev, waitSet: true }));
    }
    if (!showIntro && !animationSet.exerciseSet) {
      animationProvider.changeAnimation(exerciseType);
      setAnimationSet((prev) => ({ ...prev, exerciseSet: true }));
      if (!startedRef.current) {
        startedRef.current = true;
        track(EVENTS.BREATHING_STARTED, { pattern, duration_bucket, locale });
      }
    }
  }, [animationSet.waitSet, animationSet.exerciseSet, showIntro, exerciseType, animationProvider, pattern, duration_bucket, locale]);

  useEffect(() => {
    return () => { stopMusicAndInstructions(); };
  }, [stopMusicAndInstructions]);

  const handlePauseToggle = () => {
    const next = !isPaused;
    if (!isPaused) {
      breathingTimer.pause();
      animationProvider.pause();
      setPausesCount((n) => n + 1);
      if (!showIntro && timeLeft > 0) setBackgroundMusic(false);
      if (showIntro) setGuidedVoice(false);
    } else {
      const cyclePosition = breathingTimer.cyclePosition;
      breathingTimer.resume();
      animationProvider.resume();
      if (!showIntro && timeLeft > 0) setBackgroundMusic(true, cyclePosition);
      if (showIntro) setGuidedVoice(true, cyclePosition);
    }
    track(EVENTS.BREATHING_PAUSED_TOGGLED, { value: Number(next), screen, locale });
  };

  const handleBack = () => {
    track(EVENTS.BREATHING_BACK_CLICK, {
      pattern, elapsed_bucket: bucketElapsed(elapsedSeconds), elapsed_seconds: elapsedSeconds, pauses_count: pausesCount, locale,
    });
    stopMusicAndInstructions();
    document.body.classList.remove("max-md:overflow-hidden");
    if (onBack) { onBack(); } else { navigate(RoutesEnum.HOME); }
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

      <SoundControlButton className="fixed right-2 top-4 md:right-2 md:top-4 z-[49]" />

      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 2 }}
            className="w-full flex flex-col items-center justify-center text-center pt-46 pb-8"
          >
            <div className="px-8 py-8">
              <h1 className="text-3xl md:text-4xl" data-testid="exercise-title">{t(exercise.name)}</h1>
              <h2 className="text-2xl md:text-3xl mt-2" data-testid="exercise-subtitle">
                {t("breath-exercise-label")}
              </h2>
              <p className="text-[#ffffff] text-lg md:text-xl mt-28" data-testid="exercise-intro-text">
                {t(`instructions.${exerciseType}.instructions-text`)}
              </p>
            </div>
          </motion.div>
        ) : (
          <div key="exercise" className="flex flex-col items-center justify-center flex-grow w-full px-4">
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
                  {t(`instructions.${exerciseType}.${exercise.instructions[currentInstruction].key}`)}
                </motion.p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function presetToBucket(mins: number): "1" | "3" | "5" | "6-10" | ">10" {
  if (mins <= 1)  return "1";
  if (mins <= 3)  return "3";
  if (mins <= 5)  return "5";
  if (mins <= 10) return "6-10";
  return ">10";
}

function bucketElapsed(s: number): "<=60s" | "61-180" | "181-600" | ">600" {
  if (s <= 60)  return "<=60s";
  if (s <= 180) return "61-180";
  if (s <= 600) return "181-600";
  return ">600";
}
