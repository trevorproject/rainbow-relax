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
        <div className="pt-20 sm:pt-32 md:pt-40 lg:pt-[15rem] text-center"></div>
      </div>
    </div>
  );
};

export default WelcomePage;
