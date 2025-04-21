import { useState, useEffect } from "react"
import { BreathingExerciseFactory, type BreathingExercise } from "../utils/breathingExerciseFactory"

interface UseBreathingExerciseProps {
    exerciseType: string 
    minutes: number 
  }
  
  interface UseBreathingExerciseReturn {
    exercise: BreathingExercise
    showIntro: boolean
    timeLeft: number
    currentTime: number
    isPaused: boolean
    currentInstruction: number
    formatTime: (seconds: number) => string
    togglePause: () => void
  }
  
export function useBreathingExercise({ exerciseType, minutes }: UseBreathingExerciseProps): UseBreathingExerciseReturn {
    const type = exerciseType || "4-7-8";
    const minutesCount = minutes || 1;  
  
    const exercise = BreathingExerciseFactory.getExercise(type)
    const CYCLE_DURATION = BreathingExerciseFactory.getCycleDuration(exercise)
  
    const time = minutesCount * 60
    const [showIntro, setShowIntro] = useState(true)
    const [timeLeft, setTimeLeft] = useState(time)
    const [currentTime, setCurrentTime] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
  
    const getInstructionFromTime = (current: number) => {
      const cycleTime = current % CYCLE_DURATION
      let accumulatedTime = 0
      for (let i = 0; i < exercise.instructions.length; i++) {
        accumulatedTime += exercise.instructions[i].duration
        if (cycleTime < accumulatedTime) {
          return i
        }
      }
      return 0
    }
  
    const currentInstruction = getInstructionFromTime(currentTime)
  
    const togglePause = () => {
      setIsPaused((prev) => !prev)
    }
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setShowIntro(false)
      }, 10000)
      return () => clearTimeout(timer)
    }, [])
  
    useEffect(() => {
      if (showIntro || isPaused || timeLeft <= 0) return
      const interval = setInterval(() => {
        setCurrentTime((prev) => prev + 1)
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }, [showIntro, isPaused, timeLeft])
  
    const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${minutes}:${secs < 10 ? "0" : ""}${secs}`
    }
  
    return {
      exercise,
      showIntro,
      timeLeft,
      currentTime,
      isPaused,
      currentInstruction,
      formatTime,
      togglePause,
    }
  }
  