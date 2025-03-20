import NavBar from "./components/NavBar";
import WelcomePage from "./components/WelcomePage";
import { init } from "./i18n/init";
import QuickEscape from "./components/QuickEscape";
        
init();
function App() {
  return (
    <>
      <div>
        <NavBar />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--background-global)] text-[var(--color-text)]">
        <QuickEscape />
        <WelcomePage />
      </div>
    </>



  );
}

export default App;
