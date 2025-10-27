import { motion } from "framer-motion";

const Exercise478 = () => {
  return (
    <div>
      <BreathingSequence />
    </div>
  );
};


const BreathingSequence = () => {
  return (
    <div>
      <Inhale delay={0}/>
      <Inhale4 delay={.5}/> 
      <Inhale4 delay={1}/> 
      <Inhale4 delay={1.5}/>
      <Inhale2 delay={0}/>

      <Inhale3 delay={0}/>

 


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
        scale: 1.5,
        x: "-50%",
        y: "-50%",
      }}
      animate={{
        opacity: [0.3, 0.5, 0.5, 0.3],
        scale: [1.5, 3.5, 3.5, 1.5],
      }}
      transition={{
        repeat: Infinity,
        repeatType: "loop",
        duration: 19,
        ease: ["easeInOut", "circOut"] ,
        times: [0, 0.21, 0.58, 1],
        delay,
      }}
      className=" opacity-1 fixed top-1/2 left-1/2
      h-[25vw] w-[25vw] rounded-full  
      bg-gradient-to-br from-[var(--gradient-1-1)] to-[var(--gradient-1-2)]-500/20 
      shadow-m [#ffcec5]-500/20 overflow-auto"/>
  );
};



const Inhale2 = ({ delay }: { delay: number }) => {
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
        opacity: [0.3, 0.7, 0.7, 0.5],
        scale: [1.5, 3, 3, 1.5],
      }}
      transition={{
        repeat: Infinity,
        repeatType: "loop",
        duration: 19,
        ease: ["easeInOut", "circOut"] ,
        times: [0, 0.21, 0.58, 1],
        delay,
      }}
      className=" opacity-1 fixed top-1/2 left-1/2
      h-[25vw] w-[25vw] rounded-full  
      bg-gradient-to-br from-[var(--gradient-1-1)] to-[var(--gradient-1-2)]-500/20 
      shadow-m [#ffcec5]-500/20 overflow-auto"/>
  );
};

const Inhale3 = ({ delay }: { delay: number }) => {
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
        opacity: [0.5, 0.9, 0.9, 0.7],
        scale: [1.5, 2.5, 2.5, 1.5],
      }}
      transition={{
        repeat: Infinity,
        repeatType: "loop",
        duration: 19,
        ease: ["easeInOut", "circOut"] ,
        times: [0, 0.21, 0.58, 1],
        delay,
      }}
      className=" opacity-1 fixed top-1/2 left-1/2
      h-[25vw] w-[25vw] rounded-full  
      bg-gradient-to-br from-[var(--gradient-1-1)] to-[var(--gradient-1-2)]-500/20 
      shadow-m [#ffcec5]-500/20 overflow-auto"/>
  );
};
const Inhale4 = ({ delay }: { delay: number }) => {
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
        opacity: [0.3, 0.0, 0.0, 0.1],
        scale: [1.5, 3.7, 3.5, 1.5],
      }}
      transition={{
        repeat: Infinity,
        repeatType: "loop",
        duration: 19,
        ease: ["easeInOut", "circOut"] ,
        times: [0, 0.21, 0.58, 1],
        delay,
      }}
      className=" opacity-1 fixed top-1/2 left-1/2
      h-[25vw] w-[25vw] rounded-full  
      bg-gradient-to-br from-[var(--gradient-1-1)] to-[var(--gradient-1-2)]-500/20 
      shadow-m [#ffcec5]-500/20 overflow-auto"/>
  );
};
export default Exercise478;