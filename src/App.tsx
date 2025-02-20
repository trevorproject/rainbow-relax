import "./App.css";
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import translations from "./utils/i18n-es-en";

i18n.use(initReactI18next).init({
  resources: {
    es: {
      translation: translations,
    },
  },
  lng: "es",
  fallbackLng: "en",
});

function App() {
  const { t } = useTranslation();
  return (
    <div>
      <p>{t("This is just a new proof")}</p>
      <p>{t("Welcome")}</p>
    </div>
  );
}

export default App;
