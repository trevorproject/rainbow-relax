import { useTranslation } from "react-i18next";

const WelcomePage = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap justify-center items-start max-w-[70rem] gap-6 px-4 md:gap-[2rem] md:px-8">
      <div className="flex max-w-[20rem] items-start">
        <h2 className="font-bold text-[#4E4E4E] text-[30px] sm:text-[35px] md:text-[45px] lg:text-[50px] text-[--font-global] text-center md:text-left">
          {t("title-text")}
        </h2>
      </div>
      <div className="flex flex-col max-w-[40rem] items-start">
        <p className="text-[#4E4E4E] text-[14px] sm:text-[18px] md:text-[20px] lg:text-[22px] text-center text-[--font-global] ">
          {t("main-message")}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center w-full gap-y-8">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-4 md:gap-x-8 items-center">
            <div
              className="w-10 h-10 md:w-20 md:h-20 rounded-full"
              style={{ backgroundColor: "var(--circle-level-1)" }}
            ></div>
            <div
              className="w-10 h-10 md:w-20 md:h-20 rounded-full"
              style={{ backgroundColor: "var(--circle-level-2)" }}
            ></div>
            <div
              className="w-10 h-10 md:w-20 md:h-20 rounded-full"
              style={{ backgroundColor: "var(--circle-level-3)" }}
            ></div>
            <div
              className="w-10 h-10 md:w-20 md:h-20 rounded-full"
              style={{ backgroundColor: "var(--circle-custom)" }}
            ></div>
          </div>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-4 md:gap-x-8">
            <div
              className="w-10 h-10 md:w-20 md:h-20 rounded-full"
              style={{ backgroundColor: "var(--circle-top)" }}
            ></div>
            <div
              className="w-10 h-10 md:w-20 md:h-20 rounded-full"
              style={{ backgroundColor: "var(--circle-mid-top)" }}
            ></div>
            <div
              className="w-10 h-10 md:w-20 md:h-20 rounded-full"
              style={{ backgroundColor: "var(--circle-mid-bottom)" }}
            ></div>
            <div
              className="w-10 h-10 md:w-20 md:h-20 rounded-full"
              style={{ backgroundColor: "var(--circle-bottom)" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
