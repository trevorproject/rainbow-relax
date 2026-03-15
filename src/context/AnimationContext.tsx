import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { AnimationRenderer } from "../components/animations/AnimationRenderer";
import { useConsent } from "../hooks/useConsent";
import type { AnimationType } from "../types";

interface AnimationContextType {
  changeAnimation: (type: AnimationType) => void;
  pause: () => void;
  resume: () => void;
  isPaused: boolean;
}

const AnimationContext = createContext<AnimationContextType>({
  changeAnimation: () => {},
  pause: () => {},
  resume: () => {},
  isPaused: false,
});

// eslint-disable-next-line react-refresh/only-export-components
export const useAnimation = () => useContext(AnimationContext);

function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

export const AnimationProvider = ({ children }: { children: React.ReactNode }) => {
  const { hasConsented } = useConsent();
  const [currentAnimation, setCurrentAnimation] = useState<AnimationType>("main");
  const [isPaused, setIsPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  const changeAnimation = useCallback((type: AnimationType) => setCurrentAnimation(type), []);
  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);

  const contextValue = useMemo(
    () => ({ changeAnimation, pause, resume, isPaused }),
    [changeAnimation, pause, resume, isPaused]
  );

  return (
    <AnimationContext.Provider value={contextValue}>
      {hasConsented && !reducedMotion && (
        <AnimationRenderer animationType={currentAnimation} isPaused={isPaused} />
      )}
      {children}
    </AnimationContext.Provider>
  );
};

export { AnimationContext };
