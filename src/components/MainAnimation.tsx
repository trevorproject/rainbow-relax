import { Suspense } from "react";
import { getAnimationComponent } from "../config/exerciseRegistry";

interface MainAnimationProps {
  animationType: string;
  isPaused: boolean;
}

export const MainAnimation = ({isPaused, animationType}: MainAnimationProps) => { 
  const AnimationComponent = getAnimationComponent(animationType);

  // Exercise animations (not "main" or "wait") need isPaused
  const needsPausedProp = animationType !== "main" && animationType !== "wait";

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      {AnimationComponent && (
        <Suspense fallback={null}>
          {needsPausedProp ? (
            <AnimationComponent isPaused={isPaused} />
          ) : (
            <AnimationComponent />
          )}
        </Suspense>
      )}
    </div>
  );
};
