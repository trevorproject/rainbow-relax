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

  let viewportWidth = typeof window !== "undefined" ? window.innerWidth : 0;
  let viewportHeight = typeof window !== "undefined" ? window.innerHeight : 0;

  function getYMultiplier(userAgent: string): number {
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      const hasRealTouchSupport = typeof window !== "undefined" && 'ontouchstart' in window;
      const isDesktopChrome = typeof window !== "undefined" && 
        ((window.navigator as { userAgentData?: { brands?: Array<{ brand: string }> } }).userAgentData?.brands?.some((brand: { brand: string }) => brand.brand === 'Google Chrome') ||
         (window as { chrome?: unknown }).chrome !== undefined);
      
      const isSimulation = hasRealTouchSupport && isDesktopChrome;
      
      if (isSimulation) {
        return 0.5;
      } else {
        return 1.0;
      }
    }

    if (/Macintosh.*Safari/.test(userAgent) && typeof window !== "undefined" && 'ontouchstart' in window) {
      return 0.5
    }

    if (/BlackBerry|BB10|PlayBook|Kindle|KFAPWI|Nokia.*N9/.test(userAgent)) {
      return 0.5
    }

    if (/GT-I9300|GT-N7100|SM-N900T/.test(userAgent)) {
      return 0.5
    }

    return 1.0
  }

  const yMultiplier = typeof window !== "undefined" ? getYMultiplier(navigator.userAgent) : 0.5

  if (typeof window !== "undefined" && window.innerWidth <= 1024) {
    if (window.visualViewport) {
      viewportWidth = window.visualViewport.width
      viewportHeight = window.visualViewport.height
    }
    if (viewportHeight < 500) {
      viewportHeight = Math.max(window.innerHeight, window.screen.availHeight * 0.5)
    }
  }
  const left = posX < 0 ? `${Math.abs(posX) * viewportWidth * -1}px` : "0";
  const right = posX > 0 ? `${Math.abs(posX) * viewportWidth * -1}px` : "0";

  const top = posY < 0 ? `${Math.abs(posY) * viewportHeight * yMultiplier}px` : "0";
  const bottom = posY > 0 ? `${Math.abs(posY) * viewportHeight * yMultiplier}px` : "0";

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
