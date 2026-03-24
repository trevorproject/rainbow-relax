import { lazy, ComponentType } from "react";
import type { AnimationType } from "../types";

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
      { key: "hold-instructions",   duration: 7 },
      { key: "exhale-instructions", duration: 8 },
    ],
    cycleDuration: 19,
  },
  "box-breathing": {
    id: "box-breathing",
    name: "Box Breathing",
    instructions: [
      { key: "inhale",            duration: 4 },
      { key: "hold",              duration: 4 },
      { key: "exhale",            duration: 4 },
      { key: "hold-after-exhale", duration: 4 },
    ],
    cycleDuration: 16,
  },
  "equal-breathing": {
    id: "equal-breathing",
    name: "Equal Breathing",
    instructions: [
      { key: "inhale", duration: 4 },
      { key: "hold",   duration: 4 },
      { key: "exhale", duration: 4 },
    ],
    cycleDuration: 12,
  },
};

const AnimationRegistry: Record<string, AnimationComponent> = {
  "4-7-8":           lazy(() => import("../components/animations/BreathingAnimation")),
  "box-breathing":   lazy(() => import("../components/animations/BreathingAnimation")),
  "equal-breathing": lazy(() => import("../components/animations/BreathingAnimation")),
  "main":            lazy(() => import("../components/animations/HomeAnimation")),
  "wait":            lazy(() => import("../components/animations/WaitAnimation")),
};

export function getAnimationComponent(type: AnimationType): AnimationComponent | null {
  return AnimationRegistry[type] ?? AnimationRegistry["4-7-8"] ?? null;
}

function validateExercise(exercise: BreathingExercise): boolean {
  if (!exercise.id || !exercise.name || !exercise.instructions || exercise.cycleDuration === undefined) {
    console.warn("Exercise validation failed: Missing required fields", exercise);
    return false;
  }
  if (!Array.isArray(exercise.instructions) || exercise.instructions.length === 0) {
    console.warn("Exercise validation failed: Instructions array is empty", exercise);
    return false;
  }
  const hasInvalidDuration = exercise.instructions.some(
    (i) => typeof i.duration !== "number" || i.duration <= 0
  );
  if (hasInvalidDuration) {
    console.warn("Exercise validation failed: Invalid duration found", exercise);
    return false;
  }
  const sum = exercise.instructions.reduce((acc, i) => acc + i.duration, 0);
  if (Math.abs(exercise.cycleDuration - sum) > 0.01) {
    console.warn(
      `Exercise validation warning: cycleDuration (${exercise.cycleDuration}) does not match sum of phase durations (${sum})`,
      exercise
    );
  }
  return true;
}

export function getExercise(type: string): BreathingExercise {
  const exercise = EXERCISE_REGISTRY[type];

  if (!exercise) {
    console.warn(`Exercise type "${type}" not found in registry. Falling back to 4-7-8.`);
    const fallback = EXERCISE_REGISTRY["4-7-8"];
    if (!fallback) throw new Error("Default exercise 4-7-8 not found in registry.");
    return fallback;
  }

  if (!validateExercise(exercise)) {
    console.warn(`Exercise "${type}" failed validation. Falling back to 4-7-8.`);
    const fallback = EXERCISE_REGISTRY["4-7-8"];
    if (!fallback) throw new Error("Default exercise 4-7-8 not found in registry.");
    return fallback;
  }

  return exercise;
}
