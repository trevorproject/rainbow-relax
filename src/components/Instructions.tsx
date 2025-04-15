import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Pause, Play } from "lucide-react"
import { useTranslation } from "react-i18next"
import { useLocation, useNavigate } from "react-router-dom"

const INSTRUCTIONS = [
  { key: "breath-instructions", duration: 4 },
  { key: "hold-instructions", duration: 7 },
  { key: "exhale-instructions", duration: 8 },
]

const CYCLE_DURATION = INSTRUCTIONS.reduce((sum, instr) => sum + instr.duration, 0)
export default function BreathingInstructions() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const cycles = location.state?.cycles || 1
  const time = cycles * 60
  const [showIntro, setShowIntro] = useState(true)
  const [timeLeft, setTimeLeft] = useState(time)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const getInstructionFromTime = (current: number) => {
    const cycleTime = current  % CYCLE_DURATION 
    let accumulatedTime = 0
    for (let i = 0; i < INSTRUCTIONS.length; i++) {
      accumulatedTime += INSTRUCTIONS[i].duration
      if (cycleTime < accumulatedTime) {
        return i
      }
    }
    return 0
  }
  const instruction = getInstructionFromTime(currentTime)
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

  const formatTime = (seconds:number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`
  }

  return (
    <div className="flex flex-col items-center min-h-screen w-full text-gray-800 overflow-hidden fixed inset-0">
      <motion.div
        className="fixed top-8 left-8"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <ArrowLeft size={24} className="text-gray-700 cursor-pointer hover:opacity-70 transition-opacity duration-300" onClick={() => navigate("/")}/>
      </motion.div>

      {showIntro ? (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.7 }}
          className="w-full flex flex-col items-center justify-center text-center pt-46 pb-8"
        >
          <div className="px-8 py-8">
            <h1 className="text-3xl md:text-4xl">4-7-8</h1>
            <h2 className="text-2xl md:text-3xl mt-2">{t("breath-exercise-label")}</h2>
            <p className="text-gray-700 text-lg md:text-xl mt-28">{t("instructions")}</p>
          </div>
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center flex-grow w-full px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col justify-between items-center text-center min-h-[90vh] gap-6 px-4 py-8 w-full"
          >
            <h2 className="text-4xl font-bold">{formatTime(timeLeft)}</h2>

            <div className="flex flex-col items-center">
              {timeLeft > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-4"
                >
                  <button
                    onClick={togglePause}
                    className={"transition-transform duration-300 cursor-pointer hover:scale-125 hover:opacity-70"}
                  >
                    {isPaused ? (
                      <Play size={32} className="text-black" />
                    ) : (
                      <Pause size={32} className="text-black" />
                    )}
                  </button>
                </motion.div>
              )}

              <motion.p
                key={INSTRUCTIONS[instruction].key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, delay: 0.3 }}
                className="text-lg md:text-xl text-gray-700 text-center max-w-md mx-auto"
              >
                {t(INSTRUCTIONS[instruction].key)}
              </motion.p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
