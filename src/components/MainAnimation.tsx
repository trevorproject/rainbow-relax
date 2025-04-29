import { motion } from "framer-motion";
import { MainAnimationObject } from "../context/animationObjects";

interface MainAnimationProps {
  animation: MainAnimationObject;
}

export const MainAnimation = ({ animation }: MainAnimationProps) => {
  const positionTimes = {
    top: { duration: 3 },
    left: { duration: 3 },
    right: { duration: 3 },
    bottom: { duration: 3 },
  };

  return (
    <div className="relative w-full h-full">
      <motion.div
        className="h-[50vh] w-[50vh] sm:h-[50vh] sm:w-[50vh] md:h-[64vh] md:w-[64vh] lg:h-[83vh] lg:w-[83vh] rounded-full absolute -z-10 opacity-80"
        style={{
          backgroundColor: "var(--circle-bottom)",
          margin: "auto",
        }}
        animate={{
          scale: animation.fourthCircle.scale,
          ...animation.fourthCircle.position,
        }}
        transition={{
          scale: {
            duration: animation.fourthCircle.duration,
            ease: "easeInOut",
            repeat: animation.fourthCircle.repeat,
            times: animation.fourthCircle.times,
          },
          ...positionTimes,
        }}
        initial={{
          ...animation.fourthCircle.position,
        }}
      />
      <motion.div
        className="h-[40vh] w-[40vh] sm:h-[40vh] sm:w-[40vh] md:h-[50vh] md:w-[50vh] lg:h-[63vh] lg:w-[63vh] rounded-full absolute -z-10 opacity-80"
        style={{
          backgroundColor: "var(--circle-mid-bottom)",
          margin: "auto",
        }}
        animate={{
          scale: animation.thirdCircle.scale,
          ...animation.thirdCircle.position,
        }}
        transition={{
          scale: {
            duration: animation.thirdCircle.duration,
            ease: "easeInOut",
            repeat: animation.thirdCircle.repeat,
            times: animation.thirdCircle.times,
          },
          ...positionTimes,
        }}
        initial={{
          ...animation.thirdCircle.position,
        }}
      />
      <motion.div
        className="h-[30vh] w-[30vh] sm:h-[30vh] sm:w-[30vh] md:h-[35vh] md:w-[35vh] lg:h-[43vh] lg:w-[43vh] rounded-full absolute -z-10 opacity-80"
        style={{
          backgroundColor: "var(--circle-mid-top)",
          margin: "auto",
        }}
        animate={{
          scale: animation.secondCircle.scale,
          ...animation.secondCircle.position,
        }}
        transition={{
          scale: {
            duration: animation.secondCircle.duration,
            ease: "easeInOut",
            repeat: animation.secondCircle.repeat,
            times: animation.secondCircle.times,
          },
          ...positionTimes,
        }}
        initial={{
          ...animation.secondCircle.position,
        }}
      />
      <motion.div
        className="h-[20vh] w-[20vh] sm:h-[15vh] sm:w-[15vh] md:h-[20vh] md:w-[20vh]  lg:h-[24vh] lg:w-[24vh] rounded-full absolute -z-10 opacity-80"
        style={{
          backgroundColor: "var(--circle-top)",
          margin: "auto",
        }}
        animate={{
          scale: animation.firstCircle.scale,
          ...animation.firstCircle.position,
        }}
        transition={{
          scale: {
            duration: animation.firstCircle.duration,
            ease: "easeInOut",
            repeat: animation.firstCircle.repeat,
            times: animation.firstCircle.times,
          },
          ...positionTimes,
        }}
        initial={{
          ...animation.firstCircle.position,
        }}
      />
    </div>
  );
};
