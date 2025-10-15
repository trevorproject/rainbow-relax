import { motion } from "framer-motion";

const Example = () => {
  return (

      <Ping />

  );
};

const LOOP_DURATION = 6;

const Ping = () => {
  return (
    <div> 

      <Band delay={0} />
      <Band delay={LOOP_DURATION * 0.25} />
      <Band delay={LOOP_DURATION * 0.50} />
      <Band delay={LOOP_DURATION * 0.75} />
      <Band delay={LOOP_DURATION * 0.1} />
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
        opacity: 0,
        scale: 3,
        x: "-50%",
        y: "-50%",
        
      }}
      animate={{
        opacity: [0, 0.3, 1, 1, 0.3, 0],
        scale: 1.5,
      }}
      transition={{
        repeat: Infinity,
        repeatType: "reverse",
        repeatDelay: 3.6,
        times: [0, 0.5, 0.5, 1],
        duration: LOOP_DURATION,
        ease: "easeInOut",
        delay,
      }}
      className=" opacity-50 fixed top-1/2 left-1/2
      h-[20vw] w-[20vw] rounded-full  
      bg-gradient-to-br from-[var(--color-button)] to-[var(--circle-bottom)]-500/20 
      shadow-m [var(--color-button)]-500/20 overflow-auto"
    />
  );
};

export default Example;