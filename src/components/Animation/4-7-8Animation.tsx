import { motion, useAnimate, AnimationPlaybackControls } from "framer-motion";
import { useEffect, useState } from "react";

const Exercise478 = ({isPaused}: {isPaused: boolean}) => {
  return (
    <div>
      <BreathingSequence isPaused={isPaused}/>
      
    </div>
  );
};


const BreathingSequence = ({isPaused}: {isPaused: boolean}) => {
  return (
    <div>
      <Inhale delay={0} isPaused={isPaused}/>
      <Inhale4 delay={.5} isPaused={isPaused}/> 
      <Inhale4 delay={1} isPaused={isPaused}/> 
      <Inhale4 delay={1.5} isPaused={isPaused}/>
      <Inhale2 delay={0} isPaused={isPaused}/>
      <Inhale3 delay={0} isPaused={isPaused}/>

 


    </div>
  );
};

const Inhale = ({ delay, isPaused }: { delay: number, isPaused: boolean }) => {
 const [scope, animate] = useAnimate();
  const [controls, setControls] = useState<AnimationPlaybackControls | undefined>()
  const ANIMATION_DURATION = 19;

  useEffect(()=>{
    const animation = animate(scope.current,{
          opacity: [0.3, 0.5, 0.5, 0.3],
        scale: [1.5, 3.5, 3.5, 1.5],
    }, {
      
        repeat: Infinity,
        repeatType: "loop",
        duration: ANIMATION_DURATION,
        ease: ["easeInOut", "circOut"] ,
        times: [0, 0.21, 0.58, 1],
        delay,
      })
    setControls(animation);
  }, [animate, delay, scope]);

  // Handle pause/resume
  useEffect(()=>{
    if(isPaused){
      controls?.pause();
    } else {
      controls?.play();
    }
  },[isPaused, controls])
  
  return (
    <motion.span
    ref={scope}
      style={{
        x: "50%",
        y: "50%",
      }}
      initial={{
        opacity: 0,
        scale: 1.5,
        x: "-50%",
        y: "-50%",
      }}
      
      className=" opacity-1 fixed top-1/2 left-1/2
      h-[25vw] w-[25vw] rounded-full  
      bg-gradient-to-br from-[var(--gradient-1-1)] to-[var(--gradient-1-2)]-500/20 
      shadow-m [#ffcec5]-500/20 overflow-auto"/>
  );
};



const Inhale2 = ({ delay, isPaused }: { delay: number, isPaused: boolean }) => {
 const [scope, animate] = useAnimate();
  const [controls, setControls] = useState<AnimationPlaybackControls | undefined>()
  const ANIMATION_DURATION = 19;

  useEffect(()=>{
    const animation = animate(scope.current,{
          opacity: [0.3, 0.7, 0.7, 0.5],
        scale: [1.5, 3, 3, 1.5],
    }, {
      
        repeat: Infinity,
        repeatType: "loop",
        duration: ANIMATION_DURATION,
        ease: ["easeInOut", "circOut"] ,
        times: [0, 0.21, 0.58, 1],
        delay,
      })
    setControls(animation);
  }, [animate, delay, scope]);

  useEffect(()=>{
    if(isPaused){
      controls?.pause();
    } else {
      controls?.play();
    }
  },[isPaused, controls])
  
  return (
    <motion.span
    ref={scope}
      style={{
        x: "50%",
        y: "50%",
      }}
      initial={{
        opacity: 0,
        scale: 1.5,
        x: "-50%",
        y: "-50%",
      }}
      
      className=" opacity-1 fixed top-1/2 left-1/2
      h-[25vw] w-[25vw] rounded-full  
      bg-gradient-to-br from-[var(--gradient-1-1)] to-[var(--gradient-1-2)]-500/20 
      shadow-m [#ffcec5]-500/20 overflow-auto"/>
  );
};

const Inhale3 = ({ delay, isPaused }: { delay: number, isPaused: boolean }) => {
  const [scope, animate] = useAnimate();
  const [controls, setControls] = useState<AnimationPlaybackControls | undefined>()
  const ANIMATION_DURATION = 19;

  useEffect(()=>{
    const animation = animate(scope.current,{
          opacity: [0.5, 0.9, 0.9, 0.7],
        scale: [1.5, 2.5, 2.5, 1.5],
    }, {
      
        repeat: Infinity,
        repeatType: "loop",
        duration: ANIMATION_DURATION,
        ease: ["easeInOut", "circOut"] ,
        times: [0, 0.21, 0.58, 1],
        delay,
      })
    setControls(animation);
  }, [animate, delay, scope]);

  useEffect(()=>{
    if(isPaused){
      controls?.pause();
    } else {
      controls?.play();
    }
  },[isPaused, controls])
  
  return (
    <motion.span
    ref={scope}
      style={{
        x: "50%",
        y: "50%",
      }}
      initial={{
        opacity: 0,
        scale: 1.5,
        x: "-50%",
        y: "-50%",
      }}
      
      className=" opacity-1 fixed top-1/2 left-1/2
      h-[25vw] w-[25vw] rounded-full  
      bg-gradient-to-br from-[var(--gradient-1-1)] to-[var(--gradient-1-2)]-500/20 
      shadow-m [#ffcec5]-500/20 overflow-auto"/>
  );
};
const Inhale4 = ({ delay, isPaused }: { delay: number, isPaused: boolean }) => {
  const [scope, animate] = useAnimate();
  const [controls, setControls] = useState<AnimationPlaybackControls | undefined>()
  const ANIMATION_DURATION = 19;

  useEffect(()=>{
    const animation = animate(scope.current,{
    opacity: [0.3, 0.0, 0.0, 0.1],
        scale: [1.5, 3.7, 3.5, 1.5],
    }, {
      
        repeat: Infinity,
        repeatType: "loop",
        duration: ANIMATION_DURATION,
        ease: ["easeInOut", "circOut"] ,
        times: [0, 0.21, 0.58, 1],
        delay,
      })
    setControls(animation);
  }, [animate, delay, scope]);

  useEffect(()=>{
    if(isPaused){
      controls?.pause();
    } else {
      controls?.play();
    }
  },[isPaused, controls])
  
  return (
    <motion.span
    ref={scope}
      style={{
        x: "50%",
        y: "50%",
      }}
      initial={{
        opacity: 0,
        scale: 1.5,
        x: "-50%",
        y: "-50%",
      }}
      
      className=" opacity-1 fixed top-1/2 left-1/2
      h-[25vw] w-[25vw] rounded-full  
      bg-gradient-to-br from-[var(--gradient-1-1)] to-[var(--gradient-1-2)]-500/20 
      shadow-m [#ffcec5]-500/20 overflow-auto"/>
  );
};
export default Exercise478;
