import { motion } from "framer-motion";

const ExerciseAnimation = () => {
  return (

      <Ping />

  );
};

const LOOP_DURATION = 4;

const Ping = () => {
  return (
    <div> 

      <Hold delay={0} />
      <Inhale delay={LOOP_DURATION * 0.25} />
      <Inhale delay={LOOP_DURATION * 0.50} />
      <Inhale delay={LOOP_DURATION * 0.75} />


    </div>
  );
};


const Inhale = ({ delay }: { delay: number }) => {
  return (
    <motion.span
    style={{
      x: "50%",
      y: "50%",
    }}
      initial={{
        opacity: 0,
        scale: 2,
        x: "-50%",
        y: "-50%",
        
      }}
      animate={{
        opacity: [0, 0.3, 0.7, 0.7, 0.3],
        scale: 4,
      }}
      transition={{
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 19,
        times: [0, 0.5, 0.5, 1],
        duration: LOOP_DURATION,
        ease: "easeInOut",
        delay,
      }}
      className=" opacity-1 fixed top-1/2 left-1/2
      h-[25vw] w-[25vw] rounded-full  
      bg-gradient-to-br from-[var(--gradient-1-1)] to-[var(--gradient-1-2)]-500/20 
      shadow-m [#ffcec5]-500/20 overflow-auto"
    />
  );
};
const Hold = ({ delay }: { delay: number }) => {
  return (
    <motion.span
    style={{
      x: "50%",
      y: "50%",
    }}
      initial={{
        opacity: 0,
        scale: 4,
        x: "-50%",
        y: "-50%",
        
      }}
      animate={{
        opacity: [0, 0.3, 0.7, 0.7, 0.3, 0],
        scale: 2,
      }}
      transition={{
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 19,
        times: [0, 0.5, 0.5, 1],
        duration: 8,
        ease: "easeInOut",
        delay,
      }}
      className=" opacity-1 fixed top-1/2 left-1/2
      h-[25vw] w-[25vw] rounded-full  
      bg-gradient-to-br from-[var(--gradient-1-1)] to-[var(--gradient-1-2)]-500/20 
      shadow-m [#ffcec5]-500/20 overflow-auto"
    />
  );
};
const Exhale = ({ delay }: { delay: number }) => {
  return (
    <motion.span
    style={{
      x: "50%",
      y: "50%",
    }}
      initial={{
        opacity: 0,
        scale: 4,
        x: "-50%",
        y: "-50%",
        
      }}
      animate={{
        opacity: [0, 0.3, 0.7, 0.7, 0.3, 0],
        scale: 2,
      }}
      transition={{
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 19,
        times: [0, 0.5, 0.5, 1],
        duration: 8,
        ease: "easeInOut",
        delay,
      }}
      className=" opacity-1 fixed top-1/2 left-1/2
      h-[25vw] w-[25vw] rounded-full  
      bg-gradient-to-br from-[var(--gradient-1-1)] to-[var(--gradient-1-2)]-500/20 
      shadow-m [#ffcec5]-500/20 overflow-auto"
    />
  );
};

export default ExerciseAnimation;