import es from "./es";
import LanguageDetector from "i18next-browser-languagedetector";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en";

export const init = () =>
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      detection: {
        order: [
          "querystring",
          "cookie",
          "localStorage",
          "sessionStorage",
          "navigator",
          "htmlTag",
          "path",
          "subdomain",
        ],
        lookupQuerystring: "lng",
        lookupCookie: "i18next",
        lookupLocalStorage: "i18nextLng",
        lookupSessionStorage: "i18nextLng",
        lookupFromPathIndex: 0,
        lookupFromSubdomainIndex: 0,
        caches: ["localStorage", "cookie"],
        excludeCacheFor: ["cimode"],
        cookieMinutes: 10,
        cookieDomain: "myDomain",
        htmlTag: document.documentElement,
        cookieOptions: { path: "/", sameSite: "strict" },
        convertDetectedLanguage: "Iso15897",
      },
      supportedLngs: ["es", "en"],
      resources: {
        es: {
          translation: es,
        },
        en: {
          translation: en,
        },
      },

      fallbackLng: "es",
    });
