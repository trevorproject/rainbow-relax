import { motion } from "framer-motion";

const HomeAnimation = () => {
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
        repeatType: "reverse",
        repeatDelay: 3.6,
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

export default HomeAnimation;