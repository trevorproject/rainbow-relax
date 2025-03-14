import { useTranslation } from "react-i18next";

const WelcomePage = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap justify-center items-center max-w-[100rem] gap-10 px-4 md:gap-[5rem] md:px-8">
      <div className="flex max-w-[30rem]">
        <h2 className="font-bold text-[#4E4E4E] text-[35px] sm:text-[45px] md:text-[55px] lg:text-[65px] text-[--font-global] text-center md:text-left">
          {t("title-text")}
        </h2>
      </div>
      <div className="flex flex-col max-w-[50rem] items-start">
        <p className="text-[#4E4E4E] text-[20px] sm:text-[24px] md:text-[28px] lg:text-[30px] text-center text-[--font-global] ">
          {t("main-message")}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center w-full gap-y-8">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-4 md:gap-x-8 items-center">
            <div
              className="w-20 h-20 md:w-30 md:h-30 rounded-full"
              style={{ backgroundColor: "var(--circle-level-1)" }}
            ></div>
            <div
              className="w-20 h-20 md:w-30 md:h-30 rounded-full"
              style={{ backgroundColor: "var(--circle-level-2)" }}
            ></div>
            <div
              className="w-20 h-20 md:w-30 md:h-30 rounded-full"
              style={{ backgroundColor: "var(--circle-level-3)" }}
            ></div>
            <div
              className="w-20 h-20 md:w-30 md:h-30 rounded-full"
              style={{ backgroundColor: "var(--circle-custom)" }}
            ></div>
          </div>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-4 md:gap-x-8">
            <div
              className="w-20 h-20 md:w-30 md:h-30 rounded-full"
              style={{ backgroundColor: "var(--circle-top)" }}
            ></div>
            <div
              className="w-20 h-20 md:w-30 md:h-30 rounded-full"
              style={{ backgroundColor: "var(--circle-mid-top)" }}
            ></div>
            <div
              className="w-20 h-20 md:w-30 md:h-30 rounded-full"
              style={{ backgroundColor: "var(--circle-mid-bottom)" }}
            ></div>
            <div
              className="w-20 h-20 md:w-30 md:h-30 rounded-full"
              style={{ backgroundColor: "var(--circle-bottom)" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
