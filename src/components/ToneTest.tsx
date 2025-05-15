import { useEffect, useRef, useState } from "react"

interface ToneTestProps {
  showIntro: boolean
}
  
export default function ToneTest({ showIntro }: ToneTestProps) {
  const backAudioRef = useRef<HTMLAudioElement | null>(null)
  const breathAudioRef = useRef<HTMLAudioElement | null>(null)
  const [playedBack, setPlayedBack] = useState(false)

  useEffect(() => {
    console.log("ToneTest mounted. showIntro:", showIntro)
    if (!showIntro && !playedBack) {
        if (backAudioRef.current) {
            backAudioRef.current.volume = 0.2
            backAudioRef.current.play()
          }
          setPlayedBack(true)
        }
      }, [showIntro, playedBack])

    const handleBreathClick = () => {
        if (breathAudioRef.current) {
          breathAudioRef.current.volume = 0.5 
          breathAudioRef.current.play()
        }
      }
  return (
    <div className="absolute bottom-8 ">
      <button
        onClick={handleBreathClick}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Sound
      </button>
      <audio ref={backAudioRef} src="/sounds/back.mp3" preload="auto" />
      <audio ref={breathAudioRef} src="/sounds/breath.mp3" preload="auto" />
    </div>
  )
}
