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

export const useBreathingPhases = ({
  inhaleTime,
  holdTime,
  exhaleTime,
  isPaused
}: BreathingPhasesConfig) => {
  const totalCycleTime = inhaleTime + holdTime + exhaleTime;
  const [cycleProgress, setCycleProgress] = useState(0);
  

  const timerRef = useRef<number | null>(null);
  const accumulatedProgressRef = useRef(0);
  const startTimestampRef = useRef<number | null>(null);
  const lastPhaseRef = useRef<string>("inhale");
  const wasJustPausedRef = useRef<boolean>(false);


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


  const updateCycleProgress = () => {
    if (startTimestampRef.current === null) return;
    
    const now = Date.now();
    const elapsed = (now - startTimestampRef.current) / 1000;
    const newProgress = (accumulatedProgressRef.current + elapsed) % totalCycleTime;
    setCycleProgress(newProgress);
  };


  const getCurrentScale = (progress: number, scales: number[], times: number[]): number => {

  const normalizedProgress = progress / totalCycleTime;
  

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


  useEffect(() => {

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
    wasJustPausedRef.current = false;
    startTimestampRef.current = Date.now();
    
    timerRef.current = window.setInterval(updateCycleProgress, 16);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      if (startTimestampRef.current !== null) {
        const now = Date.now();
        const elapsed = (now - startTimestampRef.current) / 1000;
        accumulatedProgressRef.current = (accumulatedProgressRef.current + elapsed) % totalCycleTime;
        startTimestampRef.current = null;
      }
    };
  }, [isPaused, totalCycleTime]);

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
