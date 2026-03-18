import { Suspense } from "react";
import { getAnimationComponent } from "../../config/exercises";
import type { AnimationType } from "../../types";

interface AnimationRendererProps {
  animationType: AnimationType;
  isPaused: boolean;
}

export const AnimationRenderer = ({ isPaused, animationType }: AnimationRendererProps) => {
  const AnimationComponent = getAnimationComponent(animationType);

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
