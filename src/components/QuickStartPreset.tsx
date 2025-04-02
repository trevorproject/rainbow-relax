{/*import { useTranslation } from "react-i18next";*/}

const QuickStartPreset = () => {
  return (
    <div className="mt-10 flex flex-col items-center justify-center w-full gap-y-8">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-4 md:gap-x-8 items-center">
            <div
              className="w-10 h-10 md:w-20 md:h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--circle-level-1)",
                fontSize:"clamp(0.5rem, 2vw, 1rem)"
               }}
            >
                <p className=" text-white"
                 style={{fontFamily: "var(--font-global)"}}
                 >1 min</p>
            </div>
            <div
              className="w-10 h-10 md:w-20 md:h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--circle-level-2)",
                fontSize:"clamp(0.5rem, 2vw, 1rem)" }}
            >
                <p className=" text-white"
                 style={{fontFamily: "var(--font-global)"}}
                 >3 min</p>
            </div>
            <div
              className="w-10 h-10 md:w-20 md:h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--circle-level-3)",
                fontSize:"clamp(0.5rem, 2vw, 1rem)" }}
            >
                <p className=" text-white"
                 style={{fontFamily: "var(--font-global)"}}
                 >5 min</p>
            </div>
            <div
              className="w-10 h-10 md:w-20 md:h-20 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--circle-custom)",
                fontSize:"clamp(0.5rem, 2vw, 1rem)" }}
            >
                <p className=" text-white"
                style={{fontFamily: "var(--font-global)"}}
                >Costum</p>
            </div>
          </div>
          <div
            className="w-85 sm:w-64 md:w-80 lg:w-96 h-8 bg-white rounded-full flex items-center justify-center">
                <p className="text-sm text-gray-700"
                style={{fontFamily: "var(--font-global)"}}
                > Enter number of cycles</p>
          </div>
          <div
            className="w-24 sm:w-32 md:w-40 lg:w-48 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--color-button)" }}>
                <h2 className="text-sm text-white font-bold"
                style={{fontFamily: "var(--font-global)"}}
                >Start
                </h2>
          </div>
        </div>
  );
};

export default QuickStartPreset;

