import "./App.css";
import { motion } from "framer-motion";

function App() {
  return (
    <>
      <motion.div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#55A2FF",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
        }}
        animate={{ scale: [1, 1.5, 1] }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <motion.div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#2789FF",
            width: "150px",
            height: "150px",
            borderRadius: "50%",
          }}
          animate={{ scale: [1, 1.3, 1] }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          <motion.div
            style={{
              backgroundColor: "#0071F8",
              width: "100px",
              height: "100px",
              borderRadius: "50%",
            }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        </motion.div>
      </motion.div>
    </>
  );
}

export default App;
