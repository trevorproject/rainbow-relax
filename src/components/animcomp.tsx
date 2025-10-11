import { motion } from "framer-motion";

const Example = () => {
  return (
    <div>
      <Ping />
    </div>
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
        translateX: "120%",
        translateY: "110%"
      }}

      initial={{
        opacity: 0,
        scale: 3,
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
      className="opacity-50 position: absolute justify-center items-center 
      h-60 w-60 sm:h-60 w-60 rounded-full border-[1px] 
      border-[var(--circle-bottom)] bg-gradient-to-br from-[var(--color-button)] to-[var(--circle-bottom)]-500/20 
      shadow-m [var(--color-button)]-500/20 overflow-auto"
    />
  );
};

export default Example;