import { useState, useEffect, useRef, useCallback } from "react";

interface UseBreathingTimerOptions {
  cycleDuration: number;
  enabled?: boolean;
}

let prefersReducedMotion =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (typeof window !== "undefined") {
  window.matchMedia("(prefers-reduced-motion: reduce)")
    .addEventListener("change", (e) => { prefersReducedMotion = e.matches; });
}

interface UseBreathingTimerReturn {
  cyclePosition: number;
  isPaused: boolean;
  pause: () => void;
  resume: () => void;
  reset: () => void;
}

/**
 * Tracks cycle position with high precision using requestAnimationFrame.
 * Maintains accurate timing through pause/resume cycles.
 */
export const useBreathingTimer = ({
  cycleDuration,
  enabled = true,
}: UseBreathingTimerOptions): UseBreathingTimerReturn => {
  const [cyclePosition, setCyclePosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef(0);
  const pausePositionRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);

  const updateCyclePosition = useCallback(() => {
    if (!enabled || isPaused || startTimeRef.current === null) return;
    const now = performance.now();
    const elapsed = (now - startTimeRef.current) / 1000;
    const totalElapsed = accumulatedTimeRef.current + elapsed;
    setCyclePosition(totalElapsed % cycleDuration);
    // Only continue the rAF loop when animations are actually visible.
    if (!prefersReducedMotion) {
      animationFrameRef.current = requestAnimationFrame(updateCyclePosition);
    }
  }, [enabled, isPaused, cycleDuration]);

  const startTimeline = useCallback(() => {
    if (startTimeRef.current === null) {
      startTimeRef.current = performance.now() - pausePositionRef.current * 1000;
    }
    if (animationFrameRef.current === null) {
      animationFrameRef.current = requestAnimationFrame(updateCyclePosition);
    }
  }, [updateCyclePosition]);

  const stopTimeline = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  const pause = useCallback(() => {
    if (isPaused) return;
    setIsPaused(true);
    if (startTimeRef.current !== null) {
      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      const totalElapsed = accumulatedTimeRef.current + elapsed;
      pausePositionRef.current = totalElapsed % cycleDuration;
      accumulatedTimeRef.current = totalElapsed;
    } else {
      pausePositionRef.current = cyclePosition;
    }
    startTimeRef.current = null;
    stopTimeline();
  }, [isPaused, cyclePosition, cycleDuration, stopTimeline]);

  const resume = useCallback(() => {
    if (!isPaused) return;
    setIsPaused(false);
    startTimeline();
  }, [isPaused, startTimeline]);

  const reset = useCallback(() => {
    setIsPaused(false);
    accumulatedTimeRef.current = 0;
    pausePositionRef.current = 0;
    setCyclePosition(0);
    startTimeRef.current = null;
    stopTimeline();
  }, [stopTimeline]);

  useEffect(() => {
    if (enabled && !isPaused) {
      if (startTimeRef.current === null) {
        startTimeRef.current = performance.now();
        accumulatedTimeRef.current = 0;
        pausePositionRef.current = 0;
        setCyclePosition(0);
      }
      startTimeline();
    } else {
      stopTimeline();
      if (!enabled) {
        startTimeRef.current = null;
        accumulatedTimeRef.current = 0;
        pausePositionRef.current = 0;
        setCyclePosition(0);
      }
    }
    return () => stopTimeline();
  }, [enabled, isPaused, startTimeline, stopTimeline]);

  return { cyclePosition, isPaused, pause, resume, reset };
};
