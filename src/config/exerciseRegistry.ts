import { lazy, ComponentType } from "react";

export interface ExerciseAnimationProps {
  isPaused?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnimationComponent = ComponentType<any>;

const ExerciseAnimationRegistry: Record<
  string,
  AnimationComponent
> = {
  "4-7-8": lazy(() => import("../components/Animation/4-7-8Animation")),
  "main": lazy(() => import("../components/Animation/HomeAnimation")),
  "wait": lazy(() => import("../components/Animation/WaitAnimation")),
  "Exercise478": lazy(() => import("../components/Animation/4-7-8Animation")),
};

/**
 * Gets the animation component for a given exercise type.
 * Falls back to "4-7-8" if the exercise type is not found in the registry.
 *
 * @param exerciseType - The exercise type string (e.g., "4-7-8", "box-breathing", "main", "wait")
 * @returns The lazy-loaded React component, or null if no component is available
 */
export function getAnimationComponent(
  exerciseType: string
): AnimationComponent | null {
  if (ExerciseAnimationRegistry[exerciseType]) {
    return ExerciseAnimationRegistry[exerciseType];
  }

  if (ExerciseAnimationRegistry["4-7-8"]) {
    return ExerciseAnimationRegistry["4-7-8"];
  }

  return null;
}

export default ExerciseAnimationRegistry;
