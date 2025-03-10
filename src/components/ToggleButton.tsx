import { useState } from "react";

const ToggleButton = () => {
  const [isOn, setIsOn] = useState(false);

  return (
    <button
      onClick={() => setIsOn(!isOn)}
      className="w-10 h-6 sm:w-14 sm:h-8 rounded-full relative bg-[var(--color-button)]"
    >
      <div
        className={`w-4 h-4 sm:w-6 sm:h-6 bg-white rounded-full absolute top-1 transition-transform ${
          isOn
            ? "translate-x-5 sm:translate-x-7"
            : "translate-x-1 sm:translate-x-1"
        }`}
      ></div>
    </button>
  );
};

export default ToggleButton;
