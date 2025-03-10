import NavBar from "./components/NavBar";
import WelcomePage from "./components/WelcomePage";

function App() {
  return (
    <>
      <div>
        <NavBar />
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--background-global)] text-[var(--color-text)]">
        <WelcomePage />
      </div>
    </>
  );
}

export default App;
