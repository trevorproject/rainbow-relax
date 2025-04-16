import { createContext } from "react";
import { MainAnimationObject } from "./animationObjects";

export interface MainAnimationContextType {
  animation: MainAnimationObject;
  animationContext: (exerciseType: ExerciseType) => void;
}

export type ExerciseType = "main" | "wait" | "4-7-8";

export const MainAnimationContext =
  createContext<MainAnimationContextType | null>(null);
