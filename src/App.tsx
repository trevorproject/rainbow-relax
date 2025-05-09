import { BrowserRouter as Router, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import { AppRoutes } from "./router/routes";
import { init } from "./i18n/init";
import { MainAnimationProvider } from "./context/MainAnimationProvider";

init();

function AppContent() {
  const location = useLocation();
  const isWelcomePage = location.pathname === "/";

  return (
    <>
      {isWelcomePage && <NavBar />}
      <div className="flex flex-col items-center justify-center min-h-screen text-[var(--color-text)]">
        <AppRoutes />
      </div>
    </>
  );
}

function App() {
  return (
    <MainAnimationProvider>
      <Router>
        <AppContent />
      </Router>
    </MainAnimationProvider>
  );
}

export default App;
