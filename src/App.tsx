import NavBar from "./components/NavBar";
import WelcomePage from "./components/WelcomePage";
import { init } from "./i18n/init";
import QuickEscape from "./components/QuickEscape";
import { MainAnimation } from "./components/MainAnimation";
import { MainAnimationProvider } from "./context/MainAnimationProvider";
import QuickStartPreset from "./components/QuickStartPreset";


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
          <QuickStartPreset/>
          <MainAnimation />
        </div>
      </div>
    </MainAnimationProvider>
  );
}

export default App;