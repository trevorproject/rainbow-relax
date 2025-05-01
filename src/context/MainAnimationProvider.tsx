import { useState } from "react";
import {
  animationType,
  MainAnimationContext,
} from "../context/MainAnimationContext";
import { MainAnimation } from "../components/MainAnimation";
import {
  createAnimation,
  handlePosition,
  MainAnimationObject,
} from "./animationObjects";

export const MainAnimationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [animation, setAnimation] = useState<MainAnimationObject>(
    createAnimation()
  );

  const changeAnimation = (animationType: animationType) => {
    switch (animationType) {
      case "main":
        setAnimation({
          firstCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position: handlePosition(-1, -0.5),
            duration: 8,
          },
          secondCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position: handlePosition(-1, -0.5),
            duration: 8,
          },
          thirdCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position: handlePosition(-1, -0.5),
            duration: 8,
          },
          fourthCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position: handlePosition(-1, -0.5),
            duration: 8,
          },
        });
        break;
      case "wait":
        setAnimation({
          firstCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position: handlePosition(0, -0.5),
            duration: 8,
          },
          secondCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position: handlePosition(0, -0.5),
            duration: 8,
          },
          thirdCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position: handlePosition(0, -0.5),
            duration: 8,
          },
          fourthCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position: handlePosition(0, -0.5),
            duration: 8,
          },
        });
        break;
      case "4-7-8":
        setAnimation({
          firstCircle: {
            scale: [2.7, 1.9, 2.7],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position: handlePosition(0, -0.5),
            duration: 8,
          },
          secondCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position: handlePosition(0, -0.5),
            duration: 8,
          },
          thirdCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position: handlePosition(1, -0.5),
            duration: 8,
          },
          fourthCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position: handlePosition(-1, -0.5),
            duration: 8,
          },
        });
        break;
    }
  };
  return (
    <MainAnimationContext.Provider
      value={{
        animation,
        changeAnimation,
      }}
    >
      <MainAnimation animation={animation} />
      {children}
    </MainAnimationContext.Provider>
  );
};
