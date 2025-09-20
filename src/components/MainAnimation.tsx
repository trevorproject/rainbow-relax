import { motion, useAnimation } from "framer-motion";
import { useEffect, useMemo } from "react";
import { MainAnimationObject } from "../context/animationObjects";
import { useBreathingPhases } from "../hooks/useBreathingPhases";
import { BreathingExerciseFactory } from "../utils/breathingExerciseFactory";

interface MainAnimationProps {
  animation: MainAnimationObject;
  isPaused: boolean;
}

export const MainAnimation = ({ animation, isPaused }: MainAnimationProps) => {
  const positionTimes = useMemo(() => ({
    top: { duration: 3 },
    left: { duration: 3 },
    right: { duration: 3 },
    bottom: { duration: 3 },
  }), []);
  
  const exercise = BreathingExerciseFactory.getExercise("4-7-8");
  const isCycle = animation.firstCircle.duration === exercise.cycleDuration;
  const inhaleTime = isCycle ? exercise.instructions[0].duration : 0;
  const holdTime = isCycle ? exercise.instructions[1].duration : 0;
  const exhaleTime = isCycle ? exercise.instructions[2].duration : 0;

  // Check if we're in widget mode to adjust circle sizes
  const isWidget = typeof window !== 'undefined' && 
    (window as typeof window & { myWidgetConfig?: unknown }).myWidgetConfig;


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
    
    const start = (controls: ReturnType<typeof useAnimation>, props: {
      scale: number[];
      position: { top?: string; left?: string; right?: string; bottom?: string; transform?: string };
      duration: number;
      repeat: number;
      times: number[];
    }) => {
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
  }, [animation, isPaused, isCycle, firstControls, secondControls, thirdControls, fourthControls, positionTimes]);


  return (
    <div style={{ 
      position: "absolute", 
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: "100%", 
      height: "100%",
      overflow: "hidden",
      pointerEvents: "none",
      zIndex: -1
    }}>
      <motion.div
        style={{
          height: isWidget ? "clamp(150px, 25vmin, 300px)" : "clamp(35vh, 50vw, 83vh)",
          width: isWidget ? "clamp(150px, 25vmin, 300px)" : "clamp(35vh, 50vw, 83vh)",
          borderRadius: "50%",
          position: "absolute",
          ...animation.fourthCircle.position,
          zIndex: 1,
          opacity: 0.8,
          backgroundColor: "var(--circle-bottom)",
          margin: "auto"
        }}
        animate={fourthControls}
        initial={{
          scale: animation.fourthCircle.scale[0],
        }}
      />
      <motion.div
        style={{
          height: isWidget ? "clamp(120px, 20vmin, 240px)" : "clamp(28vh, 40vw, 63vh)",
          width: isWidget ? "clamp(120px, 20vmin, 240px)" : "clamp(28vh, 40vw, 63vh)",
          borderRadius: "50%",
          position: "absolute",
          ...animation.thirdCircle.position,
          zIndex: 2,
          opacity: 0.8,
          backgroundColor: "var(--circle-mid-bottom)",
          margin: "auto"
        }}
        animate={thirdControls}
        initial={{
          scale: animation.thirdCircle.scale[0],
        }}
      />
      <motion.div
        style={{
          height: isWidget ? "clamp(90px, 15vmin, 180px)" : "clamp(21vh, 30vw, 43vh)",
          width: isWidget ? "clamp(90px, 15vmin, 180px)" : "clamp(21vh, 30vw, 43vh)",
          borderRadius: "50%",
          position: "absolute",
          ...animation.secondCircle.position,
          zIndex: 3,
          opacity: 0.8,
          backgroundColor: "var(--circle-mid-top)",
          margin: "auto"
        }}
        animate={secondControls}
        initial={{
          scale: animation.secondCircle.scale[0],
        }}
      />
      <motion.div
        style={{
          height: isWidget ? "clamp(60px, 10vmin, 120px)" : "clamp(14vh, 20vw, 24vh)",
          width: isWidget ? "clamp(60px, 10vmin, 120px)" : "clamp(14vh, 20vw, 24vh)",
          borderRadius: "50%",
          position: "absolute",
          ...animation.firstCircle.position,
          zIndex: 4,
          opacity: 0.8,
          backgroundColor: "var(--circle-top)",
          margin: "auto"
        }}
        animate={firstControls}
        initial={{
          scale: animation.firstCircle.scale[0],
        }}
      />
    </div>
  );
};
