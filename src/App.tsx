import QuickEscape from "./components/QuickEscape";

function App() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-[var(--background-global)] text-[var(--color-text)]"
      style={{ fontFamily: "var(--font-global)" }}
    >
      <QuickEscape />

      <h1 className="text-4xl font-bold mb-4">Breathing Exercise</h1>
      <button className="px-6 py-2 text-[var(--color-button-text)] bg-[var(--color-button)] rounded-md shadow-md hover:opacity-80">
        Botón
      </button>
      <div className="mt-10 flex space-x-4">
        <div
          className="w-30 h-30 rounded-full"
          style={{ backgroundColor: "var(--circle-level-1)" }}
        ></div>
        <div
          className="w-30 h-30 rounded-full"
          style={{ backgroundColor: "var(--circle-level-2)" }}
        ></div>
        <div
          className="w-30 h-30 rounded-full"
          style={{ backgroundColor: "var(--circle-level-3)" }}
        ></div>
        <div
          className="w-30 h-30 rounded-full"
          style={{ backgroundColor: "var(--circle-custom)" }}
        ></div>
      </div>

      <div className="mt-10 flex space-x-4">
        <div
          className="w-30 h-30 rounded-full"
          style={{ backgroundColor: "var(--circle-top)" }}
        ></div>
        <div
          className="w-30 h-30 rounded-full"
          style={{ backgroundColor: "var(--circle-mid-top)" }}
        ></div>
        <div
          className="w-30 h-30 rounded-full"
          style={{ backgroundColor: "var(--circle-mid-bottom)" }}
        ></div>
        <div
          className="w-30 h-30 rounded-full"
          style={{ backgroundColor: "var(--circle-bottom)" }}
        ></div>
      </div>
    </div>
  );
}

export default App;
