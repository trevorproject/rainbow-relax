import { motion, useAnimation } from "framer-motion";
import { MainAnimationObject } from "../context/animationObjects";
import { BreathingExerciseFactory } from "../utils/breathingExerciseFactory";
import { useBreathingPhases } from "../hooks/useBreathingPhases";
import { useEffect } from "react";

interface MainAnimationProps {
  animation: MainAnimationObject;
  isPaused: boolean;
}

export const MainAnimation = ({ animation, isPaused }: MainAnimationProps) => {
  const positionTimes = {
    top: { duration: 3 },
    left: { duration: 3 },
    right: { duration: 3 },
    bottom: { duration: 3 },
  };
  const exercise = BreathingExerciseFactory.getExercise("4-7-8");
  const isCycle = animation.firstCircle.duration === exercise.cycleDuration;
  const inhaleTime = isCycle ? exercise.instructions[0].duration : 0;
  const holdTime = isCycle ? exercise.instructions[1].duration : 0;
  const exhaleTime = isCycle ? exercise.instructions[2].duration : 0;

  const firstControls = useAnimation()
  const secondControls = useAnimation();
  const thirdControls = useAnimation();
  const fourthControls = useAnimation();


  const { cycleProgress, getCurrentScale } = useBreathingPhases({
    inhaleTime,
    holdTime,
    exhaleTime,
    isPaused,
  });
  

  useEffect(() => {
    if (!isCycle) return;
    firstControls.start({
      scale: getCurrentScale(cycleProgress, animation.firstCircle.scale, animation.firstCircle.times),
      ...animation.firstCircle.position,
    });
    secondControls.start({
      scale: getCurrentScale(cycleProgress, animation.secondCircle.scale, animation.secondCircle.times),
      ...animation.secondCircle.position,
    });
    thirdControls.start({
      scale: getCurrentScale(cycleProgress, animation.thirdCircle.scale, animation.thirdCircle.times),
      ...animation.thirdCircle.position,
    });
    fourthControls.start({
      scale: getCurrentScale(cycleProgress, animation.fourthCircle.scale, animation.fourthCircle.times),
      ...animation.fourthCircle.position,
    });
  }, [isCycle, cycleProgress, isPaused, animation, getCurrentScale, firstControls, secondControls, thirdControls, fourthControls]);

  useEffect(() => {
    if (isCycle) return;
    const start = (controls: { start: (props: { scale: number; [key: string]: unknown }) => void }, props: { scale: number; [key: string]: unknown }) => {
      controls.start({
        scale: props.scale,
        ...props.position,
        transition: {
          scale: {
            duration: props.duration,
            repeat: props.repeat,
            times: props.times,
          },
          ...positionTimes,
        },
      });
    };
    if (isPaused) {
      firstControls.stop();
      secondControls.stop();
      thirdControls.stop();
      fourthControls.stop();
    } else {
      start(firstControls, animation.firstCircle);
      start(secondControls, animation.secondCircle);
      start(thirdControls, animation.thirdCircle);
      start(fourthControls, animation.fourthCircle);
    }
    return () => {
      firstControls.stop();
      secondControls.stop();
      thirdControls.stop();
      fourthControls.stop();
    };
  }, [animation, isPaused, isCycle]);



 return (
    <div className="relative w-full h-full">
      <motion.div
        className="h-[35vh] w-[35vh] sm:h-[45vh] sm:w-[45vh] md:h-[64vh] md:w-[64vh] lg:h-[83vh] lg:w-[83vh] rounded-full absolute -z-10 opacity-80"
        style={{
          backgroundColor: "var(--circle-bottom)",
          margin: "auto",
        }}
        animate={fourthControls}
        initial={{
          ...animation.fourthCircle.position,
          scale: animation.fourthCircle.scale[0],
        }}
      />
      <motion.div
        className="h-[28vh] w-[28vh] sm:h-[35vh] sm:w-[35vh] md:h-[50vh] md:w-[50vh] lg:h-[63vh] lg:w-[63vh] rounded-full absolute -z-10 opacity-80"
        style={{
          backgroundColor: "var(--circle-mid-bottom)",
          margin: "auto",
        }}
        animate={thirdControls}
        initial={{
          ...animation.thirdCircle.position,
          scale: animation.thirdCircle.scale[0],
        }}
      />
      <motion.div
        className="h-[21vh] w-[21vh] sm:h-[26vh] sm:w-[26vh] md:h-[35vh] md:w-[35vh] lg:h-[43vh] lg:w-[43vh] rounded-full absolute -z-10 opacity-80"
        style={{
          backgroundColor: "var(--circle-mid-top)",
          margin: "auto",
        }}
        animate={secondControls}
        initial={{
          ...animation.secondCircle.position,
          scale: animation.secondCircle.scale[0],
        }}
      />
      <motion.div
        className="h-[14vh] w-[14vh] sm:h-[18vh] sm:w-[18vh] md:h-[20vh] md:w-[20vh]  lg:h-[24vh] lg:w-[24vh] rounded-full absolute -z-10 opacity-80"
        style={{
          backgroundColor: "var(--circle-top)",
          margin: "auto",
        }}
        animate={firstControls}
        initial={{
          ...animation.firstCircle.position,
          scale: animation.firstCircle.scale[0],
        }}
      />
    </div>
  );
};
