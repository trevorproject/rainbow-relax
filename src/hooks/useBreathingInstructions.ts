import { useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  BreathingExerciseFactory,
  type BreathingExercise,
} from "../utils/breathingExerciseFactory";
import { MainAnimationContext } from "../context/MainAnimationContext";

interface UseBreathingExerciseProps {
  exerciseType: string;
  minutes: number;
}

interface UseBreathingExerciseReturn {
  exercise: BreathingExercise;
  showIntro: boolean;
  timeLeft: number;
  currentTime: number;
  isPaused: boolean;
  currentInstruction: number;
  formatTime: (seconds: number) => string;
  resetExercise: () => void;
}

export function useBreathingExercise({
  exerciseType,
  minutes,
}: UseBreathingExerciseProps): UseBreathingExerciseReturn {
  const type = exerciseType;
  const minutesCount = minutes;

  const { isPaused } = useContext(MainAnimationContext);

  const exercise = BreathingExerciseFactory.getExercise(type);
  const CYCLE_DURATION = exercise.cycleDuration;

  const time = minutesCount * 60;
  const [showIntro, setShowIntro] = useState(true);
  const [timeLeft, setTimeLeft] = useState(time);
  const [currentTime, setCurrentTime] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimestampRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef(0);
  const lastUpdateRef = useRef(0);

  useEffect(() => {
    setShowIntro(true);
    setTimeLeft(time);
    setCurrentTime(0);

    accumulatedTimeRef.current = 0;
    lastUpdateRef.current = 0;
    startTimestampRef.current = null;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [time]);

  const getInstructionFromTime = (current: number) => {
    const cycleTime = current % CYCLE_DURATION;
    let accumulatedTime = 0;
    for (let i = 0; i < exercise.instructions.length; i++) {
      accumulatedTime += exercise.instructions[i].duration;
      if (cycleTime < accumulatedTime) {
        return i;
      }
    }
    return 0;
  };

  const currentInstruction = getInstructionFromTime(currentTime);

  // CORRECCIÓN: Envuelto en useCallback para estabilizar la referencia
  // y permitir su uso en arrays de dependencia de otros componentes.
  const resetExercise = useCallback(() => {
    setTimeLeft(time);
    setCurrentTime(0);
    setShowIntro(true);
    accumulatedTimeRef.current = 0;
    lastUpdateRef.current = 0;
    startTimestampRef.current = null;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [time]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 13500);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    // CORRECCIÓN: Se eliminó "timeLeft <= 0" de esta condición.
    // El setInterval interno maneja la detención cuando el tiempo llega a 0.
    // Esto evita tener que añadir timeLeft a las dependencias (lo cual reiniciaría el timer cada segundo).
    if (showIntro || isPaused) {
      if (isPaused && startTimestampRef.current !== null) {
        const now = Date.now();
        const elapsed = (now - startTimestampRef.current) / 1000;
        accumulatedTimeRef.current += elapsed;
        startTimestampRef.current = null;

        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
      return;
    }

    startTimestampRef.current = Date.now();
    lastUpdateRef.current = 0;

    const interval = setInterval(() => {
      if (startTimestampRef.current === null) return;

      const now = Date.now();
      const totalElapsed =
        accumulatedTimeRef.current + (now - startTimestampRef.current) / 1000;

      setCurrentTime(Math.floor(totalElapsed));

      if (Math.floor(totalElapsed) > lastUpdateRef.current) {
        lastUpdateRef.current = Math.floor(totalElapsed);
        setTimeLeft(() => {
          const newTimeLeft = time - Math.floor(totalElapsed);
          if (newTimeLeft <= 0) {
            clearInterval(interval);
            return 0;
          }
          return newTimeLeft;
        });
      }
    }, 16);

    timerRef.current = interval;

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (startTimestampRef.current !== null) {
        const now = Date.now();
        const elapsed = (now - startTimestampRef.current) / 1000;
        accumulatedTimeRef.current += elapsed;
        startTimestampRef.current = null;
      }
    };
  }, [showIntro, isPaused, time]);

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }, []);

  return {
    exercise,
    showIntro,
    timeLeft,
    currentTime,
    isPaused,
    currentInstruction,
    formatTime,
    resetExercise,
  };
}