import { useState, useEffect, useRef} from "react";
import { X } from "lucide-react";


export default function QuickEscape() {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [counter, setCounter] = useState<number>(0);
  const resetTimeoutRef = useRef<number | null>(null);
  const isMobile = "ontouchstart" in window;

  const incrementCounter = () => {
    setCounter((prevCounter) => prevCounter + 1);
    if (resetTimeoutRef.current !== null) {
      clearTimeout(resetTimeoutRef.current);
    }
    resetTimeoutRef.current = window.setTimeout(() => {
      setCounter(0);
    }, 1000);
  };

  useEffect(() => {
    if (counter >= 3) {
      setTimeout(() => {
        window.location.href = "https://google.com"; 
      }, 0);
    }
  }, [counter]);


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isMobile && event.key === "Escape") {
        incrementCounter();
      }
    };

    const handleTouch = () => {
      if (isMobile) {
        incrementCounter();
      }
    };

    if (isMobile) {
      window.addEventListener("touchstart", handleTouch);
    } else {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (isMobile) {
        window.removeEventListener("touchstart", handleTouch);
      } else {
        window.removeEventListener("keydown", handleKeyDown);
      }
      if (resetTimeoutRef.current !== null) clearTimeout(resetTimeoutRef.current);
    };
  }, [isMobile]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        className="w-[450px] h-[250px] p-10 rounded-[25px] relative flex flex-col justify-center shadow-lg"
        style={{
          backgroundColor: "var(--color-button)",
          color: "var(--color-button-text)",
        }}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-6 hover:opacity-70 cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold mb-7">Quick Exit</h2>
        <p className="text-base mb-7">
          {isMobile
            ? "Tap the screen three times to quickly leave our site."
            : "Press the escape key three times to quickly leave our site."}
        </p>
        <span
          onClick={() => setIsOpen(false)}
          className="text-base underline cursor-pointer hover:opacity-70"
        >
          Got it
        </span>
      </div>
    </div>
  );
}

