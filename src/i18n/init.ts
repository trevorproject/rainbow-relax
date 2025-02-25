import es from "./es";
import LanguageDetector from "i18next-browser-languagedetector";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const init = () =>
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        es: {
          translation: es,
        },
      },
      detection: {
        order: [
          "querystring",
          "localStorage",
          "cookie",
          "navigator",
          "htmlTag",
        ],
        caches: ["localStorage", "cookie"],
      },
      fallbackLng: "en",
    });
