import { createContext } from "react";
import { createAnimation, MainAnimationObject } from "./animationObjects";

export interface MainAnimationContextType {
  animation: MainAnimationObject;
  changeAnimation: (animationType: animationType) => void;
}

export type animationType = "main" | "wait" | "4-7-8";

export const MainAnimationContext = createContext<MainAnimationContextType>({
  animation: createAnimation("left-side"),
  changeAnimation: () => {},
});
