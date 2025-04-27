import { motion } from "framer-motion";
import { MainAnimationObject } from "../context/animationObjects";

interface MainAnimationProps {
  animation: MainAnimationObject;
}

export const MainAnimation = ({ animation }: MainAnimationProps) => {
  return (
    <div className="relative w-full h-full">
      <motion.div
        className="h-[50vh] w-[50vh] sm:h-[50vh] sm:w-[50vh] md:h-[64vh] md:w-[64vh] lg:h-[83vh] lg:w-[83vh] rounded-full absolute -z-10 opacity-80"
        style={{
          backgroundColor: "var(--circle-bottom)",
          ...animation.fourthCircle.position,
          margin: "auto",
        }}
        animate={{ scale: animation.fourthCircle.scale }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: animation.fourthCircle.repeat,
          times: animation.fourthCircle.times,
        }}
      />
      <motion.div
        className="h-[40vh] w-[40vh] sm:h-[40vh] sm:w-[40vh] md:h-[50vh] md:w-[50vh] lg:h-[63vh] lg:w-[63vh] rounded-full absolute -z-10 opacity-80"
        style={{
          backgroundColor: "var(--circle-mid-bottom)",
          ...animation.thirdCircle.position,
          margin: "auto",
        }}
        animate={{
          scale: animation.thirdCircle.scale,
        }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: animation.thirdCircle.repeat,
          times: animation.thirdCircle.times,
        }}
      />
      <motion.div
        className="h-[30vh] w-[30vh] sm:h-[30vh] sm:w-[30vh] md:h-[35vh] md:w-[35vh] lg:h-[43vh] lg:w-[43vh] rounded-full absolute -z-10 opacity-80"
        style={{
          backgroundColor: "var(--circle-mid-top)",
          ...animation.secondCircle.position,
          margin: "auto",
        }}
        animate={{
          scale: animation.secondCircle.scale,
        }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: animation.secondCircle.repeat,
          times: animation.secondCircle.times,
        }}
      />
      <motion.div
        className="h-[20vh] w-[20vh] sm:h-[15vh] sm:w-[15vh] md:h-[20vh] md:w-[20vh]  lg:h-[24vh] lg:w-[24vh] rounded-full absolute -z-10 opacity-80"
        style={{
          backgroundColor: "var(--circle-top)",
          ...animation.firstCircle.position,
          margin: "auto",
        }}
        animate={{
          scale: animation.firstCircle.scale,
        }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: animation.firstCircle.repeat,
          times: animation.firstCircle.times,
        }}
      />
    </div>
  );
};
