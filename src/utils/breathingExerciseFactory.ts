export interface BreathingInstruction {
  key: string
  duration: number
}

export interface BreathingExercise {
  id: string
  name: string
  instructions: BreathingInstruction[]
  cycleDuration: number
}

export class BreathingExerciseFactory {
  static getExercise(type: string): BreathingExercise {
    switch (type) {
      case "4-7-8":
        return {
          id: "4-7-8",
          name: "4-7-8",
          instructions: [
            { key: "breath-instructions", duration: 4 },
            { key: "hold-instructions", duration: 7 },
            { key: "exhale-instructions", duration: 8 },
          ],
          cycleDuration: 19,
        }
      default:
        return {
          id: "4-7-8",
          name: "4-7-8",
          instructions: [
            { key: "breath-instructions", duration: 4 },
            { key: "hold-instructions", duration: 7 },
            { key: "exhale-instructions", duration: 8 },
          ],
          cycleDuration: 19,
        }
    }
  }
}
