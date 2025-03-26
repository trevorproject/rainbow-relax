import { createContext } from "react";

export interface MainAnimationContextType {
    scale: number[];
    times: number[];
    duration: number;
    ease: string;
    repeat: number;
    setScale: (scale: number[]) => void;
    setTimes: (times: number[]) => void;
    setDuration: (duration: number) => void;
    setEase: (ease: string) => void;
    setRepeat: (repeat: number) => void;
  }

export const MainAnimationContext = createContext<MainAnimationContextType | null>(null); 