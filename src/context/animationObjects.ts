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

export const handlePosition = (x: number, y: number) => {
  const clamp = (v: number) => Math.max(-1, Math.min(1, v));

  const posX = clamp(x);
  const posY = clamp(y);

  const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 0;
  const viewportHeight = typeof window !== "undefined" ? window.innerHeight : 0;

  const left = posX < 0 ? `${Math.abs(posX) * -viewportWidth}px` : "0";
  const right = posX > 0 ? `${Math.abs(posX) * -viewportWidth}px` : "0";

  const top = posY < 0 ? `${Math.abs(posY) * viewportHeight}px` : "0";
  const bottom = posY > 0 ? `${Math.abs(posY) * viewportHeight}px` : "0";

  return { top, left, right, bottom };
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
