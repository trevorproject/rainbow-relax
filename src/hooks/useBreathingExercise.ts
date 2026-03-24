import { useState, useEffect, useRef, useContext, useCallback } from "react";
import { getExercise, type BreathingExercise } from "../config/exercises";
import { AnimationContext } from "../context/AnimationContext";
import { track, EVENTS } from "../utils/analytics";

interface UseBreathingExerciseProps {
  exerciseType: string;
  minutes: number;
}

interface UseBreathingExerciseReturn {
  exercise: BreathingExercise;
  showIntro: boolean;
  timeLeft: number;
  currentTime: number;
  currentInstruction: number;
  formatTime: (seconds: number) => string;
  resetExercise: () => void;
}

function getMinutesBucket(seconds: number): string {
  const minutes = seconds / 60;
  if (minutes <= 1)  return "1";
  if (minutes <= 3)  return "3";
  if (minutes <= 5)  return "5";
  if (minutes <= 10) return "6-10";
  return "over_10";
}

function getInstructionFromTime(current: number, exercise: BreathingExercise, cycleDuration: number): number {
  const cycleTime = current % cycleDuration;
  let accumulated = 0;
  for (let i = 0; i < exercise.instructions.length; i++) {
    accumulated += exercise.instructions[i].duration;
    if (cycleTime < accumulated) return i;
  }
  return 0;
}

export function useBreathingExercise({
  exerciseType,
  minutes,
}: UseBreathingExerciseProps): UseBreathingExerciseReturn {
  const { isPaused } = useContext(AnimationContext);

  const exercise = getExercise(exerciseType);
  const CYCLE_DURATION = exercise.cycleDuration;
  const time = minutes * 60;

  const [showIntro, setShowIntro] = useState(true);
  const [timeLeft, setTimeLeft] = useState(time);
  const [currentTime, setCurrentTime] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimestampRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef(0);
  const lastUpdateRef = useRef(0);
  const completedTrackedRef = useRef(false);

  useEffect(() => { completedTrackedRef.current = false; }, [time, exerciseType]);

  useEffect(() => {
    setShowIntro(true);
    setTimeLeft(time);
    setCurrentTime(0);
    accumulatedTimeRef.current = 0;
    lastUpdateRef.current = 0;
    startTimestampRef.current = null;
    completedTrackedRef.current = false;
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    return () => {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    };
  }, [time]);

  const currentInstruction = getInstructionFromTime(currentTime, exercise, CYCLE_DURATION);

  const resetExercise = useCallback(() => {
    setTimeLeft(time);
    setCurrentTime(0);
    setShowIntro(true);
    accumulatedTimeRef.current = 0;
    lastUpdateRef.current = 0;
    startTimestampRef.current = null;
    completedTrackedRef.current = false;
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, [time]);

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 13500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showIntro || isPaused) {
      if (isPaused && startTimestampRef.current !== null) {
        const elapsed = (Date.now() - startTimestampRef.current) / 1000;
        accumulatedTimeRef.current += elapsed;
        startTimestampRef.current = null;
        if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      }
      return;
    }

    startTimestampRef.current = Date.now();
    lastUpdateRef.current = 0;

    const interval = setInterval(() => {
      if (startTimestampRef.current === null) return;
      const totalElapsed = accumulatedTimeRef.current + (Date.now() - startTimestampRef.current) / 1000;
      const elapsed = Math.floor(totalElapsed);

      // Only update state when the integer second changes — avoids 60 re-renders per second.
      if (elapsed !== lastUpdateRef.current) {
        setCurrentTime(elapsed);
      }

      if (elapsed > lastUpdateRef.current) {
        lastUpdateRef.current = elapsed;
        const newTimeLeft = time - elapsed;

        if (newTimeLeft <= 0) {
          clearInterval(interval);
          timerRef.current = null;
          setTimeLeft(0);
          if (!completedTrackedRef.current) {
            completedTrackedRef.current = true;
            track(EVENTS.BREATHING_COMPLETED, {
              pattern: exerciseType,
              minutes_bucket: getMinutesBucket(totalElapsed),
            });
          }
        } else {
          setTimeLeft(newTimeLeft);
        }
      }
    }, 200);

    timerRef.current = interval;

    return () => {
      if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
      if (startTimestampRef.current !== null) {
        accumulatedTimeRef.current += (Date.now() - startTimestampRef.current) / 1000;
        startTimestampRef.current = null;
      }
    };
  }, [showIntro, isPaused, time, exerciseType]);

  const formatTime = useCallback((seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }, []);

  return { exercise, showIntro, timeLeft, currentTime, currentInstruction, formatTime, resetExercise };
}
