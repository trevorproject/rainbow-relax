import { useState, useCallback, useMemo } from "react";
import {
  animationType,
  MainAnimationContext,
} from "../context/MainAnimationContext";
import { MainAnimation } from "../components/MainAnimation";

export const MainAnimationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentAnimation, setCurrentAnimation] = useState<animationType>("main");
  const [isPaused, setIsPaused] = useState(false);

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
  }), [changeAnimation, pause, resume, isPaused]);

  return (
    <MainAnimationContext.Provider value={contextValue}>
      <MainAnimation animationType={currentAnimation} isPaused={isPaused} />
      {children}
    </MainAnimationContext.Provider>
  );
};
