import { useEffect, useRef } from 'react';
import { Howl } from 'howler';

interface HowlerTestProps {
  play: boolean;
  triggerBreathSound?: boolean;
}

const HowlerTest: React.FC<HowlerTestProps> = ({ play, triggerBreathSound }) => {
  const bgMusicRef = useRef<Howl | null>(null);
  const breathSoundRef = useRef<Howl | null>(null);

  useEffect(() => {
    bgMusicRef.current = new Howl({
      src: ['/sounds/back.mp3'],
      loop: true,
      volume: 0.3,
    });

    breathSoundRef.current = new Howl({
      src: ['/sounds/breath.mp3'],
      volume: 1.0,
    });

    if (play && bgMusicRef.current) {
      bgMusicRef.current.play();
    }

    return () => {
      bgMusicRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (bgMusicRef.current) {
      if (play) {
        bgMusicRef.current.play();
      } else {
        bgMusicRef.current.pause();
      }
    }
  }, [play]);

  useEffect(() => {
    if (triggerBreathSound && breathSoundRef.current) {
      breathSoundRef.current.play();
    }
  }, [triggerBreathSound]);

  return null;
};

export default HowlerTest;
