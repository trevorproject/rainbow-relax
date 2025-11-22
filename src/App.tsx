import { BrowserRouter as Router, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import { AppRoutes } from "./router/routes";
import { init } from "./i18n/init";
import { MainAnimationProvider } from "./context/MainAnimationProvider";
import { AudioProvider } from "./context/AudioProvider";
import { WidgetConfigProvider } from "./context/WidgetConfigProvider";
import GA4 from "./components/GA4";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { track, screenMap } from "./analytics/track";

init();

function AppContent() {
  const location = useLocation();
  const { i18n } = useTranslation();
  const openedRef = useRef(false);

  useEffect(() => {
    if (openedRef.current) return;
    const locale = i18n.language?.startsWith("es") ? "es" : "en";
    track("app_opened", { locale });
    openedRef.current = true;
  }, [i18n.language]);

  useEffect(() => {
    const locale = i18n.language?.startsWith("es") ? "es" : "en";

    const screen = (screenMap[location.pathname] ?? location.pathname.replace(/^\//, "")) || "welcome";

    track("screen_view", { screen, locale });
  }, [location.pathname, i18n.language]);

  const isWelcomePage =
    location.pathname === "/" || location.pathname === "/index.html";

  return (
    <div className="min-h-screen flex flex-col text-[var(--color-text)] ">
      {isWelcomePage && (
        <header>
          <NavBar />
        </header>
      )}

      <main className="flex-grow flex flex-col items-center justify-center">
        <AppRoutes />
      </main>
    </div>
  );
}

function App() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <WidgetConfigProvider>
      <AudioProvider>
        <MainAnimationProvider>
          <Router basename={basePath}>
            <GA4 />
            <AppContent />
          </Router>
        </MainAnimationProvider>
      </AudioProvider>
    </WidgetConfigProvider>
  );
}

export default App;