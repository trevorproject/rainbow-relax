import { useTranslation } from "react-i18next";

const ThankYouPage = () => {
  const { t } = useTranslation();
  const linkClass = "font-bold text-[#4E4E4E] mb-8 px-6 py-3 underline hover:opacity-80 transition";

  return (
    <div className="mt-10 flex flex-col items-center justify-center w-full gap-y-8 px-4">
      <h1 className="font-bold text-[#4E4E4E] text-[30px] sm:text-[35px] md:text-[40px] lg:text-[50px] text-center ">
        {t("repeat-instruction")}
      </h1>      
      <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 text-[var(--color-primary)]">
        <a href="https://www.thetrevorproject.org/breathing-exercise/"
        className={linkClass}
        >
        {t("try-again-label")}
        </a>
        <a
          href="https://www.thetrevorproject.mx/ayuda/"
          className={linkClass}
        >
          {t("get-help-label")}
        </a>
      </div>
      <a
          href="https://www.thetrevorproject.mx/dona/"
          className={linkClass}
    >
          {t("Donate")}
        </a>
      
    </div>
  );
};

export default ThankYouPage;