import { useAnimate, AnimationPlaybackControls } from "framer-motion";
import { useEffect, useState } from "react";
import AnimatedBlob from "./AnimatedBlob";

const DURATION = 19;
const TIMES: [number, number, number, number] = [0, 0.21, 0.58, 1];
const EASE: import("framer-motion").Easing[] = ["easeInOut", "circOut"];

interface BlobConfig {
  id: string;
  opacity: [number, number, number, number];
  scale: [number, number, number, number];
  delay: number;
}

const BLOBS: BlobConfig[] = [
  { id: 'blob-0', opacity: [0.3, 0.5, 0.5, 0.3], scale: [1.5, 3.5, 3.5, 1.5], delay: 0 },
  { id: 'blob-1', opacity: [0.3, 0.0, 0.0, 0.1], scale: [1.5, 3.7, 3.5, 1.5], delay: 0.5 },
  { id: 'blob-2', opacity: [0.3, 0.0, 0.0, 0.1], scale: [1.5, 3.7, 3.5, 1.5], delay: 1.0 },
  { id: 'blob-3', opacity: [0.3, 0.0, 0.0, 0.1], scale: [1.5, 3.7, 3.5, 1.5], delay: 1.5 },
  { id: 'blob-4', opacity: [0.3, 0.7, 0.7, 0.5], scale: [1.5, 3.0, 3.0, 1.5], delay: 0 },
  { id: 'blob-5', opacity: [0.5, 0.9, 0.9, 0.7], scale: [1.5, 2.5, 2.5, 1.5], delay: 0 },
];

const BreathingBlob = ({ opacity, scale, delay, isPaused }: Omit<BlobConfig, 'id'> & { isPaused: boolean }) => {
  const [scope, animate] = useAnimate();
  const [controls, setControls] = useState<AnimationPlaybackControls | undefined>();

  useEffect(() => {
    const animation = animate(
      scope.current,
      { opacity, scale },
      { repeat: Infinity, repeatType: "loop", duration: DURATION, ease: EASE, times: TIMES, delay }
    );
    setControls(animation);
  }, [animate, delay, scope, opacity, scale]);

  useEffect(() => {
    if (isPaused) {
      controls?.pause();
    } else {
      controls?.play();
    }
  }, [isPaused, controls]);

  return (
    <AnimatedBlob
      ref={scope}
      style={{ x: "50%", y: "50%" }}
      initial={{ opacity: 0, scale: 1.5, x: "-50%", y: "-50%" }}
    />
  );
};

const BreathingAnimation = ({ isPaused }: { isPaused: boolean }) => (
  <>
    {BLOBS.map((blob) => (
      <BreathingBlob key={blob.id} {...blob} isPaused={isPaused} />
    ))}
  </>
);

export default BreathingAnimation;
