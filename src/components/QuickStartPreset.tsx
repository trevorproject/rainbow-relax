import { useTranslation } from "react-i18next";
import React, { useState } from "react";
interface Params{
    onClick :(cycles:number)=>void
}
const QuickStartPreset = ({onClick}:Params) => {
      const { t } = useTranslation();
      const [showCustomOptions, setShowCustomOptions] = useState(false);
      const [customCycles, setCustomCycles] = useState<number |string>("");
      const isCustomValid = customCycles !== "" && Number(customCycles) >= 1;
     

  return (
    <div className="mt-10 flex flex-col items-center justify-center w-full gap-y-8">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-4 md:gap-x-8 items-center">
            <button
            onClick={()=> onClick(3)}
            type="button"
            className="w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center cursor-pointer transition-colors duration-300 
             hover:bg-violet-500 focus:outline-none"
              style={{ backgroundColor: "var(--circle-level-1)",
                fontSize:"clamp(0.5rem, 2vw, 1rem)"
               }}>
              <p
              className=" text-white font-bold"
              style={{fontFamily: "var(--font-global)"}}>
                1 min
              </p>
            </button>
            <button
             onClick={()=> onClick(9)}
             type="button"
             className="w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center cursor-pointer focus:outline-none"
               style={{ backgroundColor: "var(--circle-level-2 )",
                 fontSize:"clamp(0.5rem, 2vw, 1rem)"
                }}>
              <p
              className=" text-white font-bold"
              style={{fontFamily: "var(--font-global)"}}>
                3 min
              </p>
            </button>
            <button
            onClick={()=> onClick(16)}
            type="button"
            className="w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center cursor-pointer focus:outline-none"
              style={{ backgroundColor: "var(--circle-level-3)",
                fontSize:"clamp(0.5rem, 2vw, 1rem)"
               }}>
              <p
              className=" text-white font-bold"
              style={{fontFamily: "var(--font-global)"}}>
                5 min
              </p>
            </button>
            <button
            onClick={()=>setShowCustomOptions(!showCustomOptions)}
            type="button"
            className="w-20 h-20 md:w-28 md:h-28 rounded-full flex items-center justify-center cursor-pointer focus:outline-none"
            style={{ 
              backgroundColor: "var(--circle-custom)",
              fontSize:"clamp(0.5rem, 2vw, 1rem)" }}>
              <p
              className="text-white font-bold"
              style={{ fontFamily: "var(--font-global)" }}>
                {t("Custom")}
              </p>
            </button>
            {/*<div
              onClick={() => {onClick(3);}}
              className="w-17 h-17 md:w-28 md:h-28 rounded-full flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: "var(--circle-level-1)",
                fontSize:"clamp(0.5rem, 2vw, 1rem)"
               }}
            >
                <p className=" text-white font-bold"
                 style={{fontFamily: "var(--font-global)"}}
                 >1 min</p>
            </div>
            <div
              onClick={() => {onClick(9);}}
              className="w-17 h-17 md:w-28 md:h-28 rounded-full flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: "var(--circle-level-2)",
                fontSize:"clamp(0.5rem, 2vw, 1rem)" }}
            >
                <p className=" text-white font-bold"
                 style={{fontFamily: "var(--font-global)"}}
                 >3 min</p>
            </div>
            <div
              onClick={() => {onClick(16);}}
              className="w-17 h-17 md:w-28 md:h-28 rounded-full flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: "var(--circle-level-3)",
                fontSize:"clamp(0.5rem, 2vw, 1rem)" }}
            >
                <p className=" text-white font-bold"
                 style={{fontFamily: "var(--font-global)"}}
                 >5 min</p>
            </div>
            <div
              onClick={()=>setShowCustomOptions(!showCustomOptions)}
              className="w-17 h-17 md:w-28 md:h-28 rounded-full flex items-center justify-center cursor-pointer"
              style={{ 
                backgroundColor: "var(--circle-custom)",
                fontSize:"clamp(0.5rem, 2vw, 1rem)" }}
            >
                <p className=" text-white font-bold"
                style={{fontFamily: "var(--font-global)"}}
                >{t("Custom")}</p>
            </div>*/}
          </div>

          {showCustomOptions && (
            <>
            <div
             className="w-85 sm:w-64 md:w-80 lg:w-96 h-10 bg-white rounded-full flex items-center justify-center px-4">
              <input 
                type="number" 
                min="1"
                step="1"
                value={customCycles}
                onChange={(e)=>{
                  const value = e.target.value;
                  if (value===""){
                    setCustomCycles("");
                  }else{
                    const num = Number(value);
                    if(!isNaN(num) && num>=1){
                      setCustomCycles(value);
                    }
                  }
                  }
                }
                onKeyDown={(e)=>{
                  if (e.key=== "Enter" && isCustomValid){
                    const num = Number(customCycles);
                    if (!isNaN(num) && num >= 1){
                      const repetitions = Math.floor((num * 60) / 19);
                      onClick(repetitions);
                      setCustomCycles("");
                    }
                  }
                }}
                placeholder={t("cycles-number")}
                className="w-full h-full bg-transparent outline-none text-center text-gray-700 text-sm"    style={{ fontFamily: "var(--font-global)" }}
              />

            </div>
            <button
              type="button"
              disabled = {!isCustomValid}
              onClick={()=>{
                const num =Number(customCycles);
                if (!isNaN(num) && num >=1){
                  const repetitions = Math.floor((num * 60) / 19);
                  onClick(repetitions);
                  setCustomCycles("");
                }
              }}
              className={`w-25 sm:w-32 md:w-40 lg:w-48 h-10 rounded-full flex items-center justify-center ${
  isCustomValid ? "cursor-pointer" : "opacity-50 cursor-not-allowed"
}`}
              style={{backgroundColor: "var(--color-button)" }}
              >
                <h2
                className="text-sm text-white font-bold"
                style={{ fontFamily: "var(--font-global)" }}>
                  {t("Start")}
                </h2>
            </button>
            </>
          )}
        </div>
  );
};

export default QuickStartPreset;