import { useState, useCallback, useMemo } from "react";
import {
  animationType,
  MainAnimationContext,
} from "../context/MainAnimationContext";
import { MainAnimation } from "../components/MainAnimation";

export { MainAnimationContext };
import {
  createAnimation,
  handlePosition,
  handleWidgetPosition,
  MainAnimationObject,
} from "./animationObjects";
import { getBrowserName } from "../utils/browserDetector";
import { detectWidgetMode } from "../utils/widgetEnvironment";

export const MainAnimationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [animation, setAnimation] = useState<MainAnimationObject>(() => {
    return createAnimation();
  });
  const browser = getBrowserName();
  const [isPaused, setIsPaused] = useState(false);
  
  // Helper function to get the appropriate positioning function
  const getPositionFunction = useCallback((x: number, y: number) => {
    const isWidget = detectWidgetMode();
    return isWidget ? handleWidgetPosition(x, y) : handlePosition(x, y);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const changeAnimation = useCallback((type: animationType) => {
    switch (type) {
      case "main":
        setAnimation({
          firstCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position:
              browser === "Safari"
                ? getPositionFunction(-1, -1)
                : getPositionFunction(-1, -0.5),
            duration: 8,
          },
          secondCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position:
              browser === "Safari"
                ? getPositionFunction(-1, -1)
                : getPositionFunction(-1, -0.5),
            duration: 8,
          },
          thirdCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position:
              browser === "Safari"
                ? getPositionFunction(-1, -1)
                : getPositionFunction(-1, -0.5),
            duration: 8,
          },
          fourthCircle: {
            scale: [1, 1.2, 1],
            times: [0, 0.3, 1],
            repeat: Infinity,
            position:
              browser === "Safari"
                ? getPositionFunction(-1, -1)
                : getPositionFunction(-1, -0.5),
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
                ? getPositionFunction(0, -1)
                : getPositionFunction(0, -0.5),
            duration: 8,
          },
          secondCircle: {
            scale: [1, 1.2, 1.2, 1],
            times: [0, 0.3, 0.6, 1],
            repeat: Infinity,
            position:
              browser === "Safari"
                ? getPositionFunction(0, -1)
                : getPositionFunction(0, -0.5),
            duration: 8,
          },
          thirdCircle: {
            scale: [1, 1.2, 1.2, 1],
            times: [0, 0.3, 0.6, 1],
            repeat: Infinity,
            position:
              browser === "Safari"
                ? getPositionFunction(0, -1)
                : getPositionFunction(0, -0.5),
            duration: 8,
          },
          fourthCircle: {
            scale: [1, 1.2, 1.2, 1],
            times: [0, 0.3, 0.6, 1],
            repeat: Infinity,
            position:
              browser === "Safari"
                ? getPositionFunction(0, -1)
                : getPositionFunction(0, -0.5),
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
                ? getPositionFunction(0, -1)
                : getPositionFunction(0, -0.5),
            duration: 19,
          },
          secondCircle: {
            scale: [1, 1.2, 1.2, 1],
            times: [0, 0.21, 0.58, 1],
            repeat: Infinity,
            position:
              browser === "Safari"
                ? getPositionFunction(0, -1)
                : getPositionFunction(0, -0.5),
            duration: 19,
          },
          thirdCircle: {
            scale: [1, 1.2, 1.2, 1],
            times: [0, 0.21, 0.58, 1],
            repeat: Infinity,
            position:
              browser === "Safari"
                ? getPositionFunction(1, -1)
                : getPositionFunction(1, -0.5),
            duration: 19,
          },
          fourthCircle: {
            scale: [1, 1.2, 1.2, 1],
            times: [0, 0.21, 0.58, 1],
            repeat: Infinity,
            position:
              browser === "Safari"
                ? getPositionFunction(-1, -1)
                : getPositionFunction(-1, -0.5),
            duration: 19,
          },
        });
        break;
    }
  }, [browser]);

  const resetAnimation = useCallback(() => {
    changeAnimation("main");
    setIsPaused(false);
  }, [changeAnimation]);

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
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <MainAnimation animation={animation} isPaused={isPaused} />
        {children}
      </div>
    </MainAnimationContext.Provider>
  );
};
