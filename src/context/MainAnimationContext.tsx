import { createContext } from "react";

export type MainAnimationContextType = {
  changeAnimation: (animationType: animationType) => void;
  pause: () => void;
  resume: () => void;
  isPaused: boolean
};

export type animationType = "main" | "wait" | "Exercise478";

export const MainAnimationContext = createContext<MainAnimationContextType>({
  changeAnimation: () => {},
   pause: () => {},
   resume: () => {},
   isPaused: false

});
