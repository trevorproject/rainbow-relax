import { motion } from "framer-motion";
import { useContext } from "react";
import { MainAnimationContext } from "../context/MainAnimationContext";

interface MainAnimationProps {
  scale?: number[];
  times?: number[];
  duration?: number;
  ease?: string;
  repeat?: number;
}

export const MainAnimation = ({
  scale,
  times,
  duration,
  ease,
  repeat,
}: MainAnimationProps) => {
  const context = useContext(MainAnimationContext);
  if (!context) {
    throw new Error("MainAnimation must be inside MainAnimationProvider");
  }

  return (
    <div className="flex justify-center items-center opacity-80 absolute left-0 -z-10">
      <motion.div
        className="h-[50vh] w-[50vh] sm:h-[50vh] sm:w-[50vh] md:h-[64vh] md:w-[64vh] lg:h-[83vh] lg:w-[83vh] rounded-full absolute "
        style={{ backgroundColor: 'var(--circle-bottom)' }}
        animate={{ scale: scale ?? context.scale }}
        transition={{
          duration: duration ?? context.duration,
          ease: ease ?? context.ease,
          repeat: repeat ?? context.repeat,
          times: times ?? context.times,
        }}
      />
      <motion.div
        className="h-[40vh] w-[40vh] sm:h-[40vh] sm:w-[40vh] md:h-[50vh] md:w-[50vh] lg:h-[63vh] lg:w-[63vh] rounded-full absolute "
        style={{ backgroundColor: 'var(--circle-mid-bottom)' }}
        animate={{ scale: scale ?? context.scale }}
        transition={{
          duration: duration ?? context.duration,
          ease: ease ?? context.ease,
          repeat: repeat ?? context.repeat,
          times: times ?? context.times,
        }}
      />
      <motion.div
        className="h-[30vh] w-[30vh] sm:h-[30vh] sm:w-[30vh] md:h-[35vh] md:w-[35vh] lg:h-[43vh] lg:w-[43vh] rounded-full absolute "
        style={{ backgroundColor: 'var(--circle-mid-top)' }}
        animate={{ scale: scale ?? context.scale }}
        transition={{
          duration: duration ?? context.duration,
          ease: ease ?? context.ease,
          repeat: repeat ?? context.repeat,
          times: times ?? context.times,
        }}
      />
      <motion.div
        className="h-[20vh] w-[20vh] sm:h-[15vh] sm:w-[15vh] md:h-[20vh] md:w-[20vh]  lg:h-[24vh] lg:w-[24vh] rounded-full absolute "
        style={{ backgroundColor: 'var(--circle-top)' }}
        animate={{ scale: scale ?? context.scale }}
        transition={{
          duration: duration ?? context.duration,
          ease: ease ?? context.ease,
          repeat: repeat ?? context.repeat,
          times: times ?? context.times,
        }}
      />
    </div>
  );
};
