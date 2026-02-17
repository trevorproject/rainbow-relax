import { BrowserRouter as Router, useLocation, useNavigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import { AppRoutes } from "./router/routes";
import { init } from "./i18n/init";
import { MainAnimationProvider } from "./context/MainAnimationProvider";
import { AudioProvider } from "./context/AudioProvider";
import { WidgetConfigProvider } from "./context/WidgetConfigProvider";
import { ConsentProvider } from "./context/ConsentProvider";
import GA4 from "./components/GA4";
import { SoundControlButton } from "./components/SoundControl";
import { useContext, useEffect, useRef } from "react";
import { AudioContext } from "./context/AudioContext";
import { useTranslation } from "react-i18next";
import { track, screenMap, EVENTS } from "./analytics/track";
import { useConsent } from "./hooks/useConsent";
import { RoutesEnum } from "./router/routesEnum";

init();

function SoundControlWrapper() {
  const { showSoundControl } = useContext(AudioContext);
  return showSoundControl ? <SoundControlButton /> : null;
}

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { hasConsented } = useConsent();
  const openedRef = useRef(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const forceConsent = urlParams.get('forceConsent') === 'true';
    
    const shouldRedirect = (!hasConsented || forceConsent) && location.pathname !== RoutesEnum.CONSENT;
    
    if (shouldRedirect) {
      const consentPath = `${RoutesEnum.CONSENT}${location.search}`;
      navigate(consentPath, { replace: true });
    }
  }, [hasConsented, location.pathname, location.search, navigate]);

  useEffect(() => {
    if (openedRef.current) return;
    const locale = i18n.language?.startsWith("es") ? "es" : "en";
    track(EVENTS.APP_OPENED, { locale });
    openedRef.current = true;
  }, [i18n.language]);

  useEffect(() => {
    const locale = i18n.language?.startsWith("es") ? "es" : "en";

    const screen =
      (screenMap[location.pathname] ??
        location.pathname.replace(/^\//, "")) || "welcome";

    track(EVENTS.SCREEN_VIEW, { screen, locale });
  }, [location.pathname, i18n.language]);

  const isWelcomePage =
    location.pathname === "/" || location.pathname === "/index.html";
  const isBreathingPage = location.pathname === "/breathing";
  const isThankYouPage = location.pathname === RoutesEnum.THANKYOU;

  return (
    <div className="min-h-screen flex flex-col text-[var(--color-text)] ">
      {isWelcomePage && (
        <header data-testid="navbar-header">
          <NavBar />
        </header>
      )}

      <main className="flex-grow flex flex-col items-center justify-center">
        <AppRoutes />
      </main>
      {!isWelcomePage && !isBreathingPage && !isThankYouPage && <SoundControlWrapper />}
    </div>
  );
}

function App() {
  const basePath = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

  return (
    <ConsentProvider>
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
    </ConsentProvider>
  );
}

export default App;
