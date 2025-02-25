import "./App.css";
import { useTranslation } from "react-i18next";

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
