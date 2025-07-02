import { BrowserRouter as Router, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import { AppRoutes } from "./router/routes";
import { init } from "./i18n/init";
import { MainAnimationProvider } from "./context/MainAnimationProvider";
import { AudioProvider } from "./context/AudioProvider";


init();

function AppContent() {
  const location = useLocation();
  const isWelcomePage =
    location.pathname === "/" || location.pathname === "/index.html";
    return (
      <div className="min-h-screen flex flex-col text-[var(--color-text)]">
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
    <AudioProvider>
      <MainAnimationProvider>
        <Router basename={basePath}>
          <AppContent />
        </Router>
      </MainAnimationProvider>
    </AudioProvider>
  );
}

export default App;
