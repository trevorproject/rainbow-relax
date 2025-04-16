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
}

export interface MainAnimationObject {
  firstCircle: CircleProps;
  secondCircle: CircleProps;
  thirdCircle: CircleProps;
  fourthCircle: CircleProps;
}

type PositionTypes = "center" | "right-side" | "left-side";

export const handlePosition = (positionType: PositionTypes) => {
  switch (positionType) {
    case "center":
      return {
        top: "50vh",
        left: "0",
        right: "0",
        bottom: "0",
      };

    case "right-side":
      return {
        top: "50vh",
        left: "0",
        right: "-100vw",
        bottom: "0",
      };

    case "left-side":
      return {
        top: "50vh",
        left: "-100vw",
        right: "0",
        bottom: "0",
      };
  }
};
