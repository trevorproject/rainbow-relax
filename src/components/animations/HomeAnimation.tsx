import AnimatedBlob from "./AnimatedBlob";

const LOOP_DURATION = 6;

const DELAYS = [
  0,
  LOOP_DURATION * 0.25,
  LOOP_DURATION * 0.50,
  LOOP_DURATION * 0.75,
  LOOP_DURATION * 0.1,
];

const HomeAnimation = () => (
  <>
    {DELAYS.map((delay, i) => (
      <AnimatedBlob
        key={i}
        style={{ x: "50%", y: "50%" }}
        initial={{ opacity: 0, scale: 4, x: "-50%", y: "-50%" }}
        animate={{ opacity: [0, 0.3, 0.7, 0.7, 0.3, 0], scale: 2 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 3.6,
          times: [0, 0.15, 0.35, 0.65, 0.85, 1],
          duration: LOOP_DURATION,
          ease: "easeInOut",
          delay,
        }}
      />
    ))}
  </>
);

export default HomeAnimation;
