import { lazy, ComponentType } from "react";

export interface ExerciseAnimationProps {
  isPaused?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnimationComponent = ComponentType<any>;

export interface BreathingInstruction {
  key: string;
  duration: number;
}

export interface BreathingExercise {
  id: string;
  name: string;
  instructions: BreathingInstruction[];
  cycleDuration: number;
}

export const EXERCISE_REGISTRY: Record<string, BreathingExercise> = {
  "4-7-8": {
    id: "4-7-8",
    name: "4-7-8",
    instructions: [
      { key: "breath-instructions", duration: 4 },
      { key: "hold-instructions", duration: 7 },
      { key: "exhale-instructions", duration: 8 },
    ],
    cycleDuration: 19,
  },
  "box-breathing": {
    id: "box-breathing",
    name: "Box Breathing",
    instructions: [
      { key: "inhale", duration: 4 },
      { key: "hold", duration: 4 },
      { key: "exhale", duration: 4 },
      { key: "hold-after-exhale", duration: 4 },
    ],
    cycleDuration: 16,
  },
  "equal-breathing": {
    id: "equal-breathing",
    name: "Equal Breathing",
    instructions: [
      { key: "inhale", duration: 4 },
      { key: "hold", duration: 4 },
      { key: "exhale", duration: 4 },
    ],
    cycleDuration: 12,
  },
};

const ExerciseAnimationRegistry: Record<
  string,
  AnimationComponent
> = {
  "4-7-8": lazy(() => import("../components/Animation/4-7-8Animation")),
  "box-breathing": lazy(() => import("../components/Animation/4-7-8Animation")),
  "equal-breathing": lazy(() => import("../components/Animation/4-7-8Animation")),
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
