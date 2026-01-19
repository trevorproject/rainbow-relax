import { motion } from "framer-motion";

const WaitAnimation = () => {
  return (

      <Ping />

  );
};

const LOOP_DURATION = 1;

const Ping = () => {
  return (
    <div> 

      <Band delay={0} />
      <Band delay={LOOP_DURATION * 0.25} />
      <Band2 delay={0} />
      <Band2 delay={LOOP_DURATION * 0.25} />
      <Band3 delay={0} />
      <Band3 delay={LOOP_DURATION * 0.25} />
      <Band4 delay={0} />
      <Band4 delay={LOOP_DURATION * 0.25} />
      
    </div>
  );
};


const Band = ({ delay }: { delay: number }) => {
  return (
    <motion.span
    style={{
      x: "50%",
      y: "50%",
    }}
      initial={{
        opacity: 0.3,
        scale: 1.5,
        x: "-50%",
        y: "-50%",
        
      }}
      animate={{
        opacity: [0.5, 0.3, 0.7],
        scale: 1.5,
        x: "50%",
        y: "50%",
      }}
      transition={{
        repeat: 1,
        repeatType: "reverse",
        repeatDelay: 0.5,
        times: [0, 0.5, 0.5, 1],
        duration: 6,
        ease: "anticipate",
        delay,
      }}
      className=" opacity-1 fixed top-1/2 left-1/2
      h-[25vw] w-[25vw] rounded-full  
      bg-gradient-to-br from-[var(--gradient-1-1)] to-[var(--gradient-1-2)]-500/20 
      shadow-m [#ffcec5]-500/20 overflow-auto"
    />
  );
};
const Band2 = ({ delay }: { delay: number }) => {
  return (
    <motion.span
    style={{
      x: "50%",
      y: "50%",
    }}
      initial={{
        opacity: 0.3,
        scale: 1.5,
        x: "-50%",
        y: "-50%",
        
      }}
      animate={{
        opacity: [0.5, 0.3, 0.5],
        scale: 1.5,
        x: "-150%",
        y: "-150%",

      }}
      transition={{
        repeat: 1,
        repeatType: "reverse",
        repeatDelay: 0.5,
        times: [0, 0.5, 0.5, 1],
        duration: 5.9,
        ease: "anticipate",
        delay,
      }}
      className=" opacity-1 fixed top-1/2 left-1/2
      h-[25vw] w-[25vw] rounded-full  
      bg-gradient-to-br from-[var(--gradient-1-1)] to-[var(--gradient-1-2)]-500/20 
      shadow-m [#ffcec5]-500/20 overflow-auto"
    />
  );
};
const Band3 = ({ delay }: { delay: number }) => {
  return (
    <motion.span
    style={{
      x: "50%",
      y: "50%",
    }}
      initial={{
        opacity: 0.3,
        scale: 1.5,
        x: "-50%",
        y: "-50%",
        
      }}
      animate={{
        opacity: [0.5, 0.3, 0.3],
        scale: 1,
        x: "50%",
        y: "-150%",
      }}
      transition={{
        repeat: 1,
        repeatType: "reverse",
        repeatDelay: 0.5,
        times: [0, 0.5, 0.5, 1],
        duration: 6.2,
        ease: "anticipate",
        delay,
      }}
      className=" opacity-1 fixed top-1/2 left-1/2
      h-[25vw] w-[25vw] rounded-full  
      bg-gradient-to-br from-[var(--gradient-1-1)] to-[var(--gradient-1-2)]-500/20 
      shadow-m [#ffcec5]-500/20 overflow-auto"
    />
  );
};

const Band4 = ({ delay }: { delay: number }) => {
  return (
    <motion.span
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
      animate={{
        opacity: [0.3, 0.3, 0.2],
        scale: 1,
        x: "-150%",
        y: "50%",
      }}
      transition={{
        repeat: 1,
        repeatType: "reverse",
        repeatDelay: 0.5,
        times: [0, 0.5, 0.5, 1],
        duration: 6,
        ease: "anticipate",
        delay,
      }}
      className=" opacity-1 fixed top-1/2 left-1/2
      h-[25vw] w-[25vw] rounded-full  
      bg-gradient-to-br from-[var(--gradient-1-1)] to-[var(--gradient-1-2)]-500/20 
      shadow-m [#ffcec5]-500/20 overflow-auto"
    />
  );
};
export default WaitAnimation;
