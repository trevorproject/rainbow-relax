import { createContext } from "react";

export type MainAnimationContextType = {
  changeAnimation: (animationType: animationType) => void;
  pause: () => void;
  resume: () => void;
  isPaused: boolean;
  cyclePosition?: number;
  setCyclePosition?: (position: number | undefined) => void;
};

export type animationType = string;

export const MainAnimationContext = createContext<MainAnimationContextType>({
  changeAnimation: () => {},
   pause: () => {},
   resume: () => {},
   isPaused: false,
   cyclePosition: undefined,
   setCyclePosition: () => {},
});
