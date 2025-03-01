import "./App.css";
import { useTranslation } from "react-i18next";
import { init } from "./i18n/init";

init();

function App() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      <button
        onClick={() =>
          i18n.changeLanguage(i18n.language === "es" ? "en" : "es")
        }
      >
        change
      </button>
      <p>{t("Quick Exit")}</p>
      <p>{i18n.language}</p>
    </div>
  );
}

export default App;
