import { useState } from "react";
import {
  ExerciseType,
  MainAnimationContext,
} from "../context/MainAnimationContext";
import { MainAnimation } from "../components/MainAnimation";
import { handlePosition, MainAnimationObject } from "./animationObjects";

export const MainAnimationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [animation, setAnimation] = useState<MainAnimationObject>({
    firstCircle: {
      scale: [1, 1.2, 1],
      times: [0, 0.3, 1],
      repeat: Infinity,
      position: handlePosition("left-side"),
    },
    secondCircle: {
      scale: [1, 1.2, 1],
      times: [0, 0.3, 1],
      repeat: Infinity,
      position: handlePosition("left-side"),
    },
    thirdCircle: {
      scale: [1, 1.2, 1],
      times: [0, 0.3, 1],
      repeat: Infinity,
      position: handlePosition("left-side"),
    },
    fourthCircle: {
      scale: [1, 1.2, 1],
      times: [0, 0.3, 1],
      repeat: Infinity,
      position: handlePosition("left-side"),
    },
  });

  const animationContext = (exerciseType: ExerciseType) => {
    switch (exerciseType) {
      case "main":
        setAnimation({
          firstCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position: handlePosition("left-side"),
          },
          secondCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position: handlePosition("left-side"),
          },
          thirdCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position: handlePosition("left-side"),
          },
          fourthCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position: handlePosition("left-side"),
          },
        });
        break;
      case "wait":
        setAnimation({
          firstCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position: handlePosition("center"),
          },
          secondCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position: handlePosition("center"),
          },
          thirdCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position: handlePosition("center"),
          },
          fourthCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position: handlePosition("center"),
          },
        });
        break;
      case "4-7-8":
        setAnimation({
          firstCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position: handlePosition("right-side"),
          },
          secondCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position: handlePosition("right-side"),
          },
          thirdCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position: handlePosition("right-side"),
          },
          fourthCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position: handlePosition("right-side"),
          },
        });
        break;
    }
  };
  return (
    <MainAnimationContext.Provider
      value={{
        animation,
        animationContext,
      }}
    >
      <MainAnimation animation={animation} />
      {children}
    </MainAnimationContext.Provider>
  );
};
