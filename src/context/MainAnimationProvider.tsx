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
import { getBrowserName } from "../utils/browserDetector";

export const MainAnimationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [animation, setAnimation] = useState<MainAnimationObject>(
    createAnimation()
  );
  const browser = getBrowserName();
  const [isPaused, setIsPaused] = useState(false);

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const resetAnimation = () => {
    changeAnimation("main");
    setIsPaused(false);
  };

  const changeAnimation = (animationType: animationType) => {
    switch (animationType) {
      case "main":
        setAnimation({
          firstCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position:
              browser === "Safari"
                ? handlePosition(-1, -1)
                : handlePosition(-1, -0.5),
            duration: 8,
          },
          secondCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position:
              browser === "Safari"
                ? handlePosition(-1, -1)
                : handlePosition(-1, -0.5),
            duration: 8,
          },
          thirdCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position:
              browser === "Safari"
                ? handlePosition(-1, -1)
                : handlePosition(-1, -0.5),
            duration: 8,
          },
          fourthCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position:
              browser === "Safari"
                ? handlePosition(-1, -1)
                : handlePosition(-1, -0.5),
            duration: 8,
          },
        });
        break;
      case "wait":
        setAnimation({
          firstCircle: {
            scale: [1, 1.2, 1.2, 1],
            times: [0, 0.3, 0.6, 1],
            repeat: Infinity,
            position:
              browser === "Safari"
                ? handlePosition(0, -1)
                : handlePosition(0, -0.5),
            duration: 8,
          },
          secondCircle: {
            scale: [1, 1.2, 1.2, 1],
            times: [0, 0.3, 0.6, 1],
            repeat: Infinity,
            position:
              browser === "Safari"
                ? handlePosition(0, -1)
                : handlePosition(0, -0.5),
            duration: 8,
          },
          thirdCircle: {
            scale: [1, 1.2, 1.2, 1],
            times: [0, 0.3, 0.6, 1],
            repeat: Infinity,
            position:
              browser === "Safari"
                ? handlePosition(0, -1)
                : handlePosition(0, -0.5),
            duration: 8,
          },
          fourthCircle: {
            scale: [1, 1.2, 1.2, 1],
            times: [0, 0.3, 0.6, 1],
            repeat: Infinity,
            position:
              browser === "Safari"
                ? handlePosition(0, -1)
                : handlePosition(0, -0.5),
            duration: 8,
          },
        });
        break;
      case "4-7-8":
        setAnimation({
          firstCircle: {
            scale: [1, 1.2, 1.2, 1],
            times: [0, 0.21, 0.58, 1],
            repeat: Infinity,
            position:
              browser === "Safari"
                ? handlePosition(0, -1)
                : handlePosition(0, -0.5),
            duration: 19,
          },
          secondCircle: {
            scale: [1, 1.2, 1.2, 1],
            times: [0, 0.21, 0.58, 1],
            repeat: Infinity,
            position:
              browser === "Safari"
                ? handlePosition(0, -1)
                : handlePosition(0, -0.5),
            duration: 19,
          },
          thirdCircle: {
            scale: [1, 1.2, 1.2, 1],
            times: [0, 0.21, 0.58, 1],
            repeat: Infinity,
            position:
              browser === "Safari"
                ? handlePosition(1, -1)
                : handlePosition(1, -0.5),
            duration: 19,
          },
          fourthCircle: {
            scale: [1, 1.2, 1.2, 1],
            times: [0, 0.21, 0.58, 1],
            repeat: Infinity,
            position:
              browser === "Safari"
                ? handlePosition(-1, -1)
                : handlePosition(-1, -0.5),
            duration: 19,
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
        isPaused,
        togglePause,
        resetAnimation,
      }}
    >
      <MainAnimation animation={animation} isPaused={isPaused} />
      {children}
    </MainAnimationContext.Provider>
  );
};
