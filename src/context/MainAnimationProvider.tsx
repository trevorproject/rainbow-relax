import { useState, useCallback, useMemo } from "react";
import {
  animationType,
  MainAnimationContext,
} from "../context/MainAnimationContext";
import { MainAnimation } from "../components/MainAnimation";
import { useConsent } from "../hooks/useConsent";

export const MainAnimationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { hasConsented } = useConsent();
  const [currentAnimation, setCurrentAnimation] = useState<animationType>("main");
  const [isPaused, setIsPaused] = useState(false);
  const [cyclePosition, setCyclePosition] = useState<number | undefined>(undefined);

  const changeAnimation = useCallback((animationType: animationType) => {
    setCurrentAnimation(animationType); 
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const contextValue = useMemo(() => ({
      changeAnimation, 
      pause, 
      resume,
      isPaused,
      cyclePosition,
      setCyclePosition,
  }), [changeAnimation, pause, resume, isPaused, cyclePosition]);

  return (
    <MainAnimationContext.Provider value={contextValue}>
      {hasConsented && (
        <MainAnimation animationType={currentAnimation} isPaused={isPaused} />
      )}
      {children}
    </MainAnimationContext.Provider>
  );
};
