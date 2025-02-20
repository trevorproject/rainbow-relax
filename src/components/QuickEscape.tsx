import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function QuickEscape() {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [escCount, setEscCount] = useState<number>(0);
  const [resetTimeout, setResetTimeout] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (escCount === 0) {
          const timeout = window.setTimeout(() => {
            setEscCount(0);
          }, 1000);
          setResetTimeout(timeout);
        }
        setEscCount((prev) => prev + 1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    if (escCount === 3) {

      window.location.href = "https://google.com";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (resetTimeout !== null) clearTimeout(resetTimeout);
    };
  }, [escCount]); 
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="w-[450px] h-[250px] bg-[#FFFFFF] text-black p-10 rounded-[25px] relative border border-black flex flex-col justify-center">
        <button 
          onClick={() => setIsOpen(false)} 
          className="absolute top-4 right-6 hover:opacity-80 cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-7">Quick Exit</h2>
        <p className="text-sm mb-7">Press the ESC button three times to quickly leave our site.</p>
        <span 
          onClick={() => setIsOpen(false)} 
          className="text-black underline cursor-pointer"
        >
          Got it
        </span>
      </div>
    </div>
  );
}






