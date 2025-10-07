import { useTranslation } from "react-i18next";
import QuickStartPreset from "./QuickStartPreset";
import { useContext, useEffect } from "react";
import { MainAnimationContext } from "../context/MainAnimationContext";

const WelcomePage = () => {
  const { t } = useTranslation();
  const animation = useContext(MainAnimationContext);
  useEffect(() => {
    animation.changeAnimation("main");
  }, []);

  return (
    <div className="flex flex-wrap justify-center items-start max-w-[70rem] max-h-[50vh] gap-6 px-4 md:gap-[2rem] md:px-8">
      <div className="flex max-w-[20rem] items-start">
        <h2 className="font-bold text-[#4E4E4E] text-[30px] sm:text-[35px] md:text-[40px] lg:text-[50px] text-[--font-global] text-center md:text-left">
          {t("title-text")}
        {/*Explanation*/}
      <span className="cursor-pointer text-center"></span>
      <button id='infoButton' title={t("Explanation478")}
      
        className="hover:underline flex px-3.5 sm:px-3.5 py-1 sm:py-1 text-[var(--color-button)] bg-[var(--color-button-text)] rounded-full shadow-md hover:opacity-80 text-sm sm:text-base max-w-[5.5rem] items-center justify-center"
      >
        <p className="text-[--font-global] text-[15px] font-bold">i</p>
        
      </button>
      <p id='infoText' className= "visibility: hidden flex px-3.5 sm:px-3.5 py-1 sm:py-1 text-[--font-global] text-[15px] text-[#4E4E4E] bg-[var(--color-button-text)] rounded-md">{t("Explanation478")}</p>
        </h2>
      </div>

      <div className="flex flex-col max-w-[40rem] items-start">
        <p className="text-[#4E4E4E] text-[14px] sm:text-[18px] md:text-[20px] lg:text-[22px] text-center text-[--font-global] ">
          {t("main-message")}
        </p>
        <QuickStartPreset
          onClick={(cycles) => {
            switch (cycles) {
              case 1:
                animation.changeAnimation("wait");
                break;
              case 3:
                animation.changeAnimation("wait");
                break;
              case 5:
                animation.changeAnimation("wait");
                break;
            }
          }}
        />
      </div>
    </div>
  );
};

export default WelcomePage;
