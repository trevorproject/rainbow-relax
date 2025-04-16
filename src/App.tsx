import NavBar from "./components/NavBar";
import WelcomePage from "./components/WelcomePage";
import { init } from "./i18n/init";
import QuickEscape from "./components/QuickEscape";
import { MainAnimationProvider } from "./context/MainAnimationProvider";

init();
function App() {
  return (
    <MainAnimationProvider>
      <div>
        <div>
          <NavBar />
        </div>
        <div className="flex flex-col items-center justify-center min-h-screen text-[var(--color-text)]">
          <QuickEscape />
          <WelcomePage />
        </div>
      </div>
    </MainAnimationProvider>
  );
}

export default App;
