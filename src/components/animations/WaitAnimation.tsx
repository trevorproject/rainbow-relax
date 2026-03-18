import type { TargetAndTransition } from "framer-motion";
import AnimatedBlob from "./AnimatedBlob";

const LOOP_DURATION = 1;

interface BandConfig {
  animate: TargetAndTransition;
  duration: number;
  initialOpacity?: number;
}

const BANDS: BandConfig[] = [
  { animate: { opacity: [0.5, 0.03, 0.3, 0.7], scale: 1.5, x: "50%",   y: "50%"   }, duration: 6   },
  { animate: { opacity: [0.5, 0.3,  0.5],       scale: 1.5, x: "-150%", y: "-150%" }, duration: 5.9 },
  { animate: { opacity: [0.5, 0.3,  0.3],       scale: 1,   x: "50%",   y: "-150%" }, duration: 6.2 },
  { animate: { opacity: [0.3, 0.3,  0.2],       scale: 1,   x: "-150%", y: "50%"   }, duration: 6,   initialOpacity: 0 },
];

const WaitAnimation = () => (
  <>
    {BANDS.flatMap((band, i) =>
      [0, LOOP_DURATION * 0.25].map((delay) => (
        <AnimatedBlob
          key={`${i}-${delay}`}
          style={{ x: "50%", y: "50%" }}
          initial={{ opacity: band.initialOpacity ?? 0.3, scale: 1.5, x: "-50%", y: "-50%" }}
          animate={band.animate}
          transition={{
            repeat: 1,
            repeatType: "reverse",
            repeatDelay: 0.5,
            times: [0, 0.5, 0.5, 1],
            duration: band.duration,
            ease: "anticipate",
            delay,
          }}
        />
      ))
    )}
  </>
);

export default WaitAnimation;
