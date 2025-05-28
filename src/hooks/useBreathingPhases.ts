import { useState, useRef, useEffect } from 'react';

interface PhaseInfo {
  phase: string;
  phaseProgress: number;
  phaseDuration: number;
  timeRemaining: number;
}

interface BreathingPhasesConfig {
  inhaleTime: number;
  holdTime: number;
  exhaleTime: number;
  isPaused: boolean;
}

/**
 * Custom hook to manage breathing phases and timing for breathing exercises
 */
export const useBreathingPhases = ({
  inhaleTime,
  holdTime,
  exhaleTime,
  isPaused
}: BreathingPhasesConfig) => {
  const totalCycleTime = inhaleTime + holdTime + exhaleTime;
  const [cycleProgress, setCycleProgress] = useState(0);
  
  // Refs for tracking progress and timing
  const timerRef = useRef<number | null>(null);
  const accumulatedProgressRef = useRef(0);
  const startTimestampRef = useRef<number | null>(null);
  const lastPhaseRef = useRef<string>("inhale");
  const wasJustPausedRef = useRef<boolean>(false);

  // Helper to get phase information based on current progress
  const getPhaseInfo = (progress: number): PhaseInfo => {
    if (progress < inhaleTime) {
      return { 
        phase: "inhale", 
        phaseProgress: progress, 
        phaseDuration: inhaleTime,
        timeRemaining: inhaleTime - progress 
      };
    } else if (progress < inhaleTime + holdTime) {
      return { 
        phase: "hold", 
        phaseProgress: progress - inhaleTime, 
        phaseDuration: holdTime,
        timeRemaining: (inhaleTime + holdTime) - progress 
      };
    } else {
      return { 
        phase: "exhale", 
        phaseProgress: progress - inhaleTime - holdTime, 
        phaseDuration: exhaleTime,
        timeRemaining: totalCycleTime - progress 
      };
    }
  };

  // Function to update cycle progress
  const updateCycleProgress = () => {
    if (startTimestampRef.current === null) return;
    
    const now = Date.now();
    const elapsed = (now - startTimestampRef.current) / 1000;
    const newProgress = (accumulatedProgressRef.current + elapsed) % totalCycleTime;
    setCycleProgress(newProgress);
  };

  // Calculate the current scale based on cycle progress
  // Calculate the current scale based on cycle progress
const getCurrentScale = (progress: number, scales: number[], times: number[]): number => {
  // Normalizar el progreso al rango [0, 1] basado en el tiempo total del ciclo
  const normalizedProgress = progress / totalCycleTime;
  
  // Encontrar el índice del segmento de tiempo actual
  const index = times.findIndex((time, i) => {
    const nextTime = times[i + 1] || 1;
    return normalizedProgress >= time && normalizedProgress < nextTime;
  });
  if (index === -1) {
    return scales[scales.length - 1] || 1;
  }
  if (index === times.length - 1) {
    return scales[index] || 1;
  }
  const currentTime = times[index];
  const nextTime = times[index + 1];
  const segmentProgress = (normalizedProgress - currentTime) / (nextTime - currentTime);

  const currentScale = scales[index] || 1;
  const nextScale = scales[index + 1] || 1;
  
  return currentScale + (nextScale - currentScale) * segmentProgress;
};

  // Handle starting/pausing timer
  useEffect(() => {
    // When pausing, calculate and store accumulated progress
    if (isPaused) {
      wasJustPausedRef.current = true;
      
      if (startTimestampRef.current !== null) {
        const now = Date.now();
        const elapsed = (now - startTimestampRef.current) / 1000;
        accumulatedProgressRef.current = (accumulatedProgressRef.current + elapsed) % totalCycleTime;
        startTimestampRef.current = null;
      }
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // If we were paused and now resuming
    wasJustPausedRef.current = false;

    // When resuming or starting, set a new timestamp
    startTimestampRef.current = Date.now();
    
    // Run update at ~60fps for smoothness
    timerRef.current = window.setInterval(updateCycleProgress, 16);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // On unmount, save progress
      if (startTimestampRef.current !== null) {
        const now = Date.now();
        const elapsed = (now - startTimestampRef.current) / 1000;
        accumulatedProgressRef.current = (accumulatedProgressRef.current + elapsed) % totalCycleTime;
        startTimestampRef.current = null;
      }
    };
  }, [isPaused, totalCycleTime]);

  // Reset progress when config changes
  useEffect(() => {
    accumulatedProgressRef.current = 0;
    setCycleProgress(0);
    lastPhaseRef.current = "inhale";
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [inhaleTime, holdTime, exhaleTime]);

  return {
    cycleProgress,
    getPhaseInfo,
    getCurrentScale,
    wasJustPaused: wasJustPausedRef.current,
    accumulatedProgress: accumulatedProgressRef.current
  };
};
