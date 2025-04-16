import { motion } from "framer-motion";
import { useContext } from "react";
import { MainAnimationContext } from "../context/MainAnimationContext";

export const MainAnimation = () => {
  const context = useContext(MainAnimationContext);
  if (!context) {
    throw new Error("MainAnimation must be inside MainAnimationProvider");
  }
  context.animationContext("main");
  return (
    <div className="relative w-full h-full">
      <motion.div
        className="h-[50vh] w-[50vh] sm:h-[50vh] sm:w-[50vh] md:h-[64vh] md:w-[64vh] lg:h-[83vh] lg:w-[83vh] rounded-full absolute -z-10"
        style={{
          backgroundColor: "var(--circle-bottom)",
          top: context.animation.fourthCircle.position.top,
          left: context.animation.fourthCircle.position.left
            ? context.animation.fourthCircle.position.left
            : "",
          right: context.animation.fourthCircle.position.right
            ? context.animation.fourthCircle.position.right
            : "",
          bottom: context.animation.fourthCircle.position.bottom,
          transform: context.animation.fourthCircle.position.transform
            ? context.animation.fourthCircle.position.transform
            : "",
          margin: "auto",
        }}
        animate={{ scale: context.animation.fourthCircle.scale }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: context.animation.fourthCircle.repeat,
          times: context.animation.fourthCircle.times,
        }}
      />
      <motion.div
        className="h-[40vh] w-[40vh] sm:h-[40vh] sm:w-[40vh] md:h-[50vh] md:w-[50vh] lg:h-[63vh] lg:w-[63vh] rounded-full absolute -z-10"
        style={{
          backgroundColor: "var(--circle-mid-bottom)",
          top: context.animation.thirdCircle.position.top,
          left: context.animation.thirdCircle.position.left
            ? context.animation.thirdCircle.position.left
            : "",
          right: context.animation.thirdCircle.position.right
            ? context.animation.thirdCircle.position.right
            : "",
          bottom: context.animation.thirdCircle.position.bottom,
          transform: context.animation.thirdCircle.position.transform
            ? context.animation.thirdCircle.position.transform
            : "",
          margin: "auto",
        }}
        animate={{
          scale: context.animation.thirdCircle.scale,
        }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: context.animation.thirdCircle.repeat,
          times: context.animation.thirdCircle.times,
        }}
      />
      <motion.div
        className="h-[30vh] w-[30vh] sm:h-[30vh] sm:w-[30vh] md:h-[35vh] md:w-[35vh] lg:h-[43vh] lg:w-[43vh] rounded-full absolute -z-10"
        style={{
          backgroundColor: "var(--circle-mid-top)",
          top: context.animation.secondCircle.position.top,
          left: context.animation.secondCircle.position.left
            ? context.animation.secondCircle.position.left
            : "",
          right: context.animation.secondCircle.position.right
            ? context.animation.secondCircle.position.right
            : "",
          bottom: context.animation.secondCircle.position.bottom,
          transform: context.animation.secondCircle.position.transform
            ? context.animation.secondCircle.position.transform
            : "",
          margin: "auto",
        }}
        animate={{
          scale: context.animation.secondCircle.scale,
        }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: context.animation.secondCircle.repeat,
          times: context.animation.secondCircle.times,
        }}
      />
      <motion.div
        className="h-[20vh] w-[20vh] sm:h-[15vh] sm:w-[15vh] md:h-[20vh] md:w-[20vh]  lg:h-[24vh] lg:w-[24vh] rounded-full absolute -z-10"
        style={{
          backgroundColor: "var(--circle-top)",
          top: context.animation.firstCircle.position.top,
          left: context.animation.firstCircle.position.left
            ? context.animation.firstCircle.position.left
            : "",
          right: context.animation.firstCircle.position.right
            ? context.animation.firstCircle.position.right
            : "",
          bottom: context.animation.firstCircle.position.bottom,
          transform: context.animation.firstCircle.position.transform
            ? context.animation.firstCircle.position.transform
            : "",
          margin: "auto",
        }}
        animate={{
          scale: context.animation.firstCircle.scale,
        }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: context.animation.firstCircle.repeat,
          times: context.animation.firstCircle.times,
        }}
      />
    </div>
  );
};
