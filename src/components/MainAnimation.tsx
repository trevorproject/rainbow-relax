import { motion, useAnimation } from "framer-motion";
import { MainAnimationObject } from "../context/animationObjects";
import { BreathingExerciseFactory } from "../utils/breathingExerciseFactory";
import { useBreathingPhases } from "../hooks/useBreathingPhases";
import { useEffect, useMemo } from "react";
import { useTailwindAdapter } from "../utils/tailwindAdapter";

interface MainAnimationProps {
  animation: MainAnimationObject;
  isPaused: boolean;
}

export const MainAnimation = ({ animation, isPaused }: MainAnimationProps) => {
  const cn = useTailwindAdapter();
  
  const positionTimes = {
    top: { duration: 3 },
    left: { duration: 3 },
    right: { duration: 3 },
    bottom: { duration: 3 },
  };
  const exercise = useMemo(() => BreathingExerciseFactory.getExercise("4-7-8"), []);
  const isCycle = useMemo(() => animation.firstCircle.duration === exercise.cycleDuration, [animation.firstCircle.duration, exercise.cycleDuration]);
  const inhaleTime = useMemo(() => isCycle ? exercise.instructions[0].duration : 0, [isCycle, exercise.instructions]);
  const holdTime = useMemo(() => isCycle ? exercise.instructions[1].duration : 0, [isCycle, exercise.instructions]);
  const exhaleTime = useMemo(() => isCycle ? exercise.instructions[2].duration : 0, [isCycle, exercise.instructions]);

  const firstControls = useAnimation();
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
    
    // Only update animations when cycleProgress changes, not when animation object changes
    const updateAnimations = () => {
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
    };
    
    updateAnimations();
  }, [isCycle, cycleProgress, getCurrentScale]);

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
  }, [isPaused, isCycle]);

  return (
    <div className={cn("relative w-full h-full")} data-testid="main-animation" style={{ overflow: 'visible' }}>
          <motion.div
            className={cn("rounded-full absolute opacity-80")}
            style={{
              backgroundColor: "var(--circle-bottom)",
              width: "clamp(200px, 30%, 300px)",
              margin: "auto",
              aspectRatio: "1",
            }}
            animate={fourthControls}
            initial={{
              ...animation.fourthCircle.position,
              scale: animation.fourthCircle.scale[0],
            }}
            data-testid="breathing-circle-4"
          />
          <motion.div
            className={cn("rounded-full absolute opacity-80")}
            style={{
              backgroundColor: "var(--circle-mid-bottom)",
              width: "clamp(160px, 24%, 240px)",
              margin: "auto",
              aspectRatio: "1",
            }}
            animate={thirdControls}
            initial={{
              ...animation.thirdCircle.position,
              scale: animation.thirdCircle.scale[0],
            }}
            data-testid="breathing-circle-3"
          />
          <motion.div
            className={cn("rounded-full absolute opacity-80")}
            style={{
              backgroundColor: "var(--circle-mid-top)",
              width: "clamp(120px, 18%, 180px)",
              margin: "auto",
              aspectRatio: "1",
            }}
            animate={secondControls}
            initial={{
              ...animation.secondCircle.position,
              scale: animation.secondCircle.scale[0],
            }}
            data-testid="breathing-circle-2"
          />
          <motion.div
            className={cn("rounded-full absolute opacity-80")}
            style={{
              backgroundColor: "var(--circle-top)",
              width: "clamp(80px, 12%, 120px)",
              margin: "auto",
              aspectRatio: "1",
            }}
            animate={firstControls}
            initial={{
              ...animation.firstCircle.position,
              scale: animation.firstCircle.scale[0],
            }}
            data-testid="breathing-circle-1"
          />
        </div>
      );
};
