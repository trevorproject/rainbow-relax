import { motion, useAnimation } from "framer-motion";
import { MainAnimationObject } from "../context/animationObjects";
import { BreathingExerciseFactory } from "../utils/breathingExerciseFactory";
import { useBreathingPhases } from "../hooks/useBreathingPhases";
import { useEffect } from "react";
import Example from "./animcomp";

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
    const start = (controls: any, props: any) => {
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
    <div className="absolute ">
      <Example/>
    </div>
  );
};
