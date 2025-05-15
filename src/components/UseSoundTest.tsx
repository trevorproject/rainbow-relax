import { useEffect } from "react";
import useSound from "use-sound";

interface UseSoundTestProps {
  play: boolean;
}

export default function UseSoundTest({ play }: UseSoundTestProps) {
  console.log("SoundController play:", play);

  const [playBack, { sound: backSound }] = useSound("/sounds/back.mp3", {
    volume: 0.5,
    loop: true,
    soundEnabled: true,
  });

  const [playBreath] = useSound("/sounds/breath.mp3", { volume: 1 });
  useEffect(() => {
    if (!backSound) return;
    backSound.once("load", () => {
      backSound.pause(); 
    });
    playBack();
  }, [backSound, playBack]);

  useEffect(() => {
    if (!backSound) return;

    if (play) {
      if (!backSound.playing()) {
        backSound.play();
      }
    } else {
      backSound.pause();
    }
  }, [play, backSound]);

  return (
    <button
      onClick={() => playBreath()}
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
    >
      Sound
    </button>
  );
}
