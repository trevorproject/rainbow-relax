import { motion } from "framer-motion";

export const MainAnimation = () => {
  return (
    <div className="flex justify-center items-center opacity-80 absolute left-0 z-10">
      <motion.div
        className="h-[850px] w-[850px] rounded-full absolute"
        style={{ backgroundColor: 'var(--circle-bottom)' }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Infinity,
          times: [0, 0.3, 1],
        }}
      ></motion.div>
      <motion.div
        className="h-[700px] w-[700px] rounded-full absolute"
        style={{ backgroundColor: 'var(--circle-mid-bottom)' }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Infinity,
          times: [0, 0.3, 1],
        }}

      ></motion.div>
      <motion.div
        className="h-[550px] w-[550px] rounded-full absolute"
        style={{ backgroundColor: 'var(--circle-mid-top)' }}
        animate={{ scale: [1, 1.2, 1]}}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Infinity,
          times: [0, 0.3, 1],
        }}
      ></motion.div>
      <motion.div
        className="h-[400px] w-[400px] rounded-full absolute "
        style={{ backgroundColor: 'var(--circle-top)' }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Infinity,
          times: [0, 0.3, 1],
        }}
      ></motion.div>
    </div>
  );
};
