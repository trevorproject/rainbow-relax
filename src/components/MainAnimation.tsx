import { motion } from "framer-motion";

const MainAnimation = () => {
  return (
    <div className="flex justify-center items-center opacity-83 absolute left-0 z-10">
      <motion.div
        className="bg-(--circle-level-1) h-240 w-240 rounded-full z-10 absolute opacity-20"
        animate={{ scale: [1, 1.25, 1] }}
        transition={{
          duration: 7,
          ease: "easeInOut",
          repeat: Infinity,
          times: [0, 0.3, 1],
        }}
      ></motion.div>
      <motion.div
        className="bg-(--circle-level-1) h-210 w-210 rounded-full z-10 absolute opacity-30"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{
          duration: 7,
          ease: "easeInOut",
          repeat: Infinity,
          times: [0, 0.3, 1],
        }}
      ></motion.div>
      <motion.div
        className="bg-(--circle-level-1) h-180 w-180 rounded-full z-10 absolute opacity-40"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{
          duration: 7,
          ease: "easeInOut",
          repeat: Infinity,
          times: [0, 0.3, 1],
        }}
      ></motion.div>
      <motion.div
        className="bg-(--circle-level-1) h-150 w-150 rounded-full z-10 absolute opacity-50"
        // animate={{ scale: [1, 1.1, 1] }}
        // transition={{
        //   duration: 4,
        //   ease: "easeInOut",
        //   repeat: Infinity,
        // }}
      ></motion.div>
    </div>
  );
};

export default MainAnimation;
