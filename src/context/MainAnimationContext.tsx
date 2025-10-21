import { createContext } from "react";

export type MainAnimationContextType = {
  changeAnimation: (animationType: animationType) => void;
  pause: () => void;
  resume: () => void;
};

export type animationType = "main" | "wait" | "4-7-8";

export const MainAnimationContext = createContext<MainAnimationContextType>({
  changeAnimation: () => {},
   pause: () => {},
   resume: () => {},

});
