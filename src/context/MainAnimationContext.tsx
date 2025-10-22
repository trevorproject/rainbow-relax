import { createContext } from "react";
import { MainAnimationObject } from "../context/animationObjects";
import { BreathingExerciseFactory } from "../utils/breathingExerciseFactory";
import { useBreathingPhases } from "../hooks/useBreathingPhases";

export type MainAnimationContextType = {
  changeAnimation: (animationType: animationType) => void;
  pause: () => void;
  resume: () => void;
  isPaused: boolean
};

export type animationType = "main" | "wait" | "4-7-8";

export const MainAnimationContext = createContext<MainAnimationContextType>({
  changeAnimation: () => {},
   pause: () => {},
   resume: () => {},
   isPaused: false

});
