import "./App.css";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

function App() {
  const container = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ repeat: -1 });

      tl.to(".outer", {
        scale: 1.5,
        duration: 2,
        ease: "easeInOut",
      })
        .to(
          ".middle",
          {
            scale: 1.3,
            duration: 2,
            ease: "easeInOut",
          },
          "-=1.8"
        )
        .to(
          ".inner",
          {
            scale: 1.2,
            duration: 2,
            ease: "easeInOut",
          },
          "-=1.6"
        );
    },
    { scope: container }
  );

  return (
    <div>
      <div ref={container} className="container">
        <div
          className="box outer"
          style={{
            background: "#55A2FF",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="box middle"
            style={{
              background: "#2789FF",
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              className="box inner"
              style={{
                background: "#0071F8",
                width: "100px",
                height: "100px",
                borderRadius: "50%",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
