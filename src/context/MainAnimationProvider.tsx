import { useState, useCallback } from "react";
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

  const pause = () => {
    setIsPaused(true);
  };

  const resume = () => {
    setIsPaused(false);
  };

  return (
    <MainAnimationContext.Provider value={{ 
      changeAnimation, 
      pause, 
      resume,
      isPaused,
    }}>
      <MainAnimation animationType={currentAnimation} isPaused={isPaused} />
      {children}
    </MainAnimationContext.Provider>
  );
};
