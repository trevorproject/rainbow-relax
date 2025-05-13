import { useTranslation } from "react-i18next";
import QuickStartPreset from "./QuickStartPreset";
import { useContext } from "react";
import { MainAnimationContext } from "../context/MainAnimationContext";
import { NavLink } from "react-router";

const WelcomePage = () => {
  const { t } = useTranslation();
  const animation = useContext(MainAnimationContext);
  return (
    <div className="flex flex-wrap justify-center items-start max-w-[70rem] max-h-[50vh] gap-6 px-4 md:gap-[2rem] md:px-8">
      <div className="flex max-w-[20rem] items-start">
        <h2 className="font-bold text-[#4E4E4E] text-[30px] sm:text-[35px] md:text-[40px] lg:text-[50px] text-[--font-global] text-center md:text-left">
          {t("title-text")}
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
                animation.changeAnimation("main");
                break;
              case 3:
                animation.changeAnimation("wait");
                break;
              case 5:
                animation.changeAnimation("4-7-8");
                break;
            }
          }}
        />
        <NavLink to="/thank-you" >test-to-thanyou page</NavLink>
      </div>
    </div>
  );
};

export default WelcomePage;
