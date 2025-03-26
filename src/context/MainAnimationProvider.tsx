import { useState } from "react";
import { MainAnimationContext } from "../context/MainAnimationContext";

export const MainAnimationProvider = ({ children }: { children: React.ReactNode }) => {
  const [scale, setScale] = useState<number[]>([1, 1.2, 1]);
  const [times, setTimes] = useState<number[]>([0, 0.3, 1]);
  const [duration, setDuration] = useState<number>(8);
  const [ease, setEase] = useState<string>("easeInOut");
  const [repeat, setRepeat] = useState<number>(Infinity);

  return (
    <MainAnimationContext.Provider value={{ scale, times, duration, ease, repeat, setScale, setTimes, setDuration, setEase, setRepeat }}>
      {children}
    </MainAnimationContext.Provider>
  );
};

