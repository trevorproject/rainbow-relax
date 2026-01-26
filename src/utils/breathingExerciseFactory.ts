import {
  EXERCISE_REGISTRY,
  type BreathingExercise,
  type BreathingInstruction,
} from "../config/exerciseRegistry";

export type { BreathingExercise, BreathingInstruction };

function validateExercise(exercise: BreathingExercise): boolean {
  if (!exercise.id || !exercise.name || !exercise.instructions || exercise.cycleDuration === undefined) {
    console.warn(`Exercise validation failed: Missing required fields`, exercise);
    return false;
  }

  if (!Array.isArray(exercise.instructions) || exercise.instructions.length === 0) {
    console.warn(`Exercise validation failed: Instructions array is empty`, exercise);
    return false;
  }

  const hasInvalidDuration = exercise.instructions.some(
    (instruction) => typeof instruction.duration !== "number" || instruction.duration <= 0
  );
  if (hasInvalidDuration) {
    console.warn(`Exercise validation failed: Invalid duration found`, exercise);
    return false;
  }

  const sumOfDurations = exercise.instructions.reduce(
    (sum, instruction) => sum + instruction.duration,
    0
  );
  if (Math.abs(exercise.cycleDuration - sumOfDurations) > 0.01) {
    console.warn(
      `Exercise validation warning: cycleDuration (${exercise.cycleDuration}) does not match sum of phase durations (${sumOfDurations})`,
      exercise
    );
  }

  return true;
}

export class BreathingExerciseFactory {
  static getExercise(type: string): BreathingExercise {
    const exercise = EXERCISE_REGISTRY[type];

    if (!exercise) {
      console.warn(`Exercise type "${type}" not found in registry. Falling back to 4-7-8.`);
      const fallbackExercise = EXERCISE_REGISTRY["4-7-8"];
      if (!fallbackExercise) {
        throw new Error("Default exercise 4-7-8 not found in registry. Registry may be misconfigured.");
      }
      return fallbackExercise;
    }

    if (!validateExercise(exercise)) {
      console.warn(`Exercise "${type}" failed validation. Falling back to 4-7-8.`);
      const fallbackExercise = EXERCISE_REGISTRY["4-7-8"];
      if (!fallbackExercise) {
        throw new Error("Default exercise 4-7-8 not found in registry. Registry may be misconfigured.");
      }
      return fallbackExercise;
    }

    return exercise;
  }
}
