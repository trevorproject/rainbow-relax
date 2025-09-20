import { getBrowserName } from "../utils/browserDetector";

interface PositionProps {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  transform?: string;
}

export interface CircleProps {
  scale: number[];
  times: number[];
  repeat: number;
  position: PositionProps;
  duration: number;
}

export interface MainAnimationObject {
  firstCircle: CircleProps;
  secondCircle: CircleProps;
  thirdCircle: CircleProps;
  fourthCircle: CircleProps;
}

export const handlePosition = (_x: number, _y: number): PositionProps => {
  // SHARED LAYOUT: Both main app and widget use identical positioning logic
  // This ensures visual consistency matching the production reference
  // Simplified positioning to center circles properly
  
  // Always return centered position for consistent behavior
  return {
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  };
};

const browser = getBrowserName();

export function createAnimation(): MainAnimationObject {
  return {
    firstCircle: {
      scale: [1, 1.2, 1],
      times: [0, 0.3, 1],
      repeat: Infinity,
      duration: 8,
      position:
        browser === "Safari"
          ? handlePosition(-1, -1)
          : handlePosition(-1, -0.5),
    },
    secondCircle: {
      scale: [1, 1.2, 1],
      times: [0, 0.3, 1],
      repeat: Infinity,
      duration: 8,
      position:
        browser === "Safari"
          ? handlePosition(-1, -1)
          : handlePosition(-1, -0.5),
    },
    thirdCircle: {
      scale: [1, 1.2, 1],
      times: [0, 0.3, 1],
      repeat: Infinity,
      duration: 8,
      position:
        browser === "Safari"
          ? handlePosition(-1, -1)
          : handlePosition(-1, -0.5),
    },
    fourthCircle: {
      scale: [1, 1.2, 1],
      times: [0, 0.3, 1],
      repeat: Infinity,
      duration: 8,
      position:
        browser === "Safari"
          ? handlePosition(-1, -1)
          : handlePosition(-1, -0.5),
    },
  };
}
